/**
 * @file github-bot 入口文件
 * @author xuexb <fe.xiaowu@gmail.com>
 */

require('dotenv').config()

const EventEmitter = require('events')
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const requireDir = require('require-dir')
const { verifySignature } = require('./utils')
const issueActions = requireDir('./modules/issues')
const pullRequestActions = requireDir('./modules/pull_request')
const releasesActions = requireDir('./modules/releases')
const app = new Koa()
const githubEvent = new EventEmitter()
const { appLog, accessLog } = require('./logger')

app.use(bodyParser())

app.use(ctx => {
  let eventName = ctx.request.headers['x-github-event']
  if (eventName && verifySignature(ctx.request)) {
    const payload = ctx.request.body
    const action = payload.action || payload.ref_type

    if (action) {
      eventName += `_${action}`
    }

    accessLog.info(`receive event: ${eventName}`)

    githubEvent.emit(eventName, {
      repo: payload.repository.name,
      payload
    })

    ctx.body = 'Ok.'
  } else {
    ctx.body = 'Go away.'
  }
})

const actions = Object.assign({}, issueActions, pullRequestActions, releasesActions)
Object.keys(actions).forEach((key) => {
  actions[key](githubEvent.on.bind(githubEvent))
  appLog.info(`bind ${key} success!`)
})

const port = 8000
app.listen(port)
appLog.info('Listening on http://0.0.0.0:', port)

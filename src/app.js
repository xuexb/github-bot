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
const app = new Koa()
const githubEvent = new EventEmitter()
const { appLog, accessLog } = require('./logger')
const pkg = require('../package.json')

pkg.config = pkg.config || {}
pkg.config['github-bot'] = pkg.config['github-bot'] || {}

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

    githubEvent.emit(`${payload.repository.full_name}@${eventName}`, {
      repo: payload.repository.name,
      payload
    })

    ctx.body = 'Ok.'
  } else {
    ctx.body = 'Go away.'
  }
})

const events = {}
const actions = Object.assign(
  {},
  requireDir('./modules/issues'),
  requireDir('./modules/pullRequest'),
  requireDir('./modules/releases')
)
Object.keys(actions).forEach(key => {
  const name = actions[key].name
  if (events[name]) {
    appLog.error(`${name} is existed`)
    return
  }
  events[name] = actions[key].register
})
Object.keys(pkg.config['github-bot']).forEach(repo => {
  Object.keys(pkg.config['github-bot'][repo]).forEach(type => {
    Object.keys(pkg.config['github-bot'][repo][type]).forEach(name => {
      const config = pkg.config['github-bot'][repo][type][name]
      const register = events[`${type}/${name}`]
      if (config.enabled === true && register) {
        register((eventName, callback) => {
          githubEvent.on(`${repo}@${eventName}@source`, data => {
            callback(data, {
              config: pkg.config['github-bot'][repo],
              scope: config.data || {}
            })
          })
          githubEvent.on(`${repo}@${eventName}`, data => {
            githubEvent.emit(`${repo}@${eventName}@source`, data)
          })
        })
      } else if (config.enabled !== true) {
        appLog.info(`pkg.config.github-bot.${repo}.${type}.${name} is not enabled.`)
      } else {
        appLog.info(`pkg.config.github-bot.${repo}.${type}.${name} is config error.`)
      }
    })
  })
})

Object.keys(actions).forEach((key) => {
  actions[key](githubEvent.on.bind(githubEvent))
  appLog.info(`bind ${key} success!`)
})

const port = 8000
app.listen(port)
appLog.info('Listening on http://0.0.0.0:', port)

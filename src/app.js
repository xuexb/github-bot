/**
 * @file github-bot 入口文件
 * @author xuexb <fe.xiaowu@gmail.com>
 */

require('dotenv').config()
require('./register')

const event = require('./event')
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const { verifySignature } = require('./utils')
const app = new Koa()
const { appLog, accessLog } = require('./logger')
const port = 8000

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

    event.emit(`${payload.repository.full_name}@${eventName}`, {
      repo: payload.repository.name,
      payload
    })

    ctx.body = 'Ok.'
  } else {
    ctx.body = 'Go away.'
  }
})

app.listen(port)
appLog.info('Listening on http://0.0.0.0:', port)

/**
 * @file github-bot 入口文件
 * @author xuexb <fe.xiaowu@gmail.com>
 * @description 注册流程：
 *     1. 先获取所有的功能模块源代码，并以功能名称存放起来
 *     2. 读取 package.json 中的配置信息，以仓库+功能为粒度
 *     3. 判断功能的开关是否打开，如果打开则以功能的名称去查找对应的功能源代码
 *     4. 去注册个事件，以 `项目名@事件名` 注册，并再注册一个代理事件，因为触发 `项目名@事件名` 会有很多，而代理事件的 uid 是唯一的
 *     5. 在代理事件内去触发真实的功能方法的回调
 */

const event = require('./event')
const requireDir = require('require-dir')
const { appLog } = require('./logger')
const pkg = require('../package.json')
const KEY = 'github-bot'

pkg.config = pkg.config || {}
pkg.config[KEY] = pkg.config[KEY] || {}

const events = {
  uid: 0
}
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

Object.keys(pkg.config[KEY]).forEach(repoName => {
  const repo = pkg.config[KEY][repoName]

  Object.keys(repo).forEach(name => {
    const config = repo[name]
    const register = events[name]
    const isEnabled = String(config.enabled).toLowerCase() === 'true'

    if (isEnabled && register) {
      register((eventName, callback) => {
        const uid = events.uid++
        event.on(`${repoName}@${eventName}@source@${uid}`, data => {
          callback(data, {
            config: repo,
            scope: config.data || {}
          })
        })
        event.on(`${repoName}@${eventName}`, data => {
          event.emit(`${repoName}@${eventName}@source@${uid}`, data)
        })
      })
      appLog.info(`${repoName} - ${name} is register success.`)
    } else if (isEnabled && !register) {
      appLog.info(`${repoName} - ${name} is not register.`)
    } else if (!isEnabled) {
      appLog.info(`${repoName} - ${name} is not enabled.`)
    } else {
      appLog.info(`${repoName} - ${name} is config error.`)
    }
  })
})

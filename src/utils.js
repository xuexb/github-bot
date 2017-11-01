/**
 * @file 工具集
 * @author xuexb <fe.xiaowu@gmail.com>
 */
const crypto = require('crypto')
const { fixedTimeComparison } = require('cryptiles')

const utils = {

  /**
   * 验证请求
   *
   * @param  {Object} request req
   *
   * @return {boolean}
   */
  verifySignature (request) {
    let signature = crypto.createHmac('sha1', process.env.GITHUB_SECRET_TOKEN)
      .update(request.rawBody)
      .digest('hex')
    signature = `sha1=${signature}`
    return fixedTimeComparison(signature, request.headers['x-hub-signature'])
  },

  /**
   * 获取 package.json 里的 config.github-bot
   *
   * @return {Object}
   */
  getPkgConfig () {
    const pkg = require('../package.json')
    const config = Object.assign({
      'github-bot': {}
    }, pkg.config)

    return config['github-bot']
  },

  /**
   * 获取 commit log 前缀白名单
   *
   * @return {Array}
   */
  getPkgCommitPrefix () {
    const pkg = require('../package.json')
    const config = Object.assign({
      'validate-commit-msg': {
        'types': []
      }
    }, pkg.config)

    return config['validate-commit-msg'].types
  },

  /**
   * 转化成 Array
   *
   * @param  {string | Array} str 目标值
   *
   * @return {Array}
   */
  toArray (str) {
    if (str) {
      return Array.isArray(str) ? str : [str]
    }

    return str
  }
}

module.exports = utils

/**
 * @file 工具集
 * @author xuexb <fe.xiaowu@gmail.com>
 */

const format = require('string-template')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')
const { fixedTimeComparison } = require('cryptiles')
const { execSync } = require('child_process')
const gitPullOrClone = require('git-pull-or-clone')

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
   * 目录是否存在
   *
   * @param  {string}  file 路径
   *
   * @return {boolean}
   */
  isDirectory (file) {
    try {
      return fs.statSync(file).isDirectory()
    } catch (e) {
      if (e.code !== 'ENOENT') {
        throw e
      }

      return false
    }
  },

  /**
   * 获取本地 git 目录的第一个提交，主要处理当第一次给项目打标签时不能用2个标签去 ..
   *
   * @param {string} options.dir git 目录
   *
   * @return {string}
   */
  getFirstCommitHash ({ dir }) {
    return execSync(`cd ${dir} && git log --oneline --pretty=format:"%h"`).toString()
      .split(/\n+/).slice(-1)[0]
  },

  /**
   * 获取本地 git 目录的日志
   *
   * @param  {Object} options 配置数据
   * @param {string} options.dir git 目录
   * @param {string} options.before 开始版本号
   * @param {string} options.after 结束版本号
   * @param {string} options.html_url 预览的html地址， 用来拼 hash commit
   * @param {boolean} [options.hash=false] 是否携带 commit hash log
   *
   * @return {Array}
   */
  getCommitLog (options) {
    const shell = [
      'cd {dir}',
      options.hash
        ? 'git log {before}..{after} --no-merges --pretty=format:"- [%h]({html_url}/commit/%H) - %s, by @%aN <<%ae>>"'
        : 'git log {before}..{after} --no-merges --pretty=format:"- %s, by @%aN <<%ae>>"'
    ].join(' && ')

    return execSync(format(shell, options)).toString().split(/\n+/)
  },

  /**
   * 更新 github 项目
   *
   * @param  {string} options.repo 项目名
   *
   * @return {Promise}
   */
  updateRepo ({ url, repo }) {
    const repoDir = path.resolve(__dirname, '../github/', repo)

    return new Promise((resolve, reject) => {
      gitPullOrClone(url, repoDir, err => {
        if (err) {
          return reject(err)
        }

        resolve(repoDir)
      })
    })
  },

  /**
   * 获取本地 git 目录的 tag 列表
   *
   * @param  {Object} options 配置
   * @param {string} options.dir git 目录
   *
   * @return {Array}
   */
  getTags (options) {
    const shell = [
      'cd {dir}',
      'git describe --tags `git rev-list --tags --abbrev=0` --abbrev=0 | uniq'
    ].join(' && ')

    return execSync(format(shell, options)).toString().split(/\n+/).filter(tag => !!tag)
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

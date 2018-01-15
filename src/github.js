/**
 * @file github 操作库
 * @author xuexb <fe.xiaowu@gmail.com>
 */

/* eslint-disable camelcase */
const GitHub = require('github')
const { toArray } = require('./utils')
const { appLog } = require('./logger')

const github = new GitHub({
  debug: process.env.NODE_ENV === 'development'
})

github.authenticate({
  type: 'token',
  token: process.env.GITHUB_TOKEN
})

module.exports = {
  /**
   * issue 是否包含某 label
   *
   * @param {Object} payload data
   * @param {string} body 评论内容
   * @return {boolean}
   */
  async issueHasLabel (payload, label) {
    const owner = payload.repository.owner.login
    const repo = payload.repository.name
    const number = payload.issue.number

    try {
      const res = await github.issues.getIssueLabels({
        owner,
        repo,
        number
      })
      return res.data.map(v => v.name).indexOf(label) > -1
    } catch (e) {
      appLog.error(new Error(e))
      return false
    }
  },

  /**
   * PR 是否包含某 label
   *
   * @param {Object} payload data
   * @param {string} body 评论内容
   * @return {boolean}
   */
  async pullRequestHasLabel (payload, label) {
    const owner = payload.repository.owner.login
    const repo = payload.repository.name
    const number = payload.pull_request.number

    try {
      const res = await github.issues.getIssueLabels({
        owner,
        repo,
        number
      })
      return res.data.map(v => v.name).indexOf(label) > -1
    } catch (e) {
      appLog.error(new Error(e))
      return false
    }
  },

  /**
   * 评论 issue
   *
   * @param {Object} payload data
   * @param {string} body 评论内容
   * @return {boolean} 是否成功
   */
  async commentIssue (payload, body) {
    const owner = payload.repository.owner.login
    const repo = payload.repository.name
    const number = payload.issue.number

    try {
      await github.issues.createComment({
        owner,
        repo,
        number,
        body
      })
      return true
    } catch (e) {
      appLog.error(new Error(e))
      return false
    }
  },

  /**
   * 评论 PR
   *
   * @param {Object} payload data
   * @param {string} body 评论内容
   * @return {boolean} 是否成功
   */
  async commentPullRequest (payload, body) {
    const owner = payload.repository.owner.login
    const repo = payload.repository.name
    const number = payload.pull_request.number

    try {
      await github.issues.createComment({
        owner,
        repo,
        number,
        body
      })
      return true
    } catch (e) {
      appLog.error(new Error(e))
      return false
    }
  },

  /**
   * 关闭 issue
   *
   * @param {Object} payload data
   * @return {boolean} 是否成功
   */
  async closeIssue (payload) {
    const owner = payload.repository.owner.login
    const repo = payload.repository.name
    const number = payload.issue.number

    try {
      await github.issues.edit({
        owner,
        repo,
        number,
        state: 'closed'
      })
      return true
    } catch (e) {
      appLog.error(new Error(e))
      return false
    }
  },

  /**
   * 分派作者到 issues
   *
   * @param {Object} payload data
   * @param {string | Array} assign  用户id
   * @return {boolean} 是否成功
   */
  async addAssigneesToIssue (payload, assign) {
    const owner = payload.repository.owner.login
    const repo = payload.repository.name
    const number = payload.issue.number

    try {
      await github.issues.edit({
        owner,
        repo,
        number,
        assignees: toArray(assign)
      })
      return true
    } catch (e) {
      appLog.error(new Error(e))
      return false
    }
  },

  /**
   * 添加标签到 issue
   *
   * @param {Object} payload data
   * @param {string | Array} labels  标签
   * @return {boolean} 是否成功
   */
  async addLabelsToIssue (payload, labels) {
    const owner = payload.repository.owner.login
    const repo = payload.repository.name
    const number = payload.issue.number

    try {
      await github.issues.addLabels({
        owner,
        repo,
        number,
        labels: toArray(labels)
      })
      return true
    } catch (e) {
      appLog.error(new Error(e))
      return false
    }
  },

  /**
   * 添加标签到 PR
   *
   * @param {Object} payload data
   * @param {string | Array} labels  标签
   * @return {boolean} 是否成功
   */
  async addLabelsToPullRequest (payload, labels) {
    const owner = payload.repository.owner.login
    const repo = payload.repository.name
    const number = payload.pull_request.number

    try {
      await github.issues.addLabels({
        owner,
        repo,
        number,
        labels: toArray(labels)
      })
      return true
    } catch (e) {
      appLog.error(new Error(e))
      return false
    }
  },

  /**
   * 删除 PR 标签
   *
   * @param {Object} payload data
   * @param {string} name  标签名
   * @return {boolean} 是否成功
   */
  async removeLabelsToPullRequest (payload, name) {
    const owner = payload.repository.owner.login
    const repo = payload.repository.name
    const number = payload.pull_request.number

    try {
      await github.issues.removeLabel({
        owner,
        repo,
        number,
        name
      })
      return true
    } catch (e) {
      appLog.error(new Error(e))
      return false
    }
  },

  /**
   * 删除 issue 标签
   *
   * @param {Object} payload data
   * @param {string} name  标签名
   * @return {boolean} 是否成功
   */
  async removeLabelsToIssue (payload, name) {
    const owner = payload.repository.owner.login
    const repo = payload.repository.name
    const number = payload.issue.number
    try {
      await github.issues.removeLabel({
        owner,
        repo,
        number,
        name
      })
      return true
    } catch (e) {
      appLog.error(new Error(e))
      return false
    }
  },

  /**
   * 创建发布
   *
   * @param  {Object} payload                  data
   * @param  {string} options.tag_name         tag名
   * @param  {string} options.target_commitish tag hash
   * @param  {string} options.name             标题
   * @param  {string} options.body             内容
   * @param  {boolean} options.draft            是否为草稿
   * @param  {boolean} options.prerelease       是否预发布
   * @return {boolean} 是否成功
   */
  async createRelease (payload, { tag_name, target_commitish, name, body, draft, prerelease } = {}) {
    const owner = payload.repository.owner.login
    const repo = payload.repository.name
    try {
      await github.repos.createRelease({
        owner,
        repo,
        tag_name,
        target_commitish,
        name,
        body,
        draft,
        prerelease
      })
      return true
    } catch (e) {
      appLog.error(new Error(e))
      return false
    }
  },

  /**
   * 根据tag获取发布信息
   *
   * @param  {Object} payload          data
   * @param  {string} options.tag_name tag名
   *
   * @return {Object | null}
   */
  async getReleaseByTag (payload, { tag_name } = {}) {
    const owner = payload.repository.owner.login
    const repo = payload.repository.name
    try {
      const res = await github.repos.getReleaseByTag({
        owner,
        repo,
        tag: tag_name
      })
      return res.data
    } catch (e) {
      appLog.error(new Error(e))
      return null
    }
  },

  /**
   * 创建 review 请求
   *
   * @param  {Object} payload                             data
   * @param  {Array | string} options.reviewers           reviewer
   * @param  {Array | string} options.team_reviewers      team_reviewers
   *
   * @return {boolean} 是否成功
   */
  async createReviewRequest (payload, { reviewers, team_reviewers } = {}) {
    const owner = payload.repository.owner.login
    const repo = payload.repository.name
    const number = payload.pull_request.number
    try {
      await github.pullRequests.createReviewRequest({
        owner,
        repo,
        number,
        reviewers: toArray(reviewers),
        team_reviewers: toArray(team_reviewers)
      })
      return true
    } catch (e) {
      appLog.error(new Error(e))
      return false
    }
  },

  /**
   * 获得 repo 所有的tag
   *
   * @param {any} payload             data
   * @return {Array}
   */
  async getTags (payload) {
    const owner = payload.repository.owner.login
    const repo = payload.repository.name
    try {
      const res = await github.repos.getTags({
        owner,
        repo
      })
      return res.data
    } catch (e) {
      appLog.error(new Error(e))
      return []
    }
  },

  /**
   * 对比2个提交
   *
   * @param  {Object} payload      data
   * @param  {string} options.base 基点
   * @param  {string} options.head diff
   * @return {Array | null}
   */
  async compareCommits (payload, { base, head } = {}) {
    const owner = payload.repository.owner.login
    const repo = payload.repository.name
    try {
      const res = await github.repos.compareCommits({
        owner,
        repo,
        base,
        head
      })
      return res.data
    } catch (e) {
      appLog.error(new Error(e))
      return null
    }
  }
}

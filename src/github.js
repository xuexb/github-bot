/**
 * @file github 操作库
 * @author xuexb <fe.xiaowu@gmail.com>
 */

const GitHub = require('github')
const { toArray } = require('./utils')

const github = new GitHub({
  debug: process.env.NODE_ENV === 'development'
})

github.authenticate({
  type: 'token',
  token: process.env.GITHUB_TOKEN
})

module.exports = {

  github,

  /**
   * issue 是否包含某 label
   *
   * @param {Object} payload data
   * @param {string} body 评论内容
   */
  async issueHasLabel (payload, label) {
    const owner = payload.repository.owner.login
    const repo = payload.repository.name
    const number = payload.issue.number

    try {
      const res = github.issues.getIssueLabels({
        owner,
        repo,
        number
      })

      if (res.data.map(v => v.name).indexOf(label) === -1) {
        Promise.reject(new Error('issue no label'))
      }
    } catch (e) {
      Promise.reject(e)
    }
  },

  /**
   * PR 是否包含某 label
   *
   * @param {Object} payload data
   * @param {string} body 评论内容
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
      if (res.data.map(v => v.name).indexOf(label) === -1) {
        Promise.reject(new Error('pull request no label'))
      }
    } catch (e) {
      Promise.reject(e)
    }
  },

  /**
   * 评论 issue
   *
   * @param {Object} payload data
   * @param {string} body 评论内容
   */
  async commentIssue (payload, body) {
    const owner = payload.repository.owner.login
    const repo = payload.repository.name
    const number = payload.issue.number

    try {
      const res = await github.issues.createComment({
        owner,
        repo,
        number,
        body
      })
      return res
    } catch (e) {
      Promise.reject(e)
    }
  },

  /**
   * 评论 PR
   *
   * @param {Object} payload data
   * @param {string} body 评论内容
   */
  async commentPullRequest (payload, body) {
    const owner = payload.repository.owner.login
    const repo = payload.repository.name
    const number = payload.pull_request.number

    try {
      const res = await github.issues.createComment({
        owner,
        repo,
        number,
        body
      })
      return res
    } catch (e) {
      Promise.reject(e)
    }
  },

  /**
   * 关闭 issue
   *
   * @param {Object} payload data
   */
  async closeIssue (payload) {
    const owner = payload.repository.owner.login
    const repo = payload.repository.name
    const number = payload.issue.number

    try {
      const res = await github.issues.edit({
        owner,
        repo,
        number,
        state: 'closed'
      })
      return res
    } catch (e) {
      Promise.reject(e)
    }
  },

  /**
   * 分派作者到 issues
   *
   * @param {Object} payload data
   * @param {string | Array} assign  用户id
   */
  async addAssigneesToIssue (payload, assign) {
    const owner = payload.repository.owner.login
    const repo = payload.repository.name
    const number = payload.issue.number

    try {
      const res = await github.issues.edit({
        owner,
        repo,
        number,
        assignees: Array.isArray(assign) ? assign : [assign]
      })
      return res
    } catch (e) {
      Promise.reject(e)
    }
  },

  /**
   * 添加标签到 issue
   *
   * @param {Object} payload data
   * @param {string | Array} labels  标签
   */
  async addLabelsToIssue (payload, labels) {
    const owner = payload.repository.owner.login
    const repo = payload.repository.name
    const number = payload.issue.number

    try {
      const res = await github.issues.addLabels({
        owner,
        repo,
        number,
        labels: Array.isArray(labels) ? labels : [labels]
      })
      return res
    } catch (e) {
      Promise.reject(e)
    }
  },

  /**
   * 添加标签到 PR
   *
   * @param {Object} payload data
   * @param {string | Array} labels  标签
   */
  async addLabelsToPullRequest (payload, labels) {
    const owner = payload.repository.owner.login
    const repo = payload.repository.name
    const number = payload.pull_request.number

    try {
      const res = await github.issues.addLabels({
        owner,
        repo,
        number,
        labels: Array.isArray(labels) ? labels : [labels]
      })
      return res
    } catch (e) {
      Promise.reject(e)
    }
  },

  /**
   * 删除 PR 标签
   *
   * @param {Object} payload data
   * @param {string} name  标签名
   */
  async removeLabelsToPullRequest (payload, name) {
    const owner = payload.repository.owner.login
    const repo = payload.repository.name
    const number = payload.pull_request.number

    try {
      const res = await github.issues.removeLabel({
        owner,
        repo,
        number,
        name
      })
      return res
    } catch (e) {
      Promise.reject(e)
    }
  },

  /**
   * 删除 issue 标签
   *
   * @param {Object} payload data
   * @param {string} name  标签名
   */
  async removeLabelsToIssue (payload, name) {
    const owner = payload.repository.owner.login
    const repo = payload.repository.name
    const number = payload.issues.number
    try {
      const res = await github.issues.removeLabel({
        owner,
        repo,
        number,
        name
      })
      return res
    } catch (e) {
      Promise.reject(e)
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
   */
  async createRelease (payload, { tag_name, target_commitish, name, body, draft, prerelease }) {
    const owner = payload.repository.owner.login
    const repo = payload.repository.name
    try {
      const res = await github.repos.createRelease({
        owner,
        repo,
        tag_name,
        target_commitish,
        name,
        body,
        draft,
        prerelease
      })
      return res
    } catch (e) {
      Promise.reject(e)
    }
  },

  /**
   * 根据tag获取发布信息
   *
   * @param  {Object} payload          data
   * @param  {string} options.tag_name tag名
   *
   * @return {Promise}
   */
  async getReleaseByTag (payload, { tag_name }) {
    const owner = payload.repository.owner.login
    const repo = payload.repository.name
    try {
      const res = await github.repos.getReleaseByTag({
        owner,
        repo,
        tag: tag_name
      })
      return res
    } catch (e) {
      return false
    }
  },

  /**
   * 创建 review 请求
   *
   * @param  {Object} payload                             data
   * @param  {Array | string} options.reviewers           reviewer
   * @param  {Array | string} options.team_reviewers      team_reviewers
   *
   * @return {Promise}
   */
  async createReviewRequest (payload, { reviewers, team_reviewers }) {
    const owner = payload.repository.owner.login
    const repo = payload.repository.name
    const number = payload.pull_request.number
    try {
      const res = await github.pullRequests.createReviewRequest({
        owner,
        repo,
        number,
        reviewers: toArray(reviewers),
        team_reviewers: toArray(team_reviewers)
      })
      return res
    } catch (e) {
      Promise.reject(e)
    }
  },

  /**
   * 获得 repo 所有的tag
   *
   * @param {any} payload             data
   * @returns
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
      Promise.reject(e)
    }
  },

  async compareCommits (payload, { base, head }) {
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
      Promise.reject(e)
    }
  }
}

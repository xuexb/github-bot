/**
 * @file PR 提示标题正确性
 * @author xuexb <fe.xiaowu@gmail.com>
 */

const format = require('string-template')
const { getPkgCommitPrefix } = require('../../utils')
const {
  commentPullRequest,
  addLabelsToPullRequest,
  removeLabelsToPullRequest,
  pullRequestHasLabel
} = require('../../github')

const actions = getPkgCommitPrefix()
const match = title => {
  return actions.some(action => title.indexOf(`${action}:`) === 0)
}

const commentSuccess = [
  'hi @{user}，非常感谢您及时修正标题格式，祝您玩的开心！'
].join('')

const commentError = [
  'hi @{user}，非常感谢您的 PR ，',
  '但是您没有使用 [PR 标题规则](https://github.com/xuexb/github-bot#commit-log-和-pr-标题规则) 格式，',
  '请及时修改， 谢谢！'
].join('')

module.exports = {
  name: 'pullRequest/replyInvaidTitle',
  register (on) {
    if (actions.length) {
      on('pull_request_opened', ({ payload, repo }) => {
        if (!match(payload.pull_request.title)) {
          commentPullRequest(
            payload,
            format(commentError, {
              user: payload.pull_request.user.login
            })
          )

          addLabelsToPullRequest(payload, 'invalid')
        }
      })

      on('pull_request_edited', async ({ payload, repo }) => {
        if (match(payload.pull_request.title) && await pullRequestHasLabel(payload, 'invalid')) {
          commentPullRequest(
            payload,
            format(commentSuccess, {
              user: payload.pull_request.user.login
            })
          )

          removeLabelsToPullRequest(payload, 'invalid')
        }
      })
    }
  }
}

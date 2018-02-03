/**
 * @file 不规范issue则自动关闭
 * @author xuexb <fe.xiaowu@gmail.com>
 */

const format = require('string-template')
const {
  commentIssue,
  closeIssue,
  addLabelsToIssue
} = require('../../github')

const comment = [
  'hi @{user}，非常感谢您的反馈，',
  '但是由于您没有使用 [创建 issue](https://xuexb.github.io/github-bot/create-issue.html) 页面提交， 将直接被关闭， 谢谢！'
].join('')

module.exports = {
  name: 'issue/replyInvalid',
  register (on) {
    on('issues_opened', ({ payload }) => {
      const issue = payload.issue
      const opener = issue.user.login

      if (issue.body.indexOf('<!-- by create-issue -->') === -1) {
        commentIssue(
          payload,
          format(comment, {
            user: opener
          })
        )

        closeIssue(payload)
        addLabelsToIssue(payload, 'invalid')
      }
    })
  }
}

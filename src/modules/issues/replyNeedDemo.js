/**
 * @file 当有 need demo 标签时自动回复需要相关预览链接
 * @author xuexb <fe.xiaowu@gmail.com>
 */

const format = require('string-template')
const { commentIssue } = require('../../github')

const comment = 'hi @{user}，请提供一个可预览的链接，如： <https://codepen.io/pen?template=KgPZrE&editors=0010>'

module.exports = {
  name: 'issue/replyNeedDemo',
  register (on) {
    on('issues_labeled', ({ payload, repo }) => {
      if (payload.label.name === 'need demo') {
        commentIssue(
          payload,
          format(comment, {
            user: payload.issue.user.login
          })
        )
      }
    })
  }
}

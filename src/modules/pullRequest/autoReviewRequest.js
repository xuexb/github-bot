/**
 * @file PR 自动根据 tag 去添加 reviewer
 * @author xuexb <fe.xiaowu@gmail.com>
 */

const { getPkgConfig } = require('../../utils')
const { createReviewRequest } = require('../../github')

const config = getPkgConfig()
const assignMap = config.labelToAuthor || {}

module.exports = {
  name: 'pullRequest/autoReviewRequest',
  register (on) {
    on('pull_request_labeled', ({payload}) => {
      if (assignMap[payload.label.name]) {
        createReviewRequest(
          payload,
          {
            reviewers: assignMap[payload.label.name]
          }
        )
      }
    })
  }
}

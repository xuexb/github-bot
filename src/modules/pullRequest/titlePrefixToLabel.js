/**
 * @file PR 标题自动打标签
 * @author xuexb <fe.xiaowu@gmail.com>
 */

const {
  addLabelsToPullRequest,
  pullRequestHasLabel
} = require('../../github')

const getAction = title => {
  return (title.match(/^(\w+?):/) || [])[1]
}

const ACTION_TO_LABEL_MAP = {
  feat: 'enhancement',
  fix: 'bug',
  docs: 'document'
}

const handle = async ({ payload, repo }) => {
  const action = getAction(payload.pull_request.title)
  if (action && ACTION_TO_LABEL_MAP[action]) {
    const exist = await pullRequestHasLabel(payload, ACTION_TO_LABEL_MAP[action])
    if (!exist) {
      addLabelsToPullRequest(payload, ACTION_TO_LABEL_MAP[action])
    }
  }
}

module.exports = {
  name: 'pullRequest/titlePrefixToLabel',
  register (on) {
    on('pull_request_edited', handle)
    on('pull_request_opened', handle)
  }
}

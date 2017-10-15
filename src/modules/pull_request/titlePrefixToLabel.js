/**
 * @file PR 标题自动打标签
 * @author xuexb <fe.xiaowu@gmail.com>
 */

const {
    addLabelsToPullRequest,
    pullRequestHasLabel
} = require('../../github');

const getAction = title => {
    return (title.match(/^(\w+?):/) || [])[1];
};

const ACTION_TO_LABEL_MAP = {
    feat: 'enhancement',
    fix: 'bug',
    docs: 'document'
};

const handle = ({payload, repo}) => {
    const action = getAction(payload.pull_request.title);

    if (action && ACTION_TO_LABEL_MAP[action]) {
        pullRequestHasLabel(payload, ACTION_TO_LABEL_MAP[action]).catch(() => {
            addLabelsToPullRequest(payload, ACTION_TO_LABEL_MAP[action]);
        });
    }
};

module.exports = on => {
    on('pull_request_edited', handle);
    on('pull_request_opened', handle);
};

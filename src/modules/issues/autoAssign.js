/**
 * @file issue 自动 `assign` 给指定人员
 * @author xuexb <fe.xiaowu@gmail.com>
 */

const {addAssigneesToIssue} = require('../../github');

const assignMap = {
    bug: 'xuexb',
    enhancement: 'xuexb',
    question: 'xuexb'
};

function autoAssign(on) {
    on('issues_labeled', ({payload, repo}) => {
        if (assignMap[payload.label.name]) {
            addAssigneesToIssue(
                payload,
                assignMap[payload.label.name]
            );
        }
    });
}

module.exports = autoAssign;

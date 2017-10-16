/**
 * @file 不规范issue则自动关闭
 * @author xuexb <fe.xiaowu@gmail.com>
 */

const format = require('string-template');
const { commentIssue } = require('../../github');

const comment = 'hi @{user}，请提供一个可预览的链接，如： <https://codepen.io/pen?template=KgPZrE&editors=0010>';

function replyNeedDemo(on) {
    on('issues_labeled', ({ payload, repo }) => {
        if (payload.label.name === 'need demo') {
            commentIssue(
                payload,
                format(comment, {
                    user: payload.issue.user.login
                })
            );
        }

    });
}

module.exports = replyNeedDemo;

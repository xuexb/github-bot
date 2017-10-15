/**
 * @file 不规范issue则自动关闭
 * @author xuexb <fe.xiaowu@gmail.com>
 */

const format = require('string-template');
const {
    commentIssue,
    closeIssue,
    addLabelsToIssue
} = require('../../github');

const comment = [
    'hi @{user}，非常感谢您的反馈，',
    '但是由于您没有使用 [规范的issue](https://github.com/xuexb/github-bot#issue-规则) 格式， 将直接被关闭， 谢谢！'
].join('');

const match = str => {
    return /node version:\s*[vV]?(\d\.?)+/.test(str);
};

function replyInvalid(on) {
    on('issues_opened', ({payload}) => {
        const issue = payload.issue;
        const opener = issue.user.login;

        if (!match(issue.body)) {
            commentIssue(
                payload,
                format(comment, {
                    user: opener
                })
            );

            closeIssue(payload);
            addLabelsToIssue(payload, 'invalid');
        }
    });
}

module.exports = replyInvalid;

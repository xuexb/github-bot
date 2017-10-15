/**
 * @file github 操作库
 * @author xuexb <fe.xiaowu@gmail.com>
 */

const GitHub = require('github');
const {toArray} = require('./utils');

const github = new GitHub({
    debug: process.env.NODE_ENV === 'development'
});

github.authenticate({
    type: 'token',
    token: process.env.GITHUB_TOKEN
});

module.exports = {

    github,

    /**
     * issue 是否包含某 label
     *
     * @param {Object} payload data
     * @param {string} body 评论内容
     */
    issueHasLabel(payload, label) {
        const owner = payload.repository.owner.login;
        const repo = payload.repository.name;
        const number = payload.issue.number;

        return new Promise((resolve, reject) => {
            github.issues.getIssueLabels({
                owner,
                repo,
                number
            }).then(res => {
                if (res.data.map(v => v.name).indexOf(label) > -1) {
                    resolve();
                }
                else {
                    reject();
                }
            }, reject);
        });
    },

    /**
     * PR 是否包含某 label
     *
     * @param {Object} payload data
     * @param {string} body 评论内容
     */
    pullRequestHasLabel(payload, label) {
        const owner = payload.repository.owner.login;
        const repo = payload.repository.name;
        const number = payload.pull_request.number;

        return new Promise((resolve, reject) => {
            github.issues.getIssueLabels({
                owner,
                repo,
                number
            }).then(res => {
                if (res.data.map(v => v.name).indexOf(label) > -1) {
                    resolve();
                }
                else {
                    reject();
                }
            }, reject);
        });
    },

    /**
     * 评论 issue
     *
     * @param {Object} payload data
     * @param {string} body 评论内容
     */
    commentIssue(payload, body) {
        const owner = payload.repository.owner.login;
        const repo = payload.repository.name;
        const number = payload.issue.number;

        github.issues.createComment({
            owner,
            repo,
            number,
            body
        });
    },

    /**
     * 评论 PR
     *
     * @param {Object} payload data
     * @param {string} body 评论内容
     */
    commentPullRequest(payload, body) {
        const owner = payload.repository.owner.login;
        const repo = payload.repository.name;
        const number = payload.pull_request.number;

        github.issues.createComment({
            owner,
            repo,
            number,
            body
        });
    },

    /**
     * 关闭 issue
     *
     * @param {Object} payload data
     */
    closeIssue(payload) {
        const owner = payload.repository.owner.login;
        const repo = payload.repository.name;
        const number = payload.issue.number;

        github.issues.edit({
            owner,
            repo,
            number,
            state: 'closed'
        });
    },

    /**
     * 分派作者到 issues
     *
     * @param {Object} payload data
     * @param {string | Array} assign  用户id
     */
    addAssigneesToIssue(payload, assign) {
        const owner = payload.repository.owner.login;
        const repo = payload.repository.name;
        const number = payload.issue.number;

        github.issues.edit({
            owner,
            repo,
            number,
            assignees: Array.isArray(assign) ? assign : [assign]
        });
    },

    /**
     * 添加标签到 issue
     *
     * @param {Object} payload data
     * @param {string | Array} labels  标签
     */
    addLabelsToIssue(payload, labels) {
        const owner = payload.repository.owner.login;
        const repo = payload.repository.name;
        const number = payload.issue.number;

        github.issues.addLabels({
            owner,
            repo,
            number,
            labels: Array.isArray(labels) ? labels : [labels]
        });
    },

    /**
     * 添加标签到 PR
     *
     * @param {Object} payload data
     * @param {string | Array} labels  标签
     */
    addLabelsToPullRequest(payload, labels) {
        const owner = payload.repository.owner.login;
        const repo = payload.repository.name;
        const number = payload.pull_request.number;

        github.issues.addLabels({
            owner,
            repo,
            number,
            labels: Array.isArray(labels) ? labels : [labels]
        });
    },

    /**
     * 删除 PR 标签
     *
     * @param {Object} payload data
     * @param {string} name  标签名
     */
    removeLabelsToPullRequest(payload, name) {
        const owner = payload.repository.owner.login;
        const repo = payload.repository.name;
        const number = payload.pull_request.number;

        github.issues.removeLabel({
            owner,
            repo,
            number,
            name
        });
    },

    /**
     * 删除 issue 标签
     *
     * @param {Object} payload data
     * @param {string} name  标签名
     */
    removeLabelsToIssue(payload, name) {
        const owner = payload.repository.owner.login;
        const repo = payload.repository.name;
        const number = payload.issues.number;

        github.issues.removeLabel({
            owner,
            repo,
            number,
            name
        });
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
    createRelease(payload, {tag_name, target_commitish, name, body, draft, prerelease}) {
        const owner = payload.repository.owner.login;
        const repo = payload.repository.name;

        github.repos.createRelease({
            owner,
            repo,
            tag_name,
            target_commitish,
            name,
            body,
            draft,
            prerelease
        });
    },

    /**
     * 根据tag获取发布信息
     *
     * @param  {Object} payload          data
     * @param  {string} options.tag_name tag名
     *
     * @return {Promise}
     */
    getReleaseByTag(payload, {tag_name}) {
        const owner = payload.repository.owner.login;
        const repo = payload.repository.name;

        return github.repos.getReleaseByTag({
            owner,
            repo,
            tag: tag_name
        });
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
    createReviewRequest(payload, {reviewers, team_reviewers}) {
        const owner = payload.repository.owner.login;
        const repo = payload.repository.name;
        const number = payload.pull_request.number;

        return github.pullRequests.createReviewRequest({
            owner,
            repo,
            number,
            reviewers: toArray(reviewers),
            team_reviewers: toArray(team_reviewers)
        });
    },
};

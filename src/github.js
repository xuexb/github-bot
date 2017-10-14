/**
 * @file github 操作库
 * @author xuexb <fe.xiaowu@gmail.com>
 */

const GitHub = require('github');

const github = new GitHub({
    debug: process.env.NODE_ENV === 'development'
});

github.authenticate({
    type: 'token',
    token: process.env.GITHUB_TOKEN
});

module.exports = {
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

    getReleaseByTag(payload, {tag_name}) {
        const owner = payload.repository.owner.login;
        const repo = payload.repository.name;

        return github.repos.getReleaseByTag({
            owner,
            repo,
            tag: tag_name
        });
    }
};

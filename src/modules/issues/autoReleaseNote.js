/**
 * @file 根据 tag 自动 release
 * @author xuexb <fe.xiaowu@gmail.com>
 */

const {getReleaseByTag} = require('../../github');
const {cloneRepo, getTags} = require('../../utils');

function autoReleaseNote(on) {
    on('create_tag', ({payload, repo}) => {
        const repoDir = cloneRepo(payload.repository.clone_url, repo);
        const tags = getTags(repoDir);

        console.log(repoDir, tags);
    });
}

module.exports = autoReleaseNote;

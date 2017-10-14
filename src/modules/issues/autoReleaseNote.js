/**
 * @file 根据 tag 自动 release
 * @author xuexb <fe.xiaowu@gmail.com>
 */

const {getReleaseByTag, createRelease} = require('../../github');
const {cloneRepo, getTags, getFirstCommitHash, getCommitLog} = require('../../utils');

const RELEASE_CHANGE_MAP = {
    document: 'docs',
    feature: 'feat',
    bugfix: 'fix',
    close: 'close'
};

function autoReleaseNote(on) {
    on('create_tag', ({payload, repo}) => {
        getReleaseByTag(payload, {
            tag_name: payload.ref
        }).then(() => {}, () => {
            const repoDir = cloneRepo({
                url: payload.repository.clone_url,
                repo
            });
            const tags = getTags({
                dir: repoDir
            });
            const after = tags[0];
            const before = tags.length > 1 ? tags[1] : getFirstCommitHash({
                dir: repoDir
            });
            const log = getCommitLog({
                dir: repoDir,
                before,
                after
            });

            const hash = getCommitLog({
                dir: repoDir,
                before,
                after,
                html_url: payload.repository.html_url,
                hash: true
            });

            const changes = Object.keys(RELEASE_CHANGE_MAP).map(title => {
                return {
                    title,
                    data: log.filter(log => log.indexOf(`- ${RELEASE_CHANGE_MAP[title]}:`) === 0)
                }
            }).filter(v => v.data.length);

            let body = [];

            if (changes.length) {
                body.push('## Notable changes\n');
                changes.forEach(v => {
                    body.push([
                        `- ${v.title}`
                    ]);

                    v.data.forEach(line => body.push('    ' + line));
                });
            }

            if (hash.length) {
                body.push('\n## Commits\n');
                body = body.concat(hash);
            }

            if (body.length) {
                createRelease(payload, {
                    tag_name: payload.ref,
                    name: `${payload.ref} @${payload.repository.owner.login}`,
                    body: body.join('\n')
                });
            }
        });
    });
}

module.exports = autoReleaseNote;

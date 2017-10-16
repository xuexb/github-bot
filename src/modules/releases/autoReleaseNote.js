/**
 * @file 根据 tag 自动 release
 * @author xuexb <fe.xiaowu@gmail.com>
 */

const { getTags, compareCommits, getReleaseByTag, createRelease } = require('../../github');
const { updateRepo } = require('../../utils');

const RELEASE_CHANGE_MAP = {
    document: 'docs',
    feature: 'feat',
    bugfix: 'fix',
    close: 'close'
};

module.exports = on => {
    on('create_tag', async ({ payload, repo }) => {
        await getReleaseByTag(payload, {
            tag_name: payload.ref
        })
        try {
            const repoDir = await updateRepo({
                url: payload.repository.clone_url,
                repo
            });
            const tags = getTags(payload);
            const head = tags[0];
            const base = tags.length > 1 ? tags[1] : tags[0];

            const commits = await compareCommits(payload, {
                base,
                head
            }).commits;

            const changes = Object.keys(RELEASE_CHANGE_MAP).map(title => {
                return {
                    title,
                    data: commits.filter(commit => commit.commit.message.indexOf(`- ${RELEASE_CHANGE_MAP[title]}:`) === 0)
                }
            }).filter(v => v.data.length);

            const hashChanges = commits.map((commit) => {
                return `- [${commit.sha.substr(0,7)}](${commit.html_url}) - ${commit.commit.message}, by @${commit.commit.author.name} <<${commit.commit.author.email}>>`;
            });

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

            if (hashChanges.length) {
                body.push('\n## Commits\n');
                body = body.concat(hashChanges);
            }

            if (body.length) {
                createRelease(payload, {
                    tag_name: payload.ref,
                    name: `${payload.ref} @${payload.repository.owner.login}`,
                    body: body.join('\n')
                });
            }
        } catch (err) {
            console.error(err);
        }

    });
}

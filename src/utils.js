const format = require('string-template');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const {fixedTimeComparison} = require('cryptiles');
const {execSync, exec} = require('child_process');

const utils = {
    mentioned(body) {
        return body.includes(`@${process.env.GITHUB_BOT_NAME}`);
    },

    verifySignature(request) {
        let signature = crypto.createHmac('sha1', process.env.GITHUB_SECRET_TOKEN)
            .update(request.rawBody)
            .digest('hex');
        signature = `sha1=${signature}`;
        return fixedTimeComparison(signature, request.headers['x-hub-signature']);
    },

    getRepo(url) {
        return url.split('/')[1];
    },

    isDirectory(file) {
        try {
            return fs.statSync(file).isDirectory();
        }
        catch (e) {
            if (e.code !== 'ENOENT') {
                throw e;
            }

            return false;
        }
    },

    getFirstCommitHash({dir}) {
        return execSync(`cd ${dir} && git log --oneline --pretty=format:"%h"`).toString()
            .split(/\n+/).slice(-1)[0];
    },

    getCommitLog(options) {
        const shell = [
            'cd {dir}',
            options.hash
                ? 'git log {before}..{after} --no-merges --pretty=format:"- [%h]({html_url}/commit/%H) - %s, by @%cn"'
                : 'git log {before}..{after} --no-merges --pretty=format:"- %s, by @%cn"'
        ].join(' && ');

        return execSync(format(shell, options)).toString().split(/\n+/);
    },

    cloneRepo({url, repo}) {
        const repoDir = path.resolve(__dirname, '../github/', repo);

        if (!utils.isDirectory(repoDir)) {
            throw new Error(`${repoDir} 不是github目录!`);
        }

        execSync(`cd ${repoDir} && git pull`);

        return repoDir;
    },

    getTags({dir}) {
        return execSync(`cd ${dir} && git tag -l`).toString().split(/\n+/).filter(tag => !!tag).reverse();
    }
};

module.exports = utils;

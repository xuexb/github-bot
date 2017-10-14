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

    getActionLog({dir, before, after, action}) {
        return execSync(`cd ${dir} && FORMAT="- %s, by @%cn"
git log ${before}..${after} --no-merges --pretty=format:"$FORMAT" | grep ${action}`).toString();

    },

    cloneRepo(url, repo) {
        const repoDir = path.resolve(__dirname, '../github/', repo);

        if (!utils.isDirectory(repoDir)) {
            throw new Error(`${repoDir} 不是github目录!`);
        }

        execSync(`cd ${repoDir} && git pull`);

        return repoDir;
    },

    getTags(dir) {
        return execSync(`cd ${dir} && git tag -l`).toString().split(/\n+/).filter(tag => !!tag).reverse();
    }
};

module.exports = utils;

/**
 * @file 工具集
 * @author xuexb <fe.xiaowu@gmail.com>
 */

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

    /**
     * 验证签名
     *
     * @param  {Object} request req
     *
     * @return {boolean}
     */
    verifySignature(request) {
        let signature = crypto.createHmac('sha1', process.env.GITHUB_SECRET_TOKEN)
            .update(request.rawBody)
            .digest('hex');
        signature = `sha1=${signature}`;
        return fixedTimeComparison(signature, request.headers['x-hub-signature']);
    },

    /**
     * 获取项目名
     *
     * @param  {string} url xuexb/repo
     *
     * @return {string}     repo
     */
    getRepo(url) {
        return url.split('/')[1];
    },

    /**
     * 目录是否存在
     *
     * @param  {string}  file 路径
     *
     * @return {boolean}
     */
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

    /**
     * 获取本地 git 目录的第一个提交，主要处理当第一次给项目打标签时不能用2个标签去 ..
     *
     * @param {string} options.dir git 目录
     *
     * @return {string}
     */
    getFirstCommitHash({dir}) {
        return execSync(`cd ${dir} && git log --oneline --pretty=format:"%h"`).toString()
            .split(/\n+/).slice(-1)[0];
    },

    /**
     * 获取本地 git 目录的日志
     *
     * @param  {Object} options 配置数据
     * @param {string} options.dir git 目录
     * @param {string} options.before 开始版本号
     * @param {string} options.after 结束版本号
     * @param {string} options.html_url 预览的html地址， 用来拼 hash commit
     * @param {boolean} [options.hash=false] 是否携带 commit hash log
     *
     * @return {Array}
     */
    getCommitLog(options) {
        const shell = [
            'cd {dir}',
            options.hash
                ? 'git log {before}..{after} --no-merges --pretty=format:"- [%h]({html_url}/commit/%H) - %s, by @%cn"'
                : 'git log {before}..{after} --no-merges --pretty=format:"- %s, by @%cn"'
        ].join(' && ');

        return execSync(format(shell, options)).toString().split(/\n+/);
    },

    updateRepo({url, repo}) {
        const repoDir = path.resolve(__dirname, '../github/', repo);

        if (!utils.isDirectory(repoDir)) {
            throw new Error(`${repoDir} 不是github目录!`);
        }

        execSync(`cd ${repoDir} && git pull`);

        return repoDir;
    },

    /**
     * 获取本地 git 目录的 tag 列表
     *
     * @param  {string} options.dir git 目录
     *
     * @return {Array}
     */
    getTags({dir}) {
        return execSync(`cd ${dir} && git tag -l`).toString().split(/\n+/).filter(tag => !!tag).reverse();
    }
};

module.exports = utils;

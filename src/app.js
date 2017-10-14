/**
 * @file github-bot 入口文件
 * @author xuexb <fe.xiaowu@gmail.com>
 */

require('dotenv').config();

const EventEmitter = require('events');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const requireDir = require('require-dir');
const {verifySignature, getRepo} = require('./utils');
const issueActions = requireDir('./modules/issues');
const app = new Koa();
const githubEvent = new EventEmitter();

app.use(bodyParser());

app.use(ctx => {
    let eventName = ctx.request.headers['x-github-event'];
    if (eventName && verifySignature(ctx.request)) {
        const payload = ctx.request.body;
        const action = payload.action || payload.ref_type;

        if (action) {
            eventName += `_${action}`;
        }

        console.log(`receive event: ${eventName}`);

        if (payload.sender.login !== process.env.GITHUB_BOT_NAME) {
            githubEvent.emit(eventName, {
                repo: getRepo(payload.repository.full_name),
                payload
            });
        }

        ctx.body = 'Ok.';
    }
    else {
        ctx.body = 'Go away.';
    }
});

Object.keys(issueActions).forEach((key) => {
    issueActions[key](githubEvent.on.bind(githubEvent));
});

const port = 8000;
app.listen(port);
console.log(`Listening on http://0.0.0.0:${port}`);

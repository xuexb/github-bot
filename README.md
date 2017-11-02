# github-bot

github 机器人：在服务端上启动一个基于 [koajs](http://koajs.com/) 的 http server ，建立一些项目的规范（如 issue 格式、 pull request 格式、配置一些指定 label 根据的 owner 、统一 git commit log 格式等），基于 [github webhooks](https://developer.github.com/webhooks/) 和 [github api](https://developer.github.com/v3/) 让机器人（通常是一个单独的帐号，如 [@jiandansousuo-bot](https://github.com/jiandansousuo-bot) ）自动处理一些事情，从而达到快速响应、自动化、解放人力的效果。

[![Build Status](https://travis-ci.org/xuexb/github-bot.svg?branch=master)](https://travis-ci.org/xuexb/github-bot)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)
[![Test Coverage](https://img.shields.io/coveralls/xuexb/github-bot/master.svg)](https://coveralls.io/r/xuexb/github-bot?branch=master)

## 声明

该 [仓库@xuexb/github-bot](https://github.com/xuexb/github-bot/) 是用来演示 github-bot 的基本功能，因为具体需要实现的功能，可能因项目而不同，如果你需要她，你可以 fork 并相应的添加、删除功能。以下功能是一些常用的 show case 。

## 功能 - Feature

### Issue

- [x] 没有使用 [创建 issue](https://xuexb.github.io/github-bot/create-issue.html) 页面提交的 issue 将直接被关闭 - [示例](https://github.com/xuexb/github-bot/issues/38#issuecomment-341050970)
- [x] 根据 [创建 issue](https://xuexb.github.io/github-bot/create-issue.html) 页面提交的 issue 类型自动打上对应 label - [示例](https://github.com/xuexb/github-bot/issues/32#event-1317962655)
- [x] 当 issue 标记 label 为 `need demo` 时，自动回复，需要相关demo - [示例](https://github.com/xuexb/github-bot/issues/14#issuecomment-336701988)
- [x] issue 自动 assign 给指定人员，需要配置 `package.json` 中 `config.github-bot.labelToAuthor` 映射 - [示例](https://github.com/xuexb/github-bot/issues/32#event-1317962669)

### Pull Request

- [x] 发 PR 时根据打的 label 自动添加指定的 reviewer ，需要配置 `package.json` 中 `config.github-bot.labelToAuthor` 映射 - [示例](https://github.com/xuexb/github-bot/pull/33#event-1320253347)
- [x] 发 PR 时标题不规范时提醒修改，需要配置 `package.json` 中 `config.validate-commit-msg.type` 功能关键字，标题必须以 `功能关键字:` 开头 - [示例](https://github.com/xuexb/github-bot/pull/33#issuecomment-340650462)
- [x] 发 PR 时自动根据标题的 [PR 标题规则](https://github.com/xuexb/github-bot#commit-log-和-pr-标题规则) 前缀生成对应的 label ， `feat->enhancement, fix->bug` - [示例](https://github.com/xuexb/github-bot/pull/33#event-1320253315)

### Release

- [x] 当往远程第一次推送新版本号时，自动列出最新版本距离上一版本的 commit log 并发布 release notes ，由于需要使用两个 tag 去对比，所以项目的第一个 tag 就不处理 - [示例](https://github.com/xuexb/github-bot/releases)

## 规则 - Rules

### issue 规则

必须使用 [创建 issue](https://xuexb.github.io/github-bot/create-issue.html) 页面来提交 issue ，否则将直接被关闭

### labels 规则

- invalid - 未定义, 内容 不规范
- need demo - 需要提供预览链接
- need update - 需要更新修复问题
- bug - bug
- duplicate - 重复
- enhancement - 新功能
- question - 提问
- wontfix - 不修复的问题

### commit log 和 PR 标题规则

所有标题必须以 `功能关键字:` 开头

> 参考： <http://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html>

功能关键字介绍如下：

- feat - 新功能（feature）
- fix - 修补bug
- docs - 文档（documentation）
- style - 格式（不影响代码运行的变动）
- test - 增加测试
- chore - 构建过程或辅助工具的变动
- revert - 撤销
- close - 关闭 issue
- release - 发布版本

示例：

```
close: #1, #3
feat: 添加xx功能
docs: update install info
```

## 如何使用

### 1. 创建 access tokens

<https://github.com/settings/tokens> （_需要在 .env 里配置_）

### 2. 创建 webhook

https://github.com/用户名/项目名/settings/hooks/new

- Payload URL: www.example.com:8000
- Content type: application/json
- trigger: Send me everything.
- Secret: xxx （_需要在 .env 里配置_）

### 3. 开发运行

```bash
npm install
cp env .env
vim .env
npm start
```

### 4. 部署

本项目使用 [pm2](https://github.com/Unitech/pm2) 进行服务管理，发布前请先全局安装 [pm2](https://github.com/Unitech/pm2)

```bash
npm install pm2 -g
npm run deploy
```

后台启动该服务后，可以通过 `pm2 ls` 来查看服务名称为 `github-bot` 的运行状态。具体 [pm2](https://github.com/Unitech/pm2) 使用，请访问：https://github.com/Unitech/pm2

### 5. 日志系统说明

本系统 `logger` 服务基于 [log4js](https://github.com/log4js-node/log4js-node)。
在根目录的 `.env` 文件中有个参数 `LOG_TYPE` 默认为 `console`，参数值说明：

```
console - 通过 console 输出log。
file - 将所有相关log输出到更根目录的 `log` 文件夹中。
```

## contributors

> [用户贡献指南](.github/CONTRIBUTING.md)

- [@yugasun](https://github.com/yugasun/)
- [@ddhhz](https://github.com/ddhhz)
- [@xuexb](https://github.com/xuexb/)

## Liscense

MIT

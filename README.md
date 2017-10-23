# github-bot

Github robot

[![Build Status](https://travis-ci.org/xuexb/github-bot.svg?branch=master)](https://travis-ci.org/xuexb/github-bot)

## 功能 - Feature

### Issue

- [x] 没有使用 [创建 issue](https://xuexb.github.io/github-bot/create-issue.html) 页面提交的 issue 将直接被关闭
- [x] 根据 [创建 issue](https://xuexb.github.io/github-bot/create-issue.html) 页面提交的 issue 类型自动打上对应 label
- [x] 当 issue 标记 label 为 `need demo` 时，自动回复，需要相关demo
- [x] issue 自动 assign 给指定人员，需要配置 `package.json` 中 `config.github-bot.labelToAuthor` 映射

### Pull Request

- [x] 发 PR 时根据打的 label 自动添加指定的 reviewer ，需要配置 `package.json` 中 `config.github-bot.labelToAuthor` 映射
- [x] 发 PR 时标题不规范时提醒修改，需要配置 `package.json` 中 `config.validate-commit-msg.type` 功能关键字，标题必须以 `功能关键字:` 开头
- [x] 发 PR 时自动根据标题的 [PR 标题规则](https://github.com/xuexb/github-bot#commit-log-和-pr-标题规则) 前缀生成对应的 label ， `feat->enhancement, fix->bug`

### Release

- [x] 当往远程第一次推送新版本号时，自动列出最新版本距离上一版本的 commit log 并发布 release notes ，由于需要使用两个 tag 去对比，所以项目的第一个 tag 就不处理

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

### 3. run server

```
npm install
cp env .env
vim .env
npm start
```

###

## contributors

- [@yugasun](https://github.com/yugasun/)
- [@xuexb](https://github.com/xuexb/)

## Liscense

MIT

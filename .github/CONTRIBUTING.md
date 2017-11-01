# 用户贡献指南

非常感谢您关注 [@xuexb/github-bot](https://github.com/xuexb/github-bot) 项目，在提交您的贡献之前，请务必认真阅读以下准则。

1. [问题反馈](#issue)
1. [开发指南](#develop)
    1. [本地调试](#debug)
    1. [常用脚本命令（ npm scripts ）](#npm-scripts)
    1. [代码风格](#code-spec)
    1. [项目结构](#dir-spec)
    1. [提交请求（pull request）](#pull-request)
1. [提交信息规范](#commit-message-spec)
1. [后记](#open-source)

<a id="issue"></a>
## 问题反馈

1. 请避免提交重复的 issue，在提交之前搜索现有的 issue 。
1. 请使用 [创建 issue](https://xuexb.github.io/github-bot/create-issue.html) 页面反馈问题，否则将直接被关闭。

<a id="develop"></a>
## 开发设置

需要安装 [nodejs](https://nodejs.org) 版本7.8.0+ ，下载项目到本地后安装依赖 `npm install` ，安装完成后将自动添加 git commit 提交信息格式检查和提交前代码格式验证。

<a id="debug"></a>
### 本地调试

目前是基于 [github api](https://developer.github.com/v3/) + <https://github.com/octokit/node-github> 接口说明 + 在线 github webhook 实时触发调试，计划添加一个 mock 服务，支持在本地实时的调试代码功能。

<a id="npm-scripts"></a>
### 常用脚本命令（ npm scripts ）

``` bash
# 基于 koa 启动本地服务器接口
$ npm run start

# 使用 eslint 验证代码风格
$ npm run lint
```

<a id="code-spec"></a>
### 代码风格

使用 es6 开发，基于 <https://standardjs.com/> 编写代码，基于 [eslint](https://eslint.org/) 验证代码格式。

<a id="dir-spec"></a>
### 项目结构

```
.
├── create-issue.html                   - 创建 issue 页面，会往内容里注入一些特殊的标识用来让 bot 判断是否规范
├── env                                 - 环境配置模板
└── src
    ├── app.js                          - 服务启动入口
    ├── github.js                       - 基于 https://github.com/octokit/node-github + async 完成接口对外统一
    ├── modules                         - 以功能为目录区分形成模块
    │   ├── issues                      - issue
    │   │   ├── autoAssign.js           - 根据配置自动 assign 给指定的人
    │   │   ├── autoLabel.js            - 根据 create-issue.html 页面注入的标记自动给 issue 打对应的 label
    │   │   ├── replyInvalid.js         - 判断是否有 create-issue.html 页面注入的标记，不存在则自动关闭
    │   │   └── replyNeedDemo.js        - 回复需要相关 demo 链接
    │   ├── pull_request                - PR
    │   │   ├── autoReviewRequest.js    - 根据配置自动 reviewer 给指定的人
    │   │   ├── replyInvalidTitle.js    - 根据标题规范自动提醒需要修改
    │   │   └── titlePrefixToLabel.js   - 根据标题规范化前缀和配置，自动打上 label
    │   └── releases                    - releases
    │       └── autoReleaseNote.js      - 添加新 tag 时自动根据距离上一个 tag 的 commit log 自动归类，发布 releases notes
    └── utils.js                        - 常用工具方法
```

<a id="pull-request"></a>
### 提交请求（pull request）

1. fork [@xuexb/github-bot](https://github.com/xuexb/github-bot)
1. 把个人仓库（repository）克隆到电脑上，并安装所依赖的插件。
1. 开始编辑，并自测通过（后续Todo: 添加测试用例）后提前代码。
1. 推送（push）分支。
1. 建立一个新的合并申请（pull request）并描述变动。

<a id="commit-message-spec"></a>
## 提交信息规范

git commit 信息和 pull request 标题必须遵循 [commit-log-和-pr-标题规则](https://github.com/xuexb/github-bot#commit-log-和-pr-标题规则) ，否则不予合入。

<a id="open-source"></a>
## 后记

感谢您的贡献， github-bot 因您而更完善。

# github-bot

## list

- [x] 不规范 issue 自动关闭
- [x] 当 issue 标记 label 为 `need demo`时，自动回复，需要相关demo
- [x] issue 自动 `assign` 给指定人员，需要配置 `package.json` 中 `config.github-bot.lableToAuthor` 映射
- [x] 当往远程第一次推送新版本号时，自动列出最新版本距离上一版本的 commit log 并发布 release notes
- [ ] 发 PR 时标题不规范时提醒修改

## issue 规则

```
node version: 版本号
url: http://www.example.com
```

## labels 规则

- invalid - 未定义, issue 不规范
- need demo - 需要提供预览链接
- bug - bug
- duplicate - 重复
- enhancement - 新功能
- question - 提问
- wontfix - 不修复的问题

## commit log 和 PR 标题规则

> 参考： <http://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html>

- feat - 新功能（feature）
- fix - 修补bug
- docs - 文档（documentation）
- style - 格式（不影响代码运行的变动）
- test - 增加测试
- chore - 构建过程或辅助工具的变动
- revert - 撤销
- close - 关闭 issue

如：

```
close: #1, #3
feat: 添加xx功能
docs: update install info
```

## contributors

- [@yugasun](https://github.com/yugasun/)
- [@xuexb](https://github.com/xuexb/)

/**
 * @file 根据 tag 自动 release
 * @author xuexb <fe.xiaowu@gmail.com>
 */

const {
  getTags,
  compareCommits,
  getReleaseByTag,
  createRelease
} = require('../../github')

const RELEASE_CHANGE_MAP = {
  document: 'docs',
  feature: 'feat',
  bugfix: 'fix',
  close: 'close'
}

module.exports = {
  name: 'releases/autoReleaseNote',
  register (on) {
    on('create_tag', async ({ payload, repo }) => {
      const tag = await getReleaseByTag(payload, {
        tag_name: payload.ref
      })
      // 如果该 tag 存在则直接返回
      if (tag !== null) {
        return
      }

      const tags = await getTags(payload)

      // 如果只有一个 tag 则没法对比，忽略
      if (tags.length < 2) {
        return
      }

      const head = tags[0].name
      const base = tags[1].name

      const commitsLog = await compareCommits(payload, {
        base,
        head
      })

      const commits = commitsLog.commits
      const changes = Object.keys(RELEASE_CHANGE_MAP).map(title => {
        return {
          title,
          data: commits
            .filter((commit) => commit.commit.message.indexOf(`${RELEASE_CHANGE_MAP[title]}:`) === 0)
            .map((commit) => {
              let message = commit.commit.message
              // 处理 squash merge 的 commit message
              if (message.indexOf('\n') !== -1) {
                message = message.substr(0, message.indexOf('\n'))
              }
              return `- ${message}, by @${commit.author.login} <<${commit.commit.author.email}>>`
            })
        }
      }).filter(v => v.data.length)

      const hashChanges = commits.map((commit) => {
        let message = commit.commit.message
        // 处理 squash merge 的 commit message
        if (message.indexOf('\n') !== -1) {
          message = message.substr(0, message.indexOf('\n'))
        }
        return `- [${commit.sha.substr(0, 7)}](${commit.html_url}) - ${message}, by @${commit.author.login} <<${commit.commit.author.email}>>`
      })

      let body = []

      if (changes.length) {
        body.push('## Notable changes\n')
        changes.forEach(v => {
          body.push(`- ${v.title}`)

          v.data.forEach(line => body.push('     ' + line))
        })
      }

      if (hashChanges.length) {
        body.push('\n## Commits\n')
        body = body.concat(hashChanges)
      }

      if (body.length) {
        createRelease(payload, {
          tag_name: payload.ref,
          name: `${payload.ref} @${payload.repository.owner.login}`,
          body: body.join('\n')
        })
      }
    })
  }
}

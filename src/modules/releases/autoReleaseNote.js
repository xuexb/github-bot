/**
 * @file 根据 tag 自动 release
 * @author xuexb <fe.xiaowu@gmail.com>
 */

const { getTags, compareCommits, getReleaseByTag, createRelease } = require('../../github')

const RELEASE_CHANGE_MAP = {
  document: 'docs',
  feature: 'feat',
  bugfix: 'fix',
  close: 'close'
}

module.exports = on => {
  on('create_tag', async ({ payload, repo }) => {
    const tag = await getReleaseByTag(payload, {
      tag_name: payload.ref
    })
    // 如果该 tag 存在则直接返回
    if (tag !== false) {
      return
    }

    // 创建 release note
    try {
      const tags = await getTags(payload)
      const head = tags[0].name
      const base = tags.length > 1 ? tags[1].name : tags[0].name

      const commitsLog = await compareCommits(payload, {
        base,
        head
      })

      const commits = commitsLog.commits
      const changes = Object.keys(RELEASE_CHANGE_MAP).map(title => {
        let data = []
        commits.map((commit) => {
          if (commit.commit.message.indexOf(`${RELEASE_CHANGE_MAP[title]}:`) === 0) {
            let message = commit.commit.message
            // 处理 squash merge 的 commit message
            // 后期看看有没有更好的解决办法？
            if (message.indexOf('\n') !== -1) {
              message = message.substr(0, message.indexOf('\n'))
            }
            data.push(`- ${message}, by @${commit.commit.author.name} <<${commit.commit.author.email}>>`)
          }
        })
        return {
          title,
          data
        }
      }).filter(v => v.data.length)

      const hashChanges = commits.map((commit) => {
        let message = commit.commit.message
        // 处理 squash merge 的 commit message
        if (message.indexOf('\n') !== -1) {
          message = message.substr(0, message.indexOf('\n'))
        }
        return `- [${commit.sha.substr(0, 7)}](${commit.html_url}) - ${message}, by @${commit.commit.author.name} <<${commit.commit.author.email}>>`
      })

      let body = []

      if (changes.length) {
        body.push('## Notable changes\n')
        changes.forEach(v => {
          body.push([
            `- ${v.title}`
          ])

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
    } catch (err) {
      console.error(err)
    }
  })
}

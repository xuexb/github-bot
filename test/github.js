/**
 * @file github.js test case
 * @author xuexb <fe.xiaowu@gmail.com>
 */

/* eslint-disable camelcase */
const mock = require('mock-require')
mock.stopAll()
const chai = require('chai')
const expect = chai.expect
const chaiAsPromised = require('chai-as-promised')
const clean = require('./utils/clean')
chai.use(chaiAsPromised)

const payload = {
  repository: {
    owner: {
      login: 'xuexb'
    },
    name: 'github-bot'
  },
  pull_request: {
    number: 1
  },
  issue: {
    number: 1
  }
}

const createClass = (constructor, prototype) => {
  function Class (...args) {
    if ('function' === typeof constructor) {
      constructor.apply(this, args)
    }
  }
  Object.assign(Class.prototype, {
    authenticate() {}
  }, prototype)

  return Class
}

const mockGithub = (...args) => {
  return mock('github', createClass(...args))
}

describe('github.js', () => {
  beforeEach('clear node cache', () => {
    clean('src/github')
  })

  describe('.issueHasLabel', () => {
    it('should be a method', () => {
      mockGithub(null, {
        issues: {
          getIssueLabels() {
            return Promise.resolve({
              data: []
            })
          }
        }
      })
      const github = require('../src/github')
      expect(github.issueHasLabel).to.be.a('function')
    })

    describe('should return boolean', () => {
      it('true', () => {
        mockGithub(null, {
          issues: {
            getIssueLabels() {
              return Promise.resolve({
                data: [
                  {
                    name: 'nofond'
                  }
                ]
              })
            }
          }
        })
        const github = require('../src/github')
        expect(github.issueHasLabel(payload, 'nofond')).to.eventually.be.true
      })

      it('false', () => {
        mockGithub(null, {
          issues: {
            getIssueLabels() {
              return Promise.resolve({
                data: [
                  {
                    name: 'test'
                  }
                ]
              })
            }
          }
        })
        const github = require('../src/github')
        expect(github.issueHasLabel(payload, 'nofond')).to.eventually.be.false
      })

      it('error', () => {
        mock('../src/logger', {
          appLog: {
            error(err) {
              expect(err).to.not.be.undefined
            }
          }
        })
        mockGithub(null)
        const github = require('../src/github')
        expect(github.issueHasLabel(payload, 'nofond')).to.eventually.be.false
      })
    })

    it('check param', () => {
      mockGithub(null, {
        issues: {
          getIssueLabels({owner, repo, number}) {
            expect(owner).to.equal('xuexb')
            expect(repo).to.equal('github-bot')
            expect(number).to.equal(1)
            return Promise.resolve({
              data: []
            })
          }
        }
      })
      const github = require('../src/github')
      return github.issueHasLabel(payload)
    })

  })

  describe('.pullRequestHasLabel', () => {
    it('should be a method', () => {
      mockGithub(null, {
        issues: {
          getIssueLabels() {
            return Promise.resolve({
              data: []
            })
          }
        }
      })
      const github = require('../src/github')
      expect(github.pullRequestHasLabel).to.be.a('function')
    })

    describe('should return boolean', () => {
      it('true', () => {
        mockGithub(null, {
          issues: {
            getIssueLabels() {
              return Promise.resolve({
                data: [
                  {
                    name: 'nofond'
                  }
                ]
              })
            }
          }
        })
        const github = require('../src/github')
        expect(github.pullRequestHasLabel(payload, 'nofond')).to.eventually.be.true
      })

      it('false', () => {
        mockGithub(null, {
          issues: {
            getIssueLabels() {
              return Promise.resolve({
                data: [
                  {
                    name: 'test'
                  }
                ]
              })
            }
          }
        })
        const github = require('../src/github')
        expect(github.pullRequestHasLabel(payload, 'nofond')).to.eventually.be.false
      })

      it('error', () => {
        mock('../src/logger', {
          appLog: {
            error(err) {
              expect(err).to.not.be.undefined
            }
          }
        })
        mockGithub(null)
        const github = require('../src/github')
        expect(github.pullRequestHasLabel(payload)).to.eventually.be.false
      })
    })

    it('check param', () => {
      mockGithub(null, {
        issues: {
          getIssueLabels({owner, repo, number}) {
            expect(owner).to.equal('xuexb')
            expect(repo).to.equal('github-bot')
            expect(number).to.equal(1)
            return Promise.resolve({
              data: []
            })
          }
        }
      })
      const github = require('../src/github')
      return github.pullRequestHasLabel(payload)
    })
  })

  describe('.commentIssue', () => {
    it('should be a method', () => {
      mockGithub(null, {
        issues: {
          createComment() {
            return Promise.resolve()
          }
        }
      })
      const github = require('../src/github')
      expect(github.commentIssue).to.be.a('function')
    })

    describe('should return boolean', () => {
      it('true', () => {
        mockGithub(null, {
          issues: {
            createComment() {
              return Promise.resolve()
            }
          }
        })
        const github = require('../src/github')
        expect(github.commentIssue(payload, 'message')).to.eventually.be.true
      })

      it('false', () => {
        mockGithub(null, {
          issues: {
            createComment() {
              throw new TypeError('error')
            }
          }
        })
        const github = require('../src/github')
        expect(github.commentIssue(payload)).to.eventually.be.false
      })

      it('error', () => {
        mock('../src/logger', {
          appLog: {
            error(err) {
              expect(err).to.not.be.undefined
            }
          }
        })
        mockGithub(null)
        const github = require('../src/github')
        expect(github.commentIssue(payload)).to.eventually.be.false
      })
    })

    it('check param', () => {
      mockGithub(null, {
        issues: {
          createComment({owner, repo, number}) {
            expect(owner).to.equal('xuexb')
            expect(repo).to.equal('github-bot')
            expect(number).to.equal(1)
            expect(body).to.equal('message')
            return Promise.resolve()
          }
        }
      })
      const github = require('../src/github')
      return github.commentIssue(payload, 'message')
    })
  })

  describe('.commentPullRequest', () => {
    it('should be a method', () => {
      mockGithub(null, {
        issues: {
          createComment() {
            return Promise.resolve()
          }
        }
      })
      const github = require('../src/github')
      expect(github.commentPullRequest).to.be.a('function')
    })

    describe('should return boolean', () => {
      it('true', () => {
        mockGithub(null, {
          issues: {
            createComment() {
              return Promise.resolve()
            }
          }
        })
        const github = require('../src/github')
        expect(github.commentPullRequest(payload, 'message')).to.eventually.be.true
      })

      it('false', () => {
        mockGithub(null, {
          issues: {
            createComment() {
              throw new TypeError('error')
            }
          }
        })
        const github = require('../src/github')
        expect(github.commentPullRequest(payload)).to.eventually.be.false
      })

      it('error', () => {
        mock('../src/logger', {
          appLog: {
            error(err) {
              expect(err).to.not.be.undefined
            }
          }
        })
        mockGithub(null)
        const github = require('../src/github')
        expect(github.commentPullRequest(payload)).to.eventually.be.false
      })
    })

    it('check param', () => {
      mockGithub(null, {
        issues: {
          createComment({owner, repo, number}) {
            expect(owner).to.equal('xuexb')
            expect(repo).to.equal('github-bot')
            expect(number).to.equal(1)
            expect(body).to.equal('message')
            return Promise.resolve()
          }
        }
      })
      const github = require('../src/github')
      return github.commentPullRequest(payload, 'message')
    })
  })

  describe('.closeIssue', () => {
    it('should be a method', () => {
      mockGithub(null, {
        issues: {
          edit() {
            return Promise.resolve()
          }
        }
      })
      const github = require('../src/github')
      expect(github.closeIssue).to.be.a('function')
    })

    describe('should return boolean', () => {
      it('true', () => {
        mockGithub(null, {
          issues: {
            edit() {
              return Promise.resolve()
            }
          }
        })
        const github = require('../src/github')
        expect(github.closeIssue(payload)).to.eventually.be.true
      })

      it('false', () => {
        mockGithub(null, {
          issues: {
            edit() {
              throw new TypeError('error')
            }
          }
        })
        const github = require('../src/github')
        expect(github.closeIssue(payload)).to.eventually.be.false
      })

      it('error', () => {
        mock('../src/logger', {
          appLog: {
            error(err) {
              expect(err).to.not.be.undefined
            }
          }
        })
        mockGithub(null)
        const github = require('../src/github')
        expect(github.closeIssue(payload)).to.eventually.be.false
      })
    })

    it('check param', () => {
      mockGithub(null, {
        issues: {
          edit({owner, repo, number, state}) {
            expect(owner).to.equal('xuexb')
            expect(repo).to.equal('github-bot')
            expect(number).to.equal(1)
            expect(state).to.equal('closed')
            return Promise.resolve()
          }
        }
      })
      const github = require('../src/github')
      return github.closeIssue(payload)
    })
  })

  describe('.addAssigneesToIssue', () => {
    it('should be a method', () => {
      mockGithub(null, {
        issues: {
          edit() {
            return Promise.resolve()
          }
        }
      })
      const github = require('../src/github')
      expect(github.addAssigneesToIssue).to.be.a('function')
    })

    describe('should return boolean', () => {
      it('true', () => {
        mockGithub(null, {
          issues: {
            edit() {
              return Promise.resolve()
            }
          }
        })
        const github = require('../src/github')
        expect(github.addAssigneesToIssue(payload)).to.eventually.be.true
      })

      it('false', () => {
        mockGithub(null, {
          issues: {
            edit() {
              throw new TypeError('error')
            }
          }
        })
        const github = require('../src/github')
        expect(github.addAssigneesToIssue(payload)).to.eventually.be.false
      })

      it('error', () => {
        mock('../src/logger', {
          appLog: {
            error(err) {
              expect(err).to.not.be.undefined
            }
          }
        })
        mockGithub(null, null)
        const github = require('../src/github')
        expect(github.addAssigneesToIssue(payload)).to.eventually.be.false
      })
    })

    it('check param', () => {
      mockGithub(null, {
        issues: {
          edit({owner, repo, number, state}) {
            expect(owner).to.equal('xuexb')
            expect(repo).to.equal('github-bot')
            expect(number).to.equal(1)
            expect(assignees).to.deep.equal(['ok'])
            return Promise.resolve()
          }
        }
      })
      const github = require('../src/github')
      return github.addAssigneesToIssue(payload, 'ok')
    })
  })

  describe('.addLabelsToIssue', () => {
    it('should be a method', () => {
      mockGithub(null, {
        issues: {
          addLabels() {
            return Promise.resolve()
          }
        }
      })
      const github = require('../src/github')
      expect(github.addLabelsToIssue).to.be.a('function')
    })

    describe('should return boolean', () => {
      it('true', () => {
        mockGithub(null, {
          issues: {
            addLabels() {
              return Promise.resolve()
            }
          }
        })
        const github = require('../src/github')
        expect(github.addLabelsToIssue(payload, 'label')).to.eventually.be.true
      })

      it('false', () => {
        mockGithub(null, {
          issues: {
            addLabels() {
              throw new TypeError('error')
            }
          }
        })
        const github = require('../src/github')
        expect(github.addLabelsToIssue(payload)).to.eventually.be.false
      })

      it('error', () => {
        mock('../src/logger', {
          appLog: {
            error(err) {
              expect(err).to.not.be.undefined
            }
          }
        })
        mockGithub(null)
        const github = require('../src/github')
        expect(github.addLabelsToIssue(payload)).to.eventually.be.false
      })
    })

    it('check param', () => {
      mockGithub(null, {
        issues: {
          addLabels({owner, repo, number, state}) {
            expect(owner).to.equal('xuexb')
            expect(repo).to.equal('github-bot')
            expect(number).to.equal(1)
            expect(assignees).to.deep.equal(['ok'])
            return Promise.resolve()
          }
        }
      })
      const github = require('../src/github')
      return github.addLabelsToIssue(payload, 'ok')
    })
  })

  describe('.addLabelsToPullRequest', () => {
    it('should be a method', () => {
      mockGithub(null, {
        issues: {
          addLabels() {
            return Promise.resolve()
          }
        }
      })
      const github = require('../src/github')
      expect(github.addLabelsToPullRequest).to.be.a('function')
    })

    describe('should return boolean', () => {
      it('true', () => {
        mockGithub(null, {
          issues: {
            addLabels() {
              return Promise.resolve()
            }
          }
        })
        const github = require('../src/github')
        expect(github.addLabelsToPullRequest(payload, 'label')).to.eventually.be.true
      })

      it('false', () => {
        mockGithub(null, {
          issues: {
            addLabels() {
              throw new TypeError('error')
            }
          }
        })
        const github = require('../src/github')
        expect(github.addLabelsToPullRequest(payload)).to.eventually.be.false
      })

      it('error', () => {
        mock('../src/logger', {
          appLog: {
            error(err) {
              expect(err).to.not.be.undefined
            }
          }
        })
        mockGithub(null)
        const github = require('../src/github')
        expect(github.addLabelsToPullRequest(payload)).to.eventually.be.false
      })
    })

    it('check param', () => {
      mockGithub(null, {
        issues: {
          addLabels({owner, repo, number, state}) {
            expect(owner).to.equal('xuexb')
            expect(repo).to.equal('github-bot')
            expect(number).to.equal(1)
            expect(assignees).to.deep.equal(['ok'])
            return Promise.resolve()
          }
        }
      })
      const github = require('../src/github')
      return github.addLabelsToPullRequest(payload, 'ok')
    })
  })

  describe('.removeLabelsToPullRequest', () => {
    it('should be a method', () => {
      mockGithub(null, {
        issues: {
          removeLabel() {
            return Promise.resolve()
          }
        }
      })
      const github = require('../src/github')
      expect(github.removeLabelsToPullRequest).to.be.a('function')
    })

    describe('should return boolean', () => {
      it('true', () => {
        mockGithub(null, {
          issues: {
            removeLabel() {
              return Promise.resolve()
            }
          }
        })
        const github = require('../src/github')
        expect(github.removeLabelsToPullRequest(payload, 'label')).to.eventually.be.true
      })

      it('false', () => {
        mockGithub(null, {
          issues: {
            removeLabel() {
              throw new TypeError('error')
            }
          }
        })
        const github = require('../src/github')
        expect(github.removeLabelsToPullRequest(payload)).to.eventually.be.false
      })

      it('error', () => {
        mock('../src/logger', {
          appLog: {
            error(err) {
              expect(err).to.not.be.undefined
            }
          }
        })
        mockGithub(null)
        const github = require('../src/github')
        expect(github.removeLabelsToPullRequest(payload)).to.eventually.be.false
      })
    })

    it('check param', () => {
      mockGithub(null, {
        issues: {
          removeLabel({owner, repo, number, state}) {
            expect(owner).to.equal('xuexb')
            expect(repo).to.equal('github-bot')
            expect(number).to.equal(1)
            expect(assignees).to.equal('ok')
            return Promise.resolve()
          }
        }
      })
      const github = require('../src/github')
      return github.removeLabelsToPullRequest(payload, 'ok')
    })
  })

  describe('.removeLabelsToIssue', () => {
    it('should be a method', () => {
      mockGithub(null, {
        issues: {
          removeLabel() {
            return Promise.resolve()
          }
        }
      })
      const github = require('../src/github')
      expect(github.removeLabelsToIssue).to.be.a('function')
    })

    describe('should return boolean', () => {
      it('true', () => {
        mockGithub(null, {
          issues: {
            removeLabel() {
              return Promise.resolve()
            }
          }
        })
        const github = require('../src/github')
        expect(github.removeLabelsToIssue(payload, 'label')).to.eventually.be.true
      })

      it('false', () => {
        mockGithub(null, {
          issues: {
            removeLabel() {
              throw new TypeError('error')
            }
          }
        })
        const github = require('../src/github')
        expect(github.removeLabelsToIssue(payload)).to.eventually.be.false
      })

      it('error', () => {
        mock('../src/logger', {
          appLog: {
            error(err) {
              expect(err).to.not.be.undefined
            }
          }
        })
        mockGithub(null)
        const github = require('../src/github')
        expect(github.removeLabelsToIssue(payload)).to.eventually.be.false
      })
    })

    it('check param', () => {
      mockGithub(null, {
        issues: {
          removeLabel({owner, repo, number, state}) {
            expect(owner).to.equal('xuexb')
            expect(repo).to.equal('github-bot')
            expect(number).to.equal(1)
            expect(assignees).to.equal('ok')
            return Promise.resolve()
          }
        }
      })
      const github = require('../src/github')
      return github.removeLabelsToIssue(payload, 'ok')
    })
  })

  describe('.createRelease', () => {
    it('should be a method', () => {
      mockGithub(null, {
        repos: {
          createRelease() {
            return Promise.resolve()
          }
        }
      })
      const github = require('../src/github')
      expect(github.createRelease).to.be.a('function')
    })

    describe('should return boolean', () => {
      it('true', () => {
        mockGithub(null, {
          repos: {
            createRelease() {
              return Promise.resolve()
            }
          }
        })
        const github = require('../src/github')
        expect(github.createRelease(payload, {})).to.eventually.be.true
      })

      it('false', () => {
        mockGithub(null, {
          repos: {
            createRelease() {
              throw new TypeError('error')
            }
          }
        })
        const github = require('../src/github')
        expect(github.createRelease(payload)).to.eventually.be.false
      })

      it('error', () => {
        mock('../src/logger', {
          appLog: {
            error(err) {
              expect(err).to.not.be.undefined
            }
          }
        })
        mockGithub(null)
        const github = require('../src/github')
        expect(github.createRelease(payload)).to.eventually.be.false
      })
    })

    it('check param', () => {
      mockGithub(null, {
        repos: {
          createRelease({owner, repo, number, tag_name, target_commitish, name, body, draft, prerelease}) {
            expect(owner).to.equal('xuexb')
            expect(repo).to.equal('github-bot')
            expect(number).to.equal(1)
            expect(tag_name).to.equal('tag_name')
            expect(target_commitish).to.equal('target_commitish')
            expect(name).to.equal('name')
            expect(body).to.equal('body')
            expect(draft).to.equal('draft')
            expect(prerelease).to.equal('prerelease')
            return Promise.resolve()
          }
        }
      })
      const github = require('../src/github')
      return github.createRelease(payload, {
        tag_name: 'tag_name',
        target_commitish: 'target_commitish',
        name: 'name',
        body: 'body',
        draft: 'draft',
        prerelease: 'prerelease'
      })
    })
  })

  describe('.getReleaseByTag', () => {
    it('should be a method', () => {
      mockGithub(null, {
        repos: {
          getReleaseByTag() {
            return Promise.resolve()
          }
        }
      })
      const github = require('../src/github')
      expect(github.getReleaseByTag).to.be.a('function')
    })

    describe('should return boolean', () => {
      it('true', () => {
        mockGithub(null, {
          repos: {
            getReleaseByTag() {
              return Promise.resolve({
                data: true
              })
            }
          }
        })
        const github = require('../src/github')
        expect(github.getReleaseByTag(payload, {
          tag_name: 'ok'
        })).to.eventually.be.true
      })

      it('false', () => {
        mockGithub(null, {
          repos: {
            getReleaseByTag() {
              return Promise.resolve({
                data: false
              })
            }
          }
        })
        const github = require('../src/github')
        expect(github.getReleaseByTag(payload)).to.eventually.be.false
      })

      it('error', () => {
        mock('../src/logger', {
          appLog: {
            error(err) {
              expect(err).to.not.be.undefined
            }
          }
        })
        mockGithub(null)
        const github = require('../src/github')
        expect(github.getReleaseByTag(payload)).to.eventually.be.null
      })
    })

    it('check param', () => {
      mockGithub(null, {
        repos: {
          getReleaseByTag({owner, repo, number, name}) {
            expect(owner).to.equal('xuexb')
            expect(repo).to.equal('github-bot')
            expect(number).to.equal(1)
            expect(name).to.equal('tag_name')
            return Promise.resolve()
          }
        }
      })
      const github = require('../src/github')
      return github.getReleaseByTag(payload, {
        tag_name: 'tag_name'
      })
    })
  })

  describe('.createReviewRequest', () => {
    it('should be a method', () => {
      mockGithub(null, {
        pullRequests: {
          createReviewRequest() {
            return Promise.resolve()
          }
        }
      })
      const github = require('../src/github')
      expect(github.createReviewRequest).to.be.a('function')
    })

    describe('should return boolean', () => {
      it('true', () => {
        mockGithub(null, {
          pullRequests: {
            createReviewRequest() {
              return Promise.resolve()
            }
          }
        })
        const github = require('../src/github')
        expect(github.createReviewRequest(payload, {
          reviewers: 'reviewers',
          team_reviewers: 'team_reviewers'
        })).to.eventually.be.true
      })

      it('false', () => {
        mockGithub(null, {
          pullRequests: {
            createReviewRequest() {
              throw new TypeError('error')
            }
          }
        })
        const github = require('../src/github')
        expect(github.createReviewRequest(payload)).to.eventually.be.false
      })

      it('error', () => {
        mock('../src/logger', {
          appLog: {
            error(err) {
              expect(err).to.not.be.undefined
            }
          }
        })
        mockGithub(null)
        const github = require('../src/github')
        expect(github.createReviewRequest(payload)).to.eventually.be.false
      })
    })

    it('check param', () => {
      mockGithub(null, {
        pullRequests: {
          createReviewRequest({owner, repo, number, team_reviewers, reviewers}) {
            expect(owner).to.equal('xuexb')
            expect(repo).to.equal('github-bot')
            expect(number).to.equal(1)
            expect(reviewers).to.equal('reviewers')
            expect(team_reviewers).to.equal('team_reviewers')
            return Promise.resolve()
          }
        }
      })
      const github = require('../src/github')
      return github.createReviewRequest(payload, {
        reviewers: 'reviewers',
        team_reviewers: 'team_reviewers'
      })
    })
  })

  describe('.getTags', () => {
    it('should be a method', () => {
      mockGithub(null, {
        repos: {
          getTags() {
            return Promise.resolve()
          }
        }
      })
      const github = require('../src/github')
      expect(github.getTags).to.be.a('function')
    })

    describe('should return boolean', () => {
      it('true', () => {
        mockGithub(null, {
          repos: {
            getTags() {
              return Promise.resolve({
                data: true
              })
            }
          }
        })
        const github = require('../src/github')
        expect(github.getTags(payload)).to.eventually.be.true
      })

      it('false', () => {
        mockGithub(null, {
          repos: {
            getTags() {
              return Promise.resolve({
                data: false
              })
            }
          }
        })
        const github = require('../src/github')
        expect(github.getTags(payload)).to.eventually.be.false
      })

      it('error', () => {
        mock('../src/logger', {
          appLog: {
            error(err) {
              expect(err).to.not.be.undefined
            }
          }
        })
        mockGithub(null)
        const github = require('../src/github')
        expect(github.getTags(payload)).to.eventually.be.deep.equal([])
      })
    })

    it('check param', () => {
      mockGithub(null, {
        repos: {
          getTags({owner, repo}) {
            expect(owner).to.equal('xuexb')
            expect(repo).to.equal('github-bot')
            return Promise.resolve()
          }
        }
      })
      const github = require('../src/github')
      return github.getTags(payload)
    })
  })

  describe('.compareCommits', () => {
    it('should be a method', () => {
      mockGithub(null, {
        repos: {
          compareCommits() {
            return Promise.resolve()
          }
        }
      })
      const github = require('../src/github')
      expect(github.compareCommits).to.be.a('function')
    })

    describe('should return boolean', () => {
      it('true', () => {
        mockGithub(null, {
          repos: {
            compareCommits() {
              return Promise.resolve({
                data: true
              })
            }
          }
        })
        const github = require('../src/github')
        expect(github.compareCommits(payload, {
          base: 'base',
          head: 'head'
        })).to.eventually.be.true
      })

      it('false', () => {
        mockGithub(null, {
          repos: {
            compareCommits() {
              return Promise.resolve({
                data: false
              })
            }
          }
        })
        const github = require('../src/github')
        expect(github.compareCommits(payload)).to.eventually.be.false
      })

      it('error', () => {
        mock('../src/logger', {
          appLog: {
            error(err) {
              expect(err).to.not.be.undefined
            }
          }
        })
        mockGithub(null)
        const github = require('../src/github')
        expect(github.compareCommits(payload)).to.eventually.be.null
      })
    })

    it('check param', () => {
      mockGithub(null, {
        repos: {
          compareCommits({owner, repo, base, head}) {
            expect(owner).to.equal('xuexb')
            expect(repo).to.equal('github-bot')
            expect(base).to.equal('base')
            expect(head).to.equal('head')
            return Promise.resolve()
          }
        }
      })
      const github = require('../src/github')
      return github.compareCommits(payload, {
        base: 'base',
        head: 'head'
      })
    })
  })
})

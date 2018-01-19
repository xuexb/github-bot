/**
 * @file utils.js test case
 * @author xuexb <fe.xiaowu@gmail.com>
 */
require('mock-require').stopAll()
const utils = require('../src/utils')
const expect = require('chai').expect

describe('utils.js', () => {
  describe('.toArray', () => {
    it('should return self if empty', () => {
      expect(utils.toArray()).to.be.undefined
      expect(utils.toArray('')).to.equal('')
      expect(utils.toArray(null)).to.be.null
    })
    it('should return array if not the empty string', () => {
      expect(utils.toArray(['string'])).to.be.a('array').and.to.deep.equal(['string'])
      expect(utils.toArray('string')).to.be.a('array').and.to.deep.equal(['string'])
    })
  })

  describe('.getPkgConfig', () => {
    it('should return object', () => {
      expect(utils.getPkgConfig()).to.be.a('object').and.to.not.empty
    })
  })

  describe('.getPkgCommitPrefix', () => {
    it('should return array', () => {
      expect(utils.getPkgCommitPrefix()).to.be.a('array').and.to.not.empty
    })
  })

  it('.verifySignature', () => {
    const GITHUB_SECRET_TOKEN = process.env['GITHUB_SECRET_TOKEN']

    process.env['GITHUB_SECRET_TOKEN'] = 'test'
    const flag = utils.verifySignature({
      rawBody: 'test',
      headers: {
        'x-hub-signature': 'test'
      }
    })
    process.env['GITHUB_SECRET_TOKEN'] = GITHUB_SECRET_TOKEN

    expect(flag).to.be.false
  })
})

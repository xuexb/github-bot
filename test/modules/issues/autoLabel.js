// /**
//  * @file modules/issues/autoLabel.js test case
//  * @author xuexb <fe.xiaowu@gmail.com>
//  */

// const expect = require('chai').expect
// const mock = require('mock-require')
// mock.stopAll()
// const clean = require('../../utils/clean')

// describe('modules/issues/autoLabel.js', () => {
//   beforeEach('clear node cache', () => {
//     clean('src/github')
//     clean('src/modules/issues/autoLabel')

//     mock('../../../src/github', {
//       addLabelsToIssue() {
//       }
//     })
//   })

//   it('event name', () => {
//     const autoLabel = require('../../../src/modules/issues/autoLabel')
//     autoLabel(name => {
//       expect(name).to.equal('issues_opened')
//     })
//   })

//   it('get label success', (done) => {
//     mock('../../../src/github', {
//       addLabelsToIssue(payload, label) {
//         expect(payload).to.be.a('object').and.not.empty
//         expect(label).to.equal('github-bot')
//         done()
//       }
//     })

//     const autoLabel = require('../../../src/modules/issues/autoLabel')
//     autoLabel((name, callback) => {
//       callback({
//         payload: {
//           issue: {
//             body: '我是测试内容\n<!--label:github-bot--><!--label:bot-->测试'
//           }
//         }
//       })
//     })
//   })

//   it('get label error', (done) => {
//     mock('../../../src/github', {
//       addLabelsToIssue() {
//         done('error')
//       }
//     })

//     const autoLabel = require('../../../src/modules/issues/autoLabel')
//     autoLabel((name, callback) => {
//       callback({
//         payload: {
//           issue: {
//             body: '我是测试内容'
//           }
//         }
//       })
//     })
//     setTimeout(done)
//   })
// })

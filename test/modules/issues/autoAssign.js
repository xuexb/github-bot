// /**
//  * @file modules/issues/autoAssign.js test case
//  * @author xuexb <fe.xiaowu@gmail.com>
//  */

// const expect = require('chai').expect
// const mock = require('mock-require')
// mock.stopAll()
// const clean = require('../../utils/clean')

// describe('modules/issues/autoAssign.js', () => {
//   beforeEach('clear node cache', () => {
//     clean('src/github')
//     clean('src/utils')
//     clean('src/modules/issues/autoAssign')

//     mock('../../../src/utils', {
//       getPkgConfig() {
//         return {}
//       }
//     })
//     mock('../../../src/github', {
//       addAssigneesToIssue() {
//       }
//     })
//   })

//   it('event name', () => {
//     const autoAssign = require('../../../src/modules/issues/autoAssign')
//     autoAssign(name => {
//       expect(name).to.equal('issues_labeled')
//     })
//   })

//   describe('set label', () => {
//     it('is ok', (done) => {
//       mock('../../../src/utils', {
//         getPkgConfig() {
//           return {
//             labelToAuthor: {
//               autoAssign: 'github-bot'
//             }
//           }
//         }
//       })
//       mock('../../../src/github', {
//         addAssigneesToIssue(payload, label) {
//           expect(payload).to.be.a('object').and.not.empty
//           expect(label).to.equal('github-bot')
//           done()
//         }
//       })

//       const autoAssign = require('../../../src/modules/issues/autoAssign')
//       autoAssign(function (name, callback) {
//         callback({
//           payload: {
//             label: {
//               name: 'autoAssign'
//             }
//           }
//         })
//       })
//     })

//     it('is false', (done) => {
//       mock('../../../src/github', {
//         addAssigneesToIssue() {
//           done('error')
//         }
//       })

//       const autoAssign = require('../../../src/modules/issues/autoAssign')
//       autoAssign(function (name, callback) {
//         callback({
//           payload: {
//             label: {
//               name: 'error'
//             }
//           }
//         })
//       })
//       setTimeout(done)
//     })
//   })
// })

/**
 * @file github.js test case
 * @author xuexb <fe.xiaowu@gmail.com>
 */

process.env['NODE_ENV'] = 'test'
process.env['GITHUB_TOKEN'] = 'test'

const github = require('../src/github');
const expect = require('chai').expect;

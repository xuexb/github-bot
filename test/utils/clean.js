/**
 * @file 清除 node 缓存，以根目录为基础路径
 * @author xuexb <fe.xiaowu@gmail.com>
 */

const resolve = require('path').resolve
const extname = require('path').extname

module.exports = path => {
  delete require.cache[resolve(__dirname, '../../', path) + (extname(path) === '' ? '.js' : '')]
}

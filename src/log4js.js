/**
 * Created Date: Wednesday, November 1st 2017, 4:03:55 pm
 * Author: yugasun
 * Email: yuga.sun.bj@gmail.com
 * -----
 * Last Modified:
 * Modified By:
 * -----
 * Copyright (c) 2017 yugasun
 */

const log4js = require('log4js')

log4js.configure(
  {
    'appenders': {
      file: {
        'type': 'file',
        'filename': 'log/app.log',
        'maxLogSize': 10485760,
        'numBackups': 3
      },
      dateFile: {
        'type': 'dateFile',
        'filename': 'log/access.log',
        'pattern': '-yyyy-MM-dd',
        'category': 'http'
      },
      logLevelFilter: {
        'type': 'logLevelFilter',
        'level': 'ERROR',
        'appender': {
          'type': 'file',
          'filename': 'log/errors.log'
        }
      }
    },
    categories: {
      default: { appenders: ['file', 'dateFile', 'logLevelFilter'], level: 'trace' }
    }
  }
)

module.exports = log4js

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
      app: {
        'type': 'file',
        'filename': 'log/app.log',
        'maxLogSize': 10485760,
        'numBackups': 3
      },
      access: {
        'type': 'dateFile',
        'filename': 'log/access.log',
        'pattern': '-yyyy-MM-dd',
        'category': 'http'
      },
      errorFile: { type: 'file', filename: 'log/errors.log' },
      errors: {
        'type': 'logLevelFilter',
        'level': 'error',
        'appender': 'errorFile'
      }
    },
    categories: {
      default: { appenders: ['app', 'errors'], level: 'trace' },
      http: { appenders: ['access'], level: 'info' }
    }
  }
)

module.exports = log4js

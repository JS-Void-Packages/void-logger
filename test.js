const VoidLogger = require('.')

let logger = new VoidLogger('latest').setLogLocation('.').shouldCheckForNull()

let d = new Date()

logger.clear()
logger.info(['test', 'test1'])
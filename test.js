const LogManager = require('./logger')

let logger = LogManager.getOrCreateLogger('./app.log')

// clear the log
logger.clear()
logger.log("text")
// log an object
logger.log({ 'app':true })
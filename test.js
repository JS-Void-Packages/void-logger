const LogManager = require('./logger')

let logger = LogManager.getOrCreateLogger('./app.log')

// clear the log
logger.clear()
logger.log("text")
// log an object
logger.log({ 'app':true })
// log a Class
logger.log(new Date())
// Logging null, empty string, empty obj and more will print a NULLPointerException.
logger.log(null)

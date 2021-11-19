# void-logger
void-logger is a Simple Logger written in javascript(NodeJS).
## installation
use `npm install void-logger` to install it
## How to use
Anything can be printed. Objects will be printed normally(you won't see [object object] for ex) and Errors will print the stacktrace.
```js
const LogManager = require('void-logger')

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


```

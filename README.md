# void-logger
void-logger is a Simple Logger written in javascript(NodeJS).
## installation
use `npm install void-logger` to install it
## How to use
```js
const Logger = require('void-logger')

// create a logger with name 'test' in this folder as path for the log file
let logger = new Logger('test').setLogLocation('.')

// print an info message
logger.info('message')

// print an error message
logger.error('message')

// print a warning message
logger.warning('message')

// clear the log
logger.clear()

```

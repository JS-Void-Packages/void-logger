# void-logger
void-logger is a Simple Logger written in javascript(NodeJS) with little to no dependencies.
## installation
`npm install void-logger`
## How to use it
you create a logger with `LogManager.getOrCreateLogger(logPath)` where logPath is the path to the log file.
```js
const LogManager = require('void-logger')

let logger = LogManager.getOrCreateLogger('./app.log')

// clear the log
logger.clear()
logger.log("text")
// log an object
logger.log({ 'app':true })
```
## 1.0.3 version
in 1.0.3 you can create a file titled `void_logger.json` in your project folder(basically where you're executing the js files in).
This will let you customize the printing format.
If the file does not exists, it will uses the default format.
Anything inside `{}` is a variable.
The following variables are available : 
- `{date}` is the date when the script is ran.
- `{body}` is what is getting printed.
- `DEFAULT` mean it will use the default format.
Error format variables : 
- `{stack}` give you the error stack
- `{name}` give you the error name
- `{message}`
Date format variables :
- `{time}` give the time of the day in the Locale Time format `hh:mm:ss`(h = hour, m = minute, s = second) with AM/PM in english
- `{hours}` give the hours.
- `{minutes}` give the minutes.
- `{seconds}` give the seconds.
- `{day}` give the day.
- `{month}` give the month.
- `{year}` give the year.
```json
{
    "format": {
        "log": "[{date}] {body}",
        "date": "{time}",
        "errror": "DEFAULT",
        "object": {
            "space": 0
        }
    }
}
```

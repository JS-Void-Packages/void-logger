# void-logger 2.0.0
void-logger is a Simple Logger written in javascript(NodeJS) with no dependencies.
## installation
`npm install void-logger@latest`
## How to use it
```js
const { Logger } = require('void-logger');

// create a logger with these properties
let logger = Logger.create('.', {
    logName: 'logger',
    logFormat: '[type] [date] [time] [text]',
    dateFormat: '[year]/[day]/[month]',
    timeFormat:'[hours]:[minutes]:[seconds]',
    logToConsole:false
});

// clear the log
logger.clearLog();

// info message
logger.info('App has been updated!');

// error message
logger.error('Config not found!');

// warning message
logger.warning('You are using a deprecated method!');
```
## Example config
```js
let exampleConfig = {
    // name of the logger
    "logName": "logger",
    // [date] is the date formated
    // [text] is the text printed by the logger
    // [type] is the type of logging(info, error, warning)
    // [time] is the time formated
    "logFormat": "[type] [date] [time] [text]",

    // format for the date
    // [local_date] = Local Date.
    // [local] = Local date and time.
    // [year] = Year
    // [month] = Month
    // [day] = day
    // [time] = time
    "dateFormat": "[local]",

    // format for the time
    // [hours] is current hour
    // [minutes] is current minutes
    // [seconds] is current second
    // [milliseconds] is current milliseconds
    // [local_time] give the local time string
    "timeFormat": "[time]",

    // choose to log the message in the console or not
    logToConsole:false
};
```
const { Logger } = require('./logger.js');

// no config specified
let logger = Logger.create('.', {
    logName: 'logger',
    logFormat: '[type] [date] [time] [text]',
    dateFormat: '[local_date]',
    timeFormat:'[hours]:[minutes]:[seconds]'
});

// clear the log
logger.clearLog();

// info message
logger.info('App has been updated!');

// error message
logger.error('Config not found!');

// warning message
logger.warning('You are using a deprecated method!');
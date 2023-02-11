const fs = require('fs');
const path = require('path');

class Logger {

    #logData = '';
    #logFile = '';
    #config = {};

    // return a log instance
    /**
     * Use
     * @param {string} logPath 
     * @param {{ void_logger:{ logName: string, logFormat: string, dateFormat: string, timeFormat: string} } | { logName: string, logFormat: string, dateFormat: string, timeFormat: string} | string } config 
     * @returns 
     */
    static create(logPath, config=null) {
        if(config != null && config != undefined) {
            if(typeof config == 'object') {
                let json = config;
                if(config.hasOwnProperty('void_logger')) {
                    json = config.void_logger;
                }
                if(!json.hasOwnProperty('logToConsole')) {
                    json.logToConsole = false;
                }
                return new Logger().#hiddenConstructor(logPath, json);
            }
            else if(typeof config == 'string') {
                let json = JSON.parse(fs.readFileSync(config, 'utf8'));
                if(json.hasOwnProperty('void_logger')) {
                    json = json.void_logger;
                }

                if(!json.hasOwnProperty('logToConsole')) {
                    json.logToConsole = false;
                }

                return new Logger().#hiddenConstructor(logPath, json);
            }
        }
        else {
            return new Logger().#hiddenConstructor(logPath, {
                logName:'logger',
                logFormat:'[type] [date] [time] [text]',
                dateFormat: '[local]',
                timeFormat: '[local_time]'
            });
        }
    }

    /**
     * DO NOT USE This CONSTRUCTOR DIRECTLY, USE `Logger.create` instead
     */
    constructor() {}

    /**
     * Called by Logger.create
     * @param {string} logPath 
     * @param {{ logName: string, logFormat: string, dateFormat: string, logToConsole: boolean}} config 
     */
    #hiddenConstructor(logPath, config) {
        this.#logFile = path.join(logPath, config.logName+'.log');
        this.#config = config;
        return this;
    }

    #readOrCreateLogs() {
        if(fs.existsSync(this.#logFile)) {
            return fs.readFileSync(this.#logFile, 'utf8');
        }
        else {
            // create an empty log file
            fs.writeFileSync(this.#logFile, '', 'utf8');
            return '';
        }
    }

    /**
     * Internal method to clear the log
     */
    #clear() {
        fs.writeFileSync(this.#logFile, '', 'utf8');
    }

    /**
     * Add a 0 to a date number(day, month, etc...) whose value is lower than 10.
     * This make the month, day and time show the zero even if they don't technically exist
     * @param {number} dateElem 
     * @returns {number}
     */
    #convertDateElement(dateElem) {
        // check if the element is between 0(included) and 10
        if(dateElem < 10 && dateElem >= 0) {
            return `0${dateElem}`;
        }
        return dateElem;
    }

    /**
     * Add zeros to the local date
     * @param {string} local 
     * @returns 
     */
    #convertLocalDate(local='1/1/2023') {
        return local.split('/').map(value => {
            return this.#convertDateElement(Number(value));
        }).join('/');
    }

    /**
     * write a message in the log using this type.
     * @param {'info'|'warning'|'error'} type the type of logging(info, warning, error)
     * @param {string} message 
     */
    #write(type, message) {
        // date format
        let date = new Date();
        let timeFormat = this.#config.timeFormat;
        let dateFormat = this.#config.dateFormat;

        timeFormat=timeFormat.replace('[hours]', this.#convertDateElement(date.getHours()));
        timeFormat=timeFormat.replace('[minutes]', this.#convertDateElement(date.getMinutes()));
        timeFormat=timeFormat.replace('[seconds]', this.#convertDateElement(date.getSeconds()));
        timeFormat=timeFormat.replace('[local_time]', date.toLocaleTimeString());
        timeFormat=timeFormat.replace('[milliseconds]', this.#convertDateElement(date.getMilliseconds()));

        dateFormat=dateFormat.replace('[local_date]', this.#convertLocalDate(date.toLocaleDateString()));
        dateFormat=dateFormat.replace('[local]', date.toLocaleString());
        dateFormat=dateFormat.replace('[year]', date.getFullYear());
        dateFormat=dateFormat.replace('[month]', this.#convertDateElement(date.getMonth()));
        dateFormat=dateFormat.replace('[day]', this.#convertDateElement(date.getDay()));
        dateFormat=dateFormat.replace('[time]', timeFormat);

        let output = this.#config.logFormat;

        output=output.replace('[type]', `[${type}]`);
        output=output.replace('[date]', `[${dateFormat}]`);
        output=output.replace('[time]', `[${timeFormat}]`);
        output=output.replace('[text]', message);

        let log = this.#readOrCreateLogs();
        if(log == '') {
            log = log+output;
        }
        else {
            log = log+`\n${output}`;
        }
        fs.writeFileSync(this.#logFile, log, 'utf8');

        if(this.#config.logToConsole) {
            console.log(output);
        }
    }

    clearLog() {
        this.#clear();
    }

    info(text) {
        this.#write('info', text);
    }

    error(text) {
        this.#write('error', text);
    }

    warning(text) {
        this.#write('warning', text);
    }
}

module.exports = {
    Logger:Logger
}
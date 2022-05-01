const fs = require('fs')
const path = require('path')
const bulkReplace = require('void-bulk-replace')

function isClass(func){
    // Class constructor is also a function
    if(!(func && func.constructor === Function) || func.prototype === undefined)
      return false;
    
    // This is a class that extends other class
    if(Function.prototype !== Object.getPrototypeOf(func))
      return true;
    
    // Usually a function will only have 'constructor' in the prototype
    return Object.getOwnPropertyNames(func.prototype).length > 1;
}

/**
 * Load a config file
 * @returns {Object}
 */
function loadConfig() {
    let file = path.join(process.cwd(), 'void_logger.json')
    if(fs.existsSync(file)) {
        return JSON.parse(fs.readFileSync(file, 'utf8'))
    }

    // no config found
    return {
        "log": {
            "format": "DEFAULT",
            "date_format": "DEFAULT",
            "errror_format": "DEFAULT"
        }
    }
}


class Logger {

    /**
     * @type { {format:{ log:String,date?:String, error?:String, object?:{ space:Number } }} } #config
     */
    #config = {
        format: {
            log: 'DEFAULT',
            date: 'DEFAULT',
            error: 'DEFAULT',
            object: {
                space:0
            }
        }
    }

    /**
     * @param {string} logPath 
     */
    constructor(logPath) {
        this.logPath = logPath
        this.#config = loadConfig()
    }

    /**
     * @param {Error|Date|any} value
     */
    #format(value) {
        if(value instanceof Error) {
            let formating = this.#config.format.error
            if(formating != 'DEFAULT') {
                return bulkReplace(formating, {
                    '{stack}':value.stack,
                    '{name}':value.name,
                    '{message}':value.message
                })
            }
            return value.stack
        }
        else if(value instanceof Date) {
            let formating = this.#config.format.date
            let year = value.getFullYear()
            let month = value.getMonth()
            let day = value.getDay()
            let hours = value.getHours()
            let minutes = value.getMinutes()
            let seconds = value.getSeconds()
            let time = value.toLocaleTimeString()
            if(formating != 'DEFAULT') {
                return bulkReplace(formating, {
                    '{time}':time,
                    '{year}':year,
                    '{month}':month,
                    '{day}':day,
                    '{hours}':hours,
                    '{minutes}':minutes,
                    '{seconds}': seconds
                })
            }
            return value.toLocaleString()
        }
        else if(typeof value == 'object') {
            return JSON.stringify(value, null, this.#config.format.object.space)
        }
        else {
            let formating = this.#config.format.log
            if(formating != 'DEFAULT') {
                return bulkReplace(formating, {
                    '{date}':this.#format(new Date()),
                    '{body}':value
                })
            }
            return `[${this.#format(new Date())}] ${value}`
        }
    }

     /**
     * Get a logger. Create it if it doesn't exist.
     * @param {string} logPath 
     */
    #getLogger(logPath) {
        if(fs.existsSync(logPath)) {
            return fs.readFileSync(logPath, 'utf8')
        }
        else {
            fs.writeFileSync(logPath, '', 'utf8')
        }
        return ''
    }

    log(message) {
        let logFile = this.#getLogger(this.logPath)

        // make sure the variable is not null
        let msg = this.#format(message)

        logFile+=`${msg}\n`
        logFile.trim()
        fs.writeFileSync(this.logPath, logFile, 'utf8')
    }

    clear() {
        fs.writeFileSync(this.logPath, '', 'utf8')
    }
}

class LogManager {
    /**
     * Create or get an active Logger
     * @param {string} logPath
     */
    static getOrCreateLogger(logPath) {
        return new Logger(logPath)
    }

    /**
     * Delete a log file
     * @param {string} logPath 
     */
    static deleteLog(logPath) {
        fs.unlinkSync(logPath)
    }
}

module.exports = LogManager
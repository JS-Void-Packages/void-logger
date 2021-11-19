const fs = require('fs')
const path = require('path')

// Custom errors
class CustomError extends Error {
    constructor(name, message) {
        super(message)
        this.name = name
    }
}

class NullPointerException extends CustomError {
    constructor(message) {
        super('NullPointerException', message)
    }
}

/**
 * Make sure the obj is not null.
 * @param {*} obj 
 * @param {string} message
 * @returns {NullPointerException|*} return a NullPointerException if the obj is null
 */
 function requireNonNull(obj, message='Error Object is null') {
    if(obj instanceof Error) return obj.stack
    else if(obj == {} || obj == null || obj == ''  || obj == ' ' || typeof obj == 'undefined') return new NullPointerException(message).stack
    return obj
}

/**
 * Get a logger. Create it if it doesn't exist.
 * @param {string} logPath 
 */
function getLogger(logPath) {
    if(fs.existsSync(logPath)) {
        return fs.readFileSync(logPath, 'utf8')
    }
    else {
        fs.writeFileSync(logPath, '', 'utf8')
    }
    return ''
}

class Logger {

    /**
     * @param {string} logPath 
     */
    constructor(logPath) {
        this.logPath = logPath
    }

    log(message) {
        let logFile = getLogger(this.logPath)

        // make sure the variable is not null
        let msg = requireNonNull(message, `the variable \`message\` is null or undefined`)
        
        // stringify the object 
        if(typeof msg == 'object') {
            msg = JSON.stringify(msg)
        }

        logFile+=`${msg}\n`
        fs.writeFileSync(this.logPath, logFile, 'utf8')
    }

    clear() {
        fs.writeFileSync(this.logPath, '', 'utf8')
    }
}

class LoggerBuilder {
    setLogPath(logPath) {
        this.logPath = logPath
        return this
    }
    build() {
        return new Logger(this.logPath)
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
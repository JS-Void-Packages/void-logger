const fs = require('fs')
const path = require('path')

// Custom errors
class CustomError extends Error {
    constructor(name, message) {
        super(message)
        this.name = name
    }
}

// NullPointerException indicating something is null or undefined
class NullPointerException extends CustomError {
    constructor(message) {
        super('NullPointerException', message)
    }
}

/**
 * Make sure the obj is not null.
 * @param {*} obj 
 * @param {string} message
 * @returns {NullPointerException|*}
 */
function requireNonNull(obj, message='Error Object is null') {
    if(obj == {} || obj == null || obj == ''  || obj == ' ' || typeof obj == 'undefined') return new NullPointerException(message)
    return obj
}

function getData(options={ checkForNull:false, log_file:'latest.log', log_location:'.', encoding:'utf8'}) {
    let file_path = path.join(options.log_location, options.log_file)
    let data = ""
    if(fs.existsSync(file_path)) {
        data = fs.readFileSync(file_path, options.encoding)
    }
    return data
}

function checkForObject(obj) {
    if(typeof obj === 'object') {
        return JSON.stringify(obj)
    }
    return obj
}

module.exports = class VoidLogger {
    /**
     * Create a new logger
     * @param {string} log_name Logger file name
     */
    constructor(log_name) {
        this.options = {
            checkForNull:false,
            log_file:`${log_name}.log`,
            log_location:'',
            encoding:'utf8'
        }
    }

    /**
     * Set the log path
     * @param {string} log_path path to the log, crash if the path doesn't exist
     */
    setLogLocation(log_path) {
        if(!fs.existsSync(log_path)) throw new NullPointerException(`Path ${log_path} does not exists!`)
        this.options.log_location = log_path
        return this
    }

    shouldCheckForNull() {
        this.options.checkForNull = true
        return this
    }

    /**
     * Print a information message
     * @param {any} message 
     */
    info(message) {
        this.print('Info', checkForObject(message))
    }

    /**
     * Print an warning message
     * @param {any} message 
     */
    warning(message) {
        this.print('Warning', checkForObject(message))
    }

    /**
     * Print an error message
     * @param {any} message 
     */
    error(message) {
        this.print('Error', checkForObject(message))
    }

    /**
     * Print a message in the log
     * @param {string} type 
     * @param {any} message 
     */
    print(type, message) {
        message = requireNonNull(message, 'Object is empty or null')
        if(message instanceof Error || message instanceof NullPointerException) {
            this.writeToLog(message.stack)
        }
        else {
            this.writeToLog(`[${type}] ${Array.isArray(message) || typeof message == 'object' ? JSON.stringify(message):message}`)
        }
    }

    /**
     * Write Data to the log
     * @param {any} data 
     */
    writeToLog(data) {
        let file_path = path.join(this.options.log_location, this.options.log_file)
        let log_data = getData(this.options)
        if(log_data == "") {
            log_data = data
        }
        else {
            log_data = `${log_data}\n${data}`
        }
        fs.writeFileSync(file_path, log_data, this.options.encoding)
    }

    /**
     * Clear the log
     */
    clear() {
        let file_path = path.join(this.options.log_location, this.options.log_file)
        fs.writeFileSync(file_path, '', this.options.encoding)
    }

    /**
     * Clear the log and write a message.
     */
    clearLog() {
        this.clear()
        this.print('clear', 'log was cleared!')
    }
}
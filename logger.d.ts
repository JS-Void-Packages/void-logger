type Config = {
    logName: string,
    logFormat: string,
    dateFormat: string,
    timeFormat: string,
    logToConsole?: boolean
}

type LargeConfig = {
    void_logger:Config
}

export class Logger {

    /**
     * Create a Logger instance from a path(where the log will be) and a config object/path to a config file
     * @param logPath path to the folder where the log will be in.
     * @param config null/undefined config file/objects will load the default config.
     */
    static create(logPath: string, config?: LargeConfig | Config | string | null): Logger

    /**
     * Clear the log
     */
    clearLog(): void

    /**
     * Print an informative message to the log
     * @param text 
     */
    info(text: string): void

    /**
     * Print an error message to the log
     * @param text 
     */
    error(text: string): void

    /**
     * Print a warning message to the log
     * @param text 
     */
    warning(text: string): void
}
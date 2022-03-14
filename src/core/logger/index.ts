import { isStringOrNumber } from "../Utils";

export enum LogLevel {
    NONE,
    INFO,
    TRACE,
    DEBUG,
    WARNING,
    ERROR
}

export class LogMessage {
    time: Date = new Date();
    type: LogLevel = LogLevel.NONE;
    message: string = "";
}

export class Logger {
    static level: LogLevel = LogLevel.NONE;
    static onLog = (msg: LogMessage) => { };
    static onClearLog = function () { };

    static getMessage = function (args: Array<any>) {
        let message = "";
        for (let arg of args) {
            if (!arg.stack && !arg.message) {
                message += isStringOrNumber(arg) ? arg : JSON.stringify(arg)
            }
            else {
                message += arg.message;
            }
            message += " ";
        }
        return message;
    }

    static setLevel(level: LogLevel): void {
        this.level = level;
    }

    static clear(): void {
        console.clear();
        this.onClearLog()
    }

    static log(...args: any): void {
        console.log(...args);
        this.onLog({ type: LogLevel.DEBUG, time: new Date(), message: this.getMessage(args) })
    }

    static info(...args: any): void {
        console.info(...args);
        this.onLog({ type: LogLevel.INFO, time: new Date(), message: this.getMessage(args) })
    }

    static error(...args: any): void {
        console.error(...args);
        this.onLog({ type: LogLevel.ERROR, time: new Date(), message: this.getMessage(args) })
    }

    static warn(...args: any): void {
        console.warn(...args);
        this.onLog({ type: LogLevel.WARNING, time: new Date(), message: this.getMessage(args) })
    }

    static trace(...args: any): void {
        console.trace(...args);
        this.onLog({ type: LogLevel.TRACE, time: new Date(), message: this.getMessage(args) })
    }
}
import * as fs from 'fs';
import { TimeService } from './time';

// Logger is a Singleton and needs dependencies set with setDependencies() before usage
export class Logger {
    private static timeService: TimeService;
    private static debugFilename: string;
    private static errorsFilename: string;

    private static instance: Logger | null = null;

    // persistent storage for file handlers
    private fileStreams: Record<string, fs.WriteStream> = {};

    private constructor() {}

    public static setDependencies(
        timeService: TimeService,
        debugFilename: string,
        errorsFilename: string
    ) {
        Logger.timeService = timeService;
        Logger.errorsFilename = errorsFilename;
        Logger.debugFilename = debugFilename;
    }

    public static getInstance(): Logger {
        if (this.instance === null) {
            this.instance = new Logger();
        }
        return this.instance;
    }

    public error(message: string): string {
        return this.logfile(Logger.errorsFilename, message);
    }

    public debug(message: string): string {
        return this.logfile(Logger.debugFilename, message);
    }

    public makeLogMsg(message: string): string {
        return [
            '[' + Logger.timeService.getLocalDateTime() + ']',
            message
        ].join('\n');
    }

    private logfile(filename: string, message: string): string {
        if (filename in this.fileStreams === false) {
            this.fileStreams[filename] = fs.createWriteStream(filename, {flags:'a'});
        }
        let logMsg = this.makeLogMsg(message);
        this.fileStreams[filename].write(logMsg + '\n');
        return logMsg;
    }
}

export default Logger.getInstance();

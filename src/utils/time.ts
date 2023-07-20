export class TimeService {
    constructor(
        public locale: string,
        public timezone: string
    ) {}

    public getLocalDateTime(timestamp?: number): string {
        if (timestamp !== undefined) {
            var date = new Date(timestamp);
        } else {
            var date = new Date();
        }
        return date.toLocaleString(this.locale, {timeZone: this.timezone});
    }
}

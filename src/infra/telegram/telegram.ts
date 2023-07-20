import { Telegraf } from 'telegraf';

export class TelegramService {
    constructor(
        private telegraf: Telegraf, // hardwiring to Telegraf class here
        private chatId: string
    ) {}

    public launch(): void {
        this.telegraf.launch();
    }

    public send(message: string): any {
        return this.telegraf.telegram.sendMessage(this.chatId, this.trimToThreshold(message));
    }

    // trimToThreshold trims string to Telegram API max message length
    private trimToThreshold(message: string) {
        if (message.length > 4096) {
            return message.slice(0, 4096);
        }
        return message;
    }
}

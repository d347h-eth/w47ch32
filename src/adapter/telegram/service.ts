import { Notification } from '../../domain/notification';
import { Telegraf } from 'telegraf';

export class Service {
    constructor(
        private telegraf: Telegraf, // hardwiring to Telegraf class here
        private chatId: string
    ) {}

    public launch(): void {
        this.telegraf.launch();
    }

    public sendText(message: string): Promise<any> {
        return this.telegraf.telegram.sendMessage(this.chatId, this.trimToThreshold(message));
    }

    public sendBatch(messages: Notification[]): Promise<any> {
        return this.telegraf.telegram.sendMessage(
            this.chatId,
            this.trimToThreshold(messages.map(notification => notification.render()).join('\n')
        ));
    }

    // trimToThreshold trims string to Telegram API max message length
    private trimToThreshold(message: string) {
        if (message.length > 4096) {
            return message.slice(0, 4096);
        }
        return message;
    }
}

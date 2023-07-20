import { Telegraf } from 'telegraf';
import logger from '../../utils/logger';
import { inspect } from 'util';

export class TelegrafFactory {
    constructor(private botToken: string) {}

    public newClient(): Telegraf {
        var client = new Telegraf(this.botToken);
        client.catch((error) => {
            logger.error(inspect(error));
        })
        process.once('SIGINT', () => client.stop('SIGINT'));
        process.once('SIGTERM', () => client.stop('SIGTERM'));
        return client;
    }
}

import dotenv from 'dotenv';

dotenv.config();

const config: any = {
    logDebug: process.env.LOG_DEBUG || 'debug.log',
    logError: process.env.LOG_ERROR || 'errors.log',
    locale: process.env.LOCALE || 'en-GB',
    timezone: process.env.TIMEZONE || 'Europe/Berlin',
    // removing "undefined" with "!" here, because we'll check for empty values right away to make sure it's safe for runtime
    openSeaSecretKey: process.env.OPENSEA_SECRET_KEY!,
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN!,
    telegramChatId: process.env.TELEGRAM_CHAT_ID!
};

// all settings are mandatory
for (let key in config) {
    if (config.hasOwnProperty(key) && config[key] === undefined) {
        throw new Error('Required config value is missing: ' + key);
    }
}

export default config;

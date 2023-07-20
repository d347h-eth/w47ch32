import config from './config';
import { TimeService } from './src/utils/time';
import { Logger } from './src/utils/logger';
import logger from './src/utils/logger';
import { Mutex } from 'async-mutex';
import { QueueService } from './src/usecase/queue_service';
import { Notifier } from './src/usecase/notifier/notifier';
import { OpenSeaFactory } from './src/infra/opensea/client_factory';
import { OpenSeaEventStream } from './src/adapter/opensea/stream';
import { MarketEventFactory } from './src/adapter/opensea/market_event_factory';
import { NotificationFactory } from './src/usecase/listener/notification_factory';
import { StreamListener } from './src/usecase/listener/stream_listener';
import { TelegrafFactory } from './src/infra/telegram/factory';
import { TelegramService } from './src/infra/telegram/telegram';

// setup time service and singleton logger
var timeService = new TimeService(config.locale, config.timezone);
Logger.setDependencies(timeService, config.logDebug, config.logError);

var telegrafFactory = new TelegrafFactory(config.telegramBotToken);
var telegramClient = telegrafFactory.newClient();
var telegramService = new TelegramService(telegramClient, config.telegramChatId);

// setup queue service and notifier use case
var mutex = new Mutex();
var queueService = new QueueService(mutex);
var notifier = new Notifier(queueService, telegramService);

// setup OpenSea stream client
var openSeaFactory = new OpenSeaFactory(config.openSeaSecretKey);
var openSeaStreamClient = openSeaFactory.newStreamClient();
var marketEventFactory = new MarketEventFactory();
var openSeaEventStream = new OpenSeaEventStream(openSeaStreamClient, marketEventFactory);

// setup stream listener adapter
var notificationFactory = new NotificationFactory(timeService);
var streamListener = new StreamListener(openSeaEventStream, queueService, notificationFactory);

telegramService.launch();
telegramService.send(logger.makeLogMsg('57427 w47ch1n9'));

// register stream event listeners
// streamListener.registerCollectionOffer('*');
// streamListener.registerItemListed('*');
// streamListener.registerItemSold('*');
// Midnight Society Founders Access Pass
// streamListener.registerCollectionOffer('founderaccesspass');
streamListener.registerItemListed('founderaccesspass');
streamListener.registerItemSold('founderaccesspass');
// IN NOISE WE TRUST
// streamListener.registerCollectionOffer('inwt');
streamListener.registerItemListed('inwt');
streamListener.registerItemSold('inwt');

// start consuming the queue and push notifications
notifier.work();

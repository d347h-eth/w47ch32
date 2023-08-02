import { MarketEvent, Type as EventType } from '../../domain/market_event';
import { Notification } from '../../domain/notification';
import logger from '../../utils/logger';

interface QueueService {
    enqueue(notification: Notification): Promise<void>;
}

interface EventStream {
    registerCollectionOffer(filter: string, callback: Function): void;
    registerItemListed(filter: string, callback: Function): void;
    registerItemSold(filter: string, callback: Function): void;
}

interface NotificationFactory {
    newNotification(marketEvent: MarketEvent): Notification;
}

export class StreamListener {
    protected stickyOffers: Record<string, string> = {};
    protected registry: Record<string, string[]> = {};

    constructor(
        private eventStream: EventStream,
        private queueService: QueueService,
        private notificationFactory: NotificationFactory,
    ) {}

    public getRegisteredFilters(): string[] {
        return Object.entries(this.registry).map(([key, value]) => key + ': ' + value.join(', '));
    }

    public registerCollectionOffer(filter: string, callback?: Function): void {
        this.rememberFilter(EventType.CollectionOffer, filter);
        if (callback === undefined) {
            callback = (marketEvent: MarketEvent) => {
                // remember offer to avoid spamming
                let isStickyOffer = this.stickOffer(marketEvent);
                if (isStickyOffer) {
                    return;
                }
                // convert MarketEvent into Notification and send it to the queue
                this.queueService.enqueue(this.notificationFactory.newNotification(marketEvent));
            };
        }
        this.eventStream.registerCollectionOffer(filter, callback);
    }

    public registerItemListed(filter: string, callback?: Function): void {
        this.rememberFilter(EventType.ItemListed, filter);
        if (callback === undefined) {
            callback = this.callbackOnEvent(filter);
        }
        this.eventStream.registerItemListed(filter, callback);
    }

    public registerItemSold(filter: string, callback?: Function): void {
        this.rememberFilter(EventType.ItemSold, filter);
        if (callback === undefined) {
            callback = this.callbackOnEvent(filter);
        }
        this.eventStream.registerItemSold(filter, callback);
    }

    private rememberFilter(eventType: EventType, filter: string): void {
        if (!(eventType in this.registry)) {
            this.registry[eventType] = [];
        }
        this.registry[eventType].push(filter);
    }

    // callbackOnEvent is a default handler
    private callbackOnEvent(filter: string): Function {
        return (marketEvent: MarketEvent) => {
            this.queueService.enqueue(this.notificationFactory.newNotification(marketEvent));
        };
    }

    private stickOffer(marketEvent: MarketEvent): boolean {
        // skip if the same offer happened before
        if (marketEvent.getMaker() in this.stickyOffers) {
            if (this.stickyOffers[marketEvent.getMaker()] == marketEvent.getFormattedPrice()) {
                logger.debug('ignoring repeated offer "' + marketEvent.getOrderHash() + '"');
                return true;
            }
        }
        this.stickyOffers[marketEvent.getMaker()] = marketEvent.getFormattedPrice();
        return false;
    }
}

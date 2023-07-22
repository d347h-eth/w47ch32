import { MarketEvent } from '../../domain/market_event';
import { Notification } from '../../domain/notification';
import logger from '../../utils/logger';

interface QueueService {
    enqueue(notification: Notification): Promise<void>;
}

interface EventStream {
    onCollectionOffer(filter: string, callback: Function): void;
    onItemListed(filter: string, callback: Function): void;
    onItemSold(filter: string, callback: Function): void;
}

interface NotificationFactory {
    newNotification(marketEvent: MarketEvent): Notification;
}

export class StreamListener {
    protected stickyOffers: Record<string, string> = {};

    constructor(
        private eventStream: EventStream,
        private queueService: QueueService,
        private notificationFactory: NotificationFactory,
    ) {}

    public registerCollectionOffer(filter: string, callback?: Function): void {
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
        this.eventStream.onCollectionOffer(filter, callback);
    }

    public registerItemListed(filter: string, callback?: Function): void {
        if (callback === undefined) {
            callback = this.callbackOnEvent();
        }
        this.eventStream.onItemListed(filter, callback);
    }

    public registerItemSold(filter: string, callback?: Function): void {
        if (callback === undefined) {
            callback = this.callbackOnEvent();
        }
        this.eventStream.onItemSold(filter, callback);
    }

    // callbackOnEvent is a default handler
    private callbackOnEvent(): Function {
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

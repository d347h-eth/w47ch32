import { MarketEvent } from '../../domain/market_event';
import logger from '../../utils/logger';
import { inspect } from 'util';

interface MarketEventFactory {
    newMarketEvent(event: any): MarketEvent | null;
}

interface StreamClient {
    onCollectionOffer(filter: string, callback: Function): void;
    onItemListed(filter: string, callback: Function): void;
    onItemSold(filter: string, callback: Function): void;
}

// EventStream registers listeners on the OpenSea Stream Client
// and maps OS client event objects into internal domain's MarketEvent
export class EventStream {
    constructor(
        private streamClient: StreamClient,
        private marketEventFactory: MarketEventFactory
    ) {}

    public registerCollectionOffer(filter: string, callback: Function): void {
        this.streamClient.onCollectionOffer(filter, this.callbackOnEvent(callback));
    }

    public registerItemListed(filter: string, callback: Function): void {
        this.streamClient.onItemListed(filter, this.callbackOnEvent(callback));
    }

    public registerItemSold(filter: string, callback: Function): void {
        this.streamClient.onItemSold(filter, this.callbackOnEvent(callback));
    }

    // callbackOnEvent is a default handler
    private callbackOnEvent(callback: Function): Function {
        return (event: any) => {
            logger.debug(JSON.stringify(event));
            let marketEvent = this.marketEventFactory.newMarketEvent(event);
            if (marketEvent === null) {
                logger.error('Couldn\'t instantiate MarketEvent for:\n' + inspect(event));
                return;
            }
            callback(marketEvent);
        };
    }
}

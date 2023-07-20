import { MarketEvent } from '../../domain/market_event';
import logger from '../../utils/logger';

interface MarketEventFactory {
    newMarketEvent(event: any): MarketEvent;
}

interface OpenSeaStreamClient {
    onCollectionOffer(filter: string, callback: Function): void;
    onItemListed(filter: string, callback: Function): void;
    onItemSold(filter: string, callback: Function): void;
}

// OpenSeaStream registers listeners on the OpenSea Stream Client
// and maps OS client event objects into internal domain's MarketEvent
export class OpenSeaEventStream {
    constructor(
        private openSeaStreamClient: OpenSeaStreamClient,
        private marketEventFactory: MarketEventFactory
    ) {}

    public onCollectionOffer(filter: string, callback: Function): void {
        this.openSeaStreamClient.onCollectionOffer(filter, (event: any) => {
            logger.debug(JSON.stringify(event));
            let marketEvent = this.marketEventFactory.newMarketEvent(event);
            callback(marketEvent);
        });
    }

    public onItemListed(filter: string, callback: Function): void {
        this.openSeaStreamClient.onCollectionOffer(filter, (event: any) => {
            logger.debug(JSON.stringify(event));
            let marketEvent = this.marketEventFactory.newMarketEvent(event);
            callback(marketEvent);
        });
    }

    public onItemSold(filter: string, callback: Function): void {
        this.openSeaStreamClient.onCollectionOffer(filter, (event: any) => {
            logger.debug(JSON.stringify(event));
            let marketEvent = this.marketEventFactory.newMarketEvent(event);
            callback(marketEvent);
        });
    }
}

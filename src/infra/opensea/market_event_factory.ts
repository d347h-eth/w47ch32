import { MarketEvent } from '../../domain/market_event'; 

export class MarketEventFactory {
    private eventTypeMapping: Record<string, Function> = {
        'collection_offer': this.newCollectionOfferEvent,
        'item_listed': this.newItemListedEvent,
        'item_sold': this.newItemSoldEvent
    };

    public newMarketEvent(event: any): MarketEvent | null {
        let typeBuilder = this.eventTypeMapping[event.event_type];
        if (typeBuilder === undefined) {
            return null;
        }
        return typeBuilder.bind(this, event)();
    }

    public newCollectionOfferEvent(event: any): MarketEvent {
        let newEvent = this.makeMarketEventFromOSEvent(event);
        newEvent.setTotalPrice(event.payload.base_price);
        return newEvent;
    }

    public newItemListedEvent(event: any): MarketEvent {
        let newEvent = this.makeMarketEventFromOSEvent(event);
        newEvent.setTotalPrice(event.payload.base_price);
        return newEvent;
    }

    public newItemSoldEvent(event: any): MarketEvent {
        let newEvent = this.makeMarketEventFromOSEvent(event);
        newEvent.setTotalPrice(event.payload.sale_price);
        return newEvent;
    }

    private makeMarketEventFromOSEvent(event: any): MarketEvent {
        return new MarketEvent(
            event.payload.event_timestamp,
            event.event_type,
            event.payload.order_hash,
            event.payload.collection.slug,
            event.payload.maker.address,
            event.payload.quantity,
            event.payload.payment_token.symbol,
            event.payload.payment_token.decimals
        );
    }
}

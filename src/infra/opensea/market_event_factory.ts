import { MarketEvent } from '../../domain/market_event'; 

export class MarketEventFactory {
    private eventTypeMapping: Record<string, Function> = {
        'collection_offer': this.newCollectionOfferEvent,
        'item_listed': this.newItemListedEvent,
        'item_sold': this.newItemSoldEvent
    };

    public newMarketEvent(event: any): MarketEvent {
        let typeBuilder = this.eventTypeMapping[event.type];
        if (typeBuilder === undefined) {
            throw new Error('Unexpected event type: "' + event.type + '"');
        }
        return typeBuilder(event);
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
            event.event_timestamp,
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
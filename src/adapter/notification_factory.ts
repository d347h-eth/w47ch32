import { MarketEvent } from '../domain/market_event';
import { Notification } from '../usecase/notifier/notification';

export class NotificationFactory {
    public newNotification(marketEvent: MarketEvent): Notification {
        return new Notification(
            marketEvent.getCreatedAt(),
            marketEvent.getOrderHash(),
            marketEvent.getType(),
            marketEvent.getCollectionSlug(),
            marketEvent.getMaker(),
            marketEvent.getQuantity(),
            marketEvent.getUnitPrice(),
            marketEvent.getPaymentTokenSymbol(),
            marketEvent.getPaymentTokenDecimals()
        );
    }
}

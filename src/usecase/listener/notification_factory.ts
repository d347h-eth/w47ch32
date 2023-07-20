import { MarketEvent } from '../../domain/market_event';
import { Notification } from '../notifier/notification';
import { TimeService } from '../../utils/time';

export class NotificationFactory {
    public constructor(private timeService: TimeService) {}

    public newNotification(marketEvent: MarketEvent): Notification {
        return new Notification(
            this.timeService.getLocalDateTime(marketEvent.getCreatedAt()),
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

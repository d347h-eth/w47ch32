import { formatPrice } from '../utils/utils';

export class MarketEvent {
    private totalPrice: number = 0;

    constructor(
        private createdAt: string,
        private type: string,
        private orderHash: string,
        private collectionSlug: string,
        private maker: string,
        private quantity: number,
        private paymentTokenSymbol: string,
        private paymentTokenDecimals: number
    ) {}

    public getCreatedAt() {
        return this.createdAt;
    }

    public getType() {
        return this.type;
    }

    public getOrderHash() {
        return this.orderHash;
    }

    public getCollectionSlug() {
        return this.collectionSlug;
    }

    public getMaker() {
        return this.maker;
    }

    public getQuantity() {
        return this.quantity;
    }

    public setTotalPrice(price: string) {
        this.totalPrice = parseInt(price);
    }

    public getTotalPrice() {
        return this.totalPrice;
    }

    public getUnitPrice() {
        return this.getTotalPrice() / this.getQuantity();
    }

    public getPaymentTokenSymbol() {
        return this.paymentTokenSymbol;
    }

    public getPaymentTokenDecimals() {
        return this.paymentTokenDecimals;
    }

    public getFormattedPrice() {
        return formatPrice(this.getUnitPrice(), this.getPaymentTokenDecimals());
    }
}

import { formatPrice } from '../utils/utils';

export enum Type {
    CollectionOffer = 'collection_offer',
    ItemListed = 'item_listed',
    ItemSold = 'item_sold'
}

export class MarketEvent {
    private totalPrice: number = 0;

    constructor(
        private createdAt: string,
        private type: Type,
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

    public getType(): Type {
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

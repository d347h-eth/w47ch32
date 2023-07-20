import { formatPrice } from '../../utils/utils';

export class Notification {
    constructor(
        public eventTimestamp: string,
        public id: string,
        public type: string,
        public collectionSlug: string,
        public maker: string,
        public quantity: number,
        public unitPrice: number,
        public paymentTokenSymbol: string,
        public paymentTokenDecimals: number
    ) {}

    public render(): string {
        return [
            '[' + this.eventTimestamp + ']',
            'Collection: ' + this.collectionSlug,
            'Event: ' + this.type,
            'Maker: ' + this.maker,
            'Deal: ' + this.getDeal()
        ].join('\n');
    }

    public getId(): string {
        return this.id;
    }

    public getDeal(): string {
        return this.quantity + "x" + this.getFormattedPrice() + " " + this.paymentTokenSymbol;
    }

    public getFormattedPrice(): string {
        return formatPrice(this.unitPrice, this.paymentTokenDecimals);
    }
}

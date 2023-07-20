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

    public render() {
        let quantity = this.quantity;
        let symbol = this.paymentTokenSymbol;
        let price = quantity + "x" + this.getFormattedPrice() + " " + symbol;
        return [
            '[' + this.getEventTimestamp() + ']',
            this.collectionSlug,
            this.type,
            this.maker,
            price
        ].join('\n');
    }

    public getId() {
        return this.id;
    }

    public getEventTimestamp(): string {
        return this.eventTimestamp;
    }

    public getFormattedPrice() {
        return formatPrice(this.unitPrice, this.paymentTokenDecimals);
    }
}

declare interface Partner {
    id: string;
    publicKey: string;
}

declare interface PartnerTransLog {
    id: string;
    client: Partner;
    transaction: Transaction;
    createdAt: Date;
    updatedAt: Date;
}

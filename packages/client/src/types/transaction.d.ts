declare interface Transaction {
    id: number;
    note: string;
    sourceAccount: string;
    desAccount: string;
    amount: number;
    bankType: string;
    isDebtPay: boolean;
    isMyBankSend: boolean;

    createdAt: Date;
    updatedAt: Date;
}

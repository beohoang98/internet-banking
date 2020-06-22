import { Column, Entity, ManyToOne } from "typeorm";
import { Base } from "./Base";
import { BankTypeEnum } from "./ReceiverList";
import { User } from "./User";

@Entity({
    name: "transaction",
})
export class Transaction extends Base<Transaction> {
    @Column()
    note: string;

    @Column()
    sourceAccount: string;

    @Column()
    desAccount: string;

    @Column()
    amount: number;

    @Column({ type: "enum", enum: BankTypeEnum })
    bankType: BankTypeEnum;

    @Column()
    isDebtPay: boolean;

    @Column({ nullable: true })
    isMyBankSend: boolean;
}

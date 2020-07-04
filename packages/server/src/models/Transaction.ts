import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Base } from "./Base";
import { BankTypeEnum } from "./ReceiverList";
import { User } from "@src/models/User";

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

    @ManyToOne(() => User, {
        onUpdate: "CASCADE",
        onDelete: "NO ACTION",
    })
    @JoinColumn({ name: "desAccount", referencedColumnName: "accountNumber" })
    desUser: User;

    @Column()
    amount: number;

    @Column({ type: "enum", enum: BankTypeEnum })
    bankType: BankTypeEnum;

    @Column()
    isDebtPay: boolean;

    @Column({ default: false, nullable: false })
    isRemitterCharge: boolean;

    @Column({ nullable: true })
    isMyBankSend: boolean;
}

import { Base } from "@src/models/Base";
import { Entity, JoinColumn, ManyToOne } from "typeorm";
import { Transaction } from "@src/models/Transaction";
import { Admin } from "@src/models/Admin";

@Entity({ name: "deposit_log" })
export class DepositLog extends Base<DepositLog> {
    @ManyToOne(() => Transaction)
    @JoinColumn({ name: "transaction_id" })
    transaction: Transaction;

    @ManyToOne(() => Admin)
    @JoinColumn({ name: "admin_id" })
    by: Admin;
}

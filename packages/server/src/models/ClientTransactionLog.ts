import { Base } from "@src/models/Base";
import { Entity, JoinColumn, ManyToOne } from "typeorm";
import { Client } from "@src/models/Client";
import { Transaction } from "@src/models/Transaction";

@Entity({
    name: "client_transaction_log",
})
export class ClientTransactionLog extends Base<ClientTransactionLog> {
    @ManyToOne(() => Client, { onDelete: "NO ACTION" })
    @JoinColumn({ name: "client_id" })
    client: Client;

    @ManyToOne(() => Transaction)
    @JoinColumn({ name: "transaction_id" })
    transaction: Transaction;
}

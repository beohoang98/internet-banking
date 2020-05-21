import { Base } from "@src/models/Base";
import { Column, Entity, ManyToOne } from "typeorm";
import { Client } from "@src/models/Client";

@Entity("client_request_log")
export class ClientRequestLog extends Base<ClientRequestLog> {
    @Column({ type: "json" })
    data: any;

    @Column({ type: "text", name: "raw_signature" })
    rawSignature: Buffer | string;

    @ManyToOne(() => Client, { onDelete: "NO ACTION" })
    client: Client;
}

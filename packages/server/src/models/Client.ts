import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Exclude, Expose } from "class-transformer";
import { ClientTransactionLog } from "@src/models/ClientTransactionLog";

export enum ClientType {
    PGP = "PGP",
    RSA = "RSA",
}

@Entity()
@Exclude()
export class Client {
    @PrimaryColumn()
    @Expose()
    id: string;

    @Column()
    secret: string;

    @Column({ nullable: true })
    @Expose({ groups: ["admin"] })
    publicKey: string;

    @Column({ enum: ClientType, default: ClientType.PGP })
    @Expose()
    type: ClientType;

    @OneToMany(() => ClientTransactionLog, (log) => log.client, {
        lazy: true,
    })
    @Expose({ groups: ["admin"] })
    logs: ClientTransactionLog[];

    constructor(data: Partial<Client>) {
        Object.assign(this, data);
    }
}

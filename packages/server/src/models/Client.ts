import { Column, Entity, PrimaryColumn } from "typeorm";
import { Base } from "@src/models/Base";
import { Exclude } from "class-transformer";

@Entity()
export class Client extends Base<Client> {
    @PrimaryColumn({ type: "string" })
    id: string;

    @Column()
    @Exclude()
    secret: string;

    @Column({ nullable: true })
    @Exclude()
    publicKey: string;
}

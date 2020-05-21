import { Column, Entity, PrimaryColumn } from "typeorm";
import { Exclude } from "class-transformer";

@Entity()
export class Client {
    @PrimaryColumn()
    id: string;

    @Column()
    @Exclude()
    secret: string;

    @Column({ nullable: true })
    @Exclude()
    publicKey: string;

    constructor(data: Partial<Client>) {
        Object.assign(this, data);
    }
}

import {Column, Entity, PrimaryColumn} from 'typeorm';

@Entity()
export class Client {
    @PrimaryColumn()
    id: string;

    @Column()
    secret: string;

    @Column({ nullable: true })
    publicKey: string;
}

import { Column, Entity, ManyToOne } from "typeorm";
import { Base } from "./Base";
import { User } from "./User";

export enum BankTypeEnum {
    LOCAL = "LOCAL",
    PGP = "PGP",
    RSA = "RSA",
}

@Entity({
    name: "transferlist",
})
export class TransferList extends Base<TransferList> {
    @Column()
    desAccountNumber: string;

    @Column()
    name: string;

    @Column({ type: "enum", enum: BankTypeEnum })
    bankType: BankTypeEnum;

    @ManyToOne(() => User)
    user!: User;
}

import { Column, Entity, ManyToOne } from "typeorm";
import { Base } from "./Base";
import { User } from "./User";

@Entity({
    name: "saving_account",
})
export class SavingAccount extends Base<SavingAccount> {
    @ManyToOne(() => User)
    user!: User;

    @Column()
    name: string;

    @Column()
    amount: number;

    @Column()
    time: number;
}

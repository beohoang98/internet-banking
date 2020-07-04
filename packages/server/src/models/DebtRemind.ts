import { Column, Entity } from "typeorm";
import { Base } from "./Base";

@Entity({
    name: "dept_remind",
})
export class DebtRemind extends Base<DebtRemind> {
    @Column()
    amount: number;

    @Column()
    remindNote: string;

    @Column({ default: "" })
    completeNote: string;

    @Column({ default: false })
    isDone: boolean;

    @Column()
    sourceAccount: string;

    @Column()
    desAccount: string;

    @Column()
    name: string;
}

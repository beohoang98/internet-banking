import { Column, Entity } from "typeorm";
import { Base } from "./Base";

@Entity({
    name: "dept_remind",
})
export class DeptRemind extends Base<DeptRemind> {
    @Column()
    amount: number;

    @Column()
    remindNote: string;

    @Column()
    completeNote: string;

    @Column({ default: false })
    isDone: boolean;

    @Column()
    sourceAccount: string;

    @Column()
    desAccount: string;
}

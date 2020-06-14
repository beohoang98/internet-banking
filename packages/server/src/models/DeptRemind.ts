import { Column, Entity, ManyToOne } from "typeorm";
import { Base } from "./Base";
import { User } from "./User";

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

import { Column, Entity, ManyToOne } from "typeorm";
import { Base } from "./Base";
import { User } from "./User";

@Entity({
    name: "otp",
})
export class OTP extends Base<OTP> {
    @Column()
    code: number;

    @ManyToOne(() => User)
    user!: User;

    @Column()
    expire: Date;

    @Column({ default: false })
    isUsed: boolean;
}

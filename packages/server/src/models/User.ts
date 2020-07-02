import { Column, Entity } from "typeorm";
import { Base } from "./Base";
import { Exclude, Expose } from "class-transformer";

export enum UserRole {
    CUSTOMER = "CUSTOMER",
}

@Entity({
    name: "users",
})
@Exclude()
export class User extends Base<User> {
    @Column()
    @Expose()
    name: string;

    @Column({ unique: true })
    @Expose({ groups: ["internal"] })
    email: string;

    @Column()
    password: string;

    @Column({ default: 0 })
    @Expose({ groups: ["internal"] })
    balance: number;

    @Column({ unique: true })
    @Expose()
    accountNumber: string;

    @Column()
    @Expose({ groups: ["internal"] })
    phone: string;
}

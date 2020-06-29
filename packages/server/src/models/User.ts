import { Column, Entity } from "typeorm";
import { Base } from "./Base";
import { Exclude, Expose } from "class-transformer";

export enum UserRole {
    CUSTOMER = "CUSTOMER",
}

@Entity({
    name: "users",
})
export class User extends Base<User> {
    @Column()
    name: string;

    @Column({ unique: true })
    @Exclude()
    @Expose({ groups: ["internal"] })
    email: string;

    @Column()
    @Exclude()
    password: string;

    @Column({ default: 0 })
    balance: number;

    @Column()
    accountNumber: string;

    @Column()
    @Exclude()
    @Expose({ groups: ["internal"] })
    phone: string;
}

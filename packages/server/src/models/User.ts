import { Column, Entity } from "typeorm";
import { Base } from "./Base";

export enum UserRole {
    ADMIN = "ADMIN",
    CUSTOMER = "CUSTOMER",
    EMPLOYEE = "EMPLOYEE",
}

@Entity({
    name: "users",
})
export class User extends Base<User> {
    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ type: "enum", enum: UserRole })
    role: UserRole;
}

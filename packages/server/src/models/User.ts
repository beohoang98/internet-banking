import { Column, Entity } from "typeorm";
import { Base } from "./Base";
import { Exclude } from "class-transformer";

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

    @Column({ unique: true })
    email: string;

    @Column()
    @Exclude()
    password: string;

    @Column({ type: "enum", enum: UserRole })
    role: UserRole;
}

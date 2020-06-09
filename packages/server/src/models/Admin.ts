import { Column, Entity } from "typeorm";
import { Base } from "./Base";
import { Exclude } from "class-transformer";

export enum AdminRole {
    ADMIN = "ADMIN",
    EMPLOYEE = "EMPLOYEE",
}

@Entity({
    name: "admin",
})
export class Admin extends Base<Admin> {
    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    @Exclude()
    password: string;

    @Column({ type: "enum", enum: AdminRole })
    role: AdminRole;
}

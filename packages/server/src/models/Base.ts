import {
    CreateDateColumn,
    DeleteDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Expose } from "class-transformer";

export class Base<T = any> {
    @PrimaryGeneratedColumn({ type: "bigint" })
    @Expose()
    id: number | string;

    @CreateDateColumn({ name: "created_at", default: () => "now()" })
    @Expose()
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at", default: () => "now()" })
    @Expose()
    updatedAt: Date;

    @DeleteDateColumn({ name: "deleted_at" })
    deletedAt: Date;

    constructor(data: Partial<T>) {
        Object.assign(this, data);
    }
}

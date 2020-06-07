import {
    CreateDateColumn,
    DeleteDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

export class Base<T = any> {
    @PrimaryGeneratedColumn({ type: "bigint" })
    id: number | string;

    @CreateDateColumn({ name: "created_at", default: "now()" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at", default: "now()" })
    updatedAt: Date;

    @DeleteDateColumn({ name: "deleted_at" })
    deletedAt: Date;

    constructor(data: Partial<T>) {
        Object.assign(this, data);
    }
}

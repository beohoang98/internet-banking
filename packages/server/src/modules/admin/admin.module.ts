import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Admin } from "@src/models/Admin";
import { AdminService } from "@src/modules/admin/admin.service";
import { AdminController } from "./admin.controller";
import { Client } from "@src/models";
import { ClientTransactionLog } from "@src/models/ClientTransactionLog";

@Module({
    imports: [TypeOrmModule.forFeature([Admin, Client, ClientTransactionLog])],
    providers: [AdminService],
    controllers: [AdminController],
    exports: [TypeOrmModule, AdminService],
})
export class AdminModule {}

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Admin } from "@src/models/Admin";
import { AdminService } from "@src/modules/admin/admin.service";
import { AdminController } from "./admin.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Admin])],
    providers: [AdminService],
    controllers: [AdminController],
    exports: [TypeOrmModule, AdminService],
})
export class AdminModule {}

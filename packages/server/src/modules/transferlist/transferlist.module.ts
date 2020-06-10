import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@src/models/User";
import { TransferListService } from "./transferlist.service";
import { TransferListController } from "./transferlist.controller";
import { TransferList } from "@src/models/TransferList";

@Module({
    imports: [TypeOrmModule.forFeature([User, TransferList])],
    providers: [TransferListService],
    exports: [TypeOrmModule, TransferListService],
    controllers: [TransferListController],
})
export class TrasnferListModule {}

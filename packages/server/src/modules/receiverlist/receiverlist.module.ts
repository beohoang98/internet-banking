import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@src/models/User";
import { ReceiverListService } from "./receiverlist.service";
import { ReceiverListController } from "./receiverlist.controller";
import { ReceiverList } from "@src/models/ReceiverList";

@Module({
    imports: [TypeOrmModule.forFeature([User, ReceiverList])],
    providers: [ReceiverListService],
    exports: [TypeOrmModule, ReceiverListService],
    controllers: [ReceiverListController],
})
export class ReceiverListModule {}

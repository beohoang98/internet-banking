import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@src/models/User";
import { DeptRemindService } from "./deptremind.service";
import { DeptRemindController } from "./deptremind.controller";
import { MailerModule } from "@nestjs-modules/mailer";
import mailConfig from "@src/config/mail.config";
import { DeptRemind } from "@src/models/DeptRemind";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, DeptRemind]),
        MailerModule.forRootAsync({
            useFactory: mailConfig,
        }),
    ],
    providers: [DeptRemindService],
    exports: [TypeOrmModule, DeptRemindService],
    controllers: [DeptRemindController],
})
export class DeptRemindModule {}

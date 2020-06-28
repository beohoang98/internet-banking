import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@src/models/User";
import { DebtRemindService } from "./debtremind.service";
import { DebtRemindController } from "./debtremind.controller";
import { MailerModule } from "@nestjs-modules/mailer";
import mailConfig from "@src/config/mail.config";
import { DebtRemind } from "@src/models/DebtRemind";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, DebtRemind]),
        MailerModule.forRootAsync({
            useFactory: mailConfig,
        }),
    ],
    providers: [DebtRemindService],
    exports: [TypeOrmModule, DebtRemindService],
    controllers: [DebtRemindController],
})
export class DebtRemindModule {}

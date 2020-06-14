import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@src/models/User";
import { OtpService } from "./otp.service";
import { OtpController } from "./otp.controller";
import { OTP } from "@src/models/Otp";
import { MailerModule } from "@nestjs-modules/mailer";
import mailConfig from "@src/config/mail.config";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, OTP]),
        MailerModule.forRootAsync({
            useFactory: mailConfig,
        }),
    ],
    providers: [OtpService],
    exports: [TypeOrmModule, OtpService],
    controllers: [OtpController],
})
export class OtpModule {}

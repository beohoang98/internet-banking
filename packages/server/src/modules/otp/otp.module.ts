import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@src/models/User";
import { OtpService } from "./otp.service";
import { OtpController } from "./otp.controller";
import { OTP } from "@src/models/Otp";

@Module({
    imports: [TypeOrmModule.forFeature([User, OTP])],
    providers: [OtpService],
    exports: [TypeOrmModule, OtpService],
    controllers: [OtpController],
})
export class OtpModule {}

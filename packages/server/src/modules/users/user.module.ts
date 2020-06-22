import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@src/models/User";
import { UserController } from "./user.controller";
import { UserService } from "@src/modules/users/user.service";
import { OtpModule } from "../otp/otp.module";

@Module({
    imports: [TypeOrmModule.forFeature([User]), OtpModule],
    providers: [UserService],
    exports: [TypeOrmModule, UserService],
    controllers: [UserController],
})
export class UserModule {}

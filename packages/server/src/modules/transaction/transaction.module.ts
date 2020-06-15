import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@src/models/User";
import { TransactionService } from "./transaction.service";
import { TransactionController } from "./transaction.controller";
import { OTP } from "@src/models/Otp";
import { Transaction } from "@src/models/Transaction";
import { OtpModule } from "../otp/otp.module";

@Module({
    imports: [TypeOrmModule.forFeature([User, OTP, Transaction]), OtpModule],
    providers: [TransactionService],
    exports: [TypeOrmModule, TransactionService],
    controllers: [TransactionController],
})
export class TransactionModule {}

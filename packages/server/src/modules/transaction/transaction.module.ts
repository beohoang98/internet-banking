import { Module, HttpModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@src/models/User";
import { TransactionService } from "./transaction.service";
import { TransactionController } from "./transaction.controller";
import { OTP } from "@src/models/Otp";
import { Transaction } from "@src/models/Transaction";
import { OtpModule } from "../otp/otp.module";
import { ConnectPartnerModule } from "../connect/connect-partner.module";
import { ConnectRSAService } from "../connect/connect-rsa.service";
import { ConnectPgpService } from "../connect/connect-pgp.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CryptoModule } from "../crypto/crypto.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, OTP, Transaction]),
        OtpModule,
        ConnectPartnerModule,
    ],
    providers: [TransactionService],
    exports: [TypeOrmModule, TransactionService],
    controllers: [TransactionController],
})
export class TransactionModule {}

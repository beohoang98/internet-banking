import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@src/models/User";
//import { SavingAccountService } from "./savingAccount.service";
import { SavingAccountService } from "./saveaccount.service";
import { SavingAccountController } from "./savingAccount.controller";
import { SavingAccount } from "@src/models/SavingAccount";

@Module({
    imports: [TypeOrmModule.forFeature([User, SavingAccount])],
    providers: [SavingAccountService],
    exports: [TypeOrmModule, SavingAccountService],
    controllers: [SavingAccountController],
})
export class SavingAccountModule {}

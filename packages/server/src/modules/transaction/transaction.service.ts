import {
    ForbiddenException,
    Injectable,
    NotAcceptableException,
} from "@nestjs/common";
import { User } from "@src/models/User";

import { getRepository } from "typeorm";
import { OTP } from "@src/models/Otp";
import { OtpService } from "@src/modules/otp/otp.service";
import { BankTypeEnum } from "@src/models/ReceiverList";
import { Transaction } from "@src/models/Transaction";

@Injectable()
export class TransactionService {
    constructor(private readonly otpService: OtpService) {}
    async createTransaction(
        id: number,
        destinationAccount: string,
        amount: number,
        note: string,
        otp: number,
    ) {
        if ((await this.otpService.validateOtp(id, otp)) === true) {
            const srcAccount = await getRepository(User).findOne({
                where: {
                    id: id,
                },
            });

            if (srcAccount.balance < amount) {
                throw new ForbiddenException("Balance is not enough");
            }

            const desAccount = await getRepository(User).findOne({
                where: {
                    accountNumber: destinationAccount,
                },
            });

            if (!desAccount) {
                throw new NotAcceptableException(
                    "Cant find destination account number",
                );
            }

            const checkOtp = await getRepository(OTP).findOne({
                where: {
                    code: otp,
                    user: srcAccount,
                },
            });
            await getRepository(OTP).update(checkOtp.id, { isUsed: true });

            await getRepository(User).update(desAccount.id, {
                balance: desAccount.balance + amount,
            });
            await getRepository(User).update(srcAccount.id, {
                balance: srcAccount.balance - amount,
            });

            const transactionData = new Transaction({
                note: note,
                desAccount: desAccount.accountNumber,
                sourceAccount: srcAccount.accountNumber,
                amount: amount,
                bankType: BankTypeEnum.LOCAL,
            });

            return await getRepository(Transaction).save(transactionData);
        } else {
            throw new ForbiddenException("Otp isvalid");
        }
    }
}

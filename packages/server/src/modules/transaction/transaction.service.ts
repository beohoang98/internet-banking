import {
    ForbiddenException,
    Injectable,
    NotAcceptableException,
} from "@nestjs/common";
import { User } from "@src/models/User";

import { Between, getRepository, Not } from "typeorm";
import { OTP } from "@src/models/Otp";
import { OtpService } from "@src/modules/otp/otp.service";
import { BankTypeEnum } from "@src/models/ReceiverList";
import { Transaction } from "@src/models/Transaction";
import { GetMyTransactionDto } from "@src/dto/transaction.dto";
import { ConnectPgpService } from "../connect/connect-pgp.service";
import { ConnectRSAService } from "../connect/connect-rsa.service";
import * as moment from "moment";

const CHARGE = 1100;

@Injectable()
export class TransactionService {
    constructor(
        private readonly otpService: OtpService,
        private readonly pgpService: ConnectPgpService,
        private readonly rsaService: ConnectRSAService,
    ) {}
    async createTransaction(
        id: number,
        destinationAccount: string,
        amount: number,
        note: string,
        otp: number,
        isDebtPay: boolean,
        isCharge: boolean,
        bankType: BankTypeEnum = BankTypeEnum.LOCAL,
    ) {
        if ((await this.otpService.validateOtp(id, otp)) === true) {
            const srcAccount = await getRepository(User).findOne({
                where: {
                    id: id,
                },
            });

            let remitterAmount = amount;
            let receiverAmount = amount;

            if (isCharge === true) {
                remitterAmount += CHARGE;
            } else {
                receiverAmount -= CHARGE;
            }
            console.log(receiverAmount, remitterAmount);
            if (srcAccount.balance < remitterAmount) {
                throw new ForbiddenException("Balance is not enough");
            }

            if (receiverAmount < 0) {
                throw new ForbiddenException("Amount must be bigger than 1100");
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
                balance: desAccount.balance + receiverAmount,
            });
            await getRepository(User).update(srcAccount.id, {
                balance: srcAccount.balance - remitterAmount,
            });

            const transactionData = new Transaction({
                note: note,
                desAccount: desAccount.accountNumber,
                sourceAccount: srcAccount.accountNumber,
                amount: amount,
                bankType: bankType,
                isDebtPay: isDebtPay,
                isRemitterCharge: isCharge,
            });

            return await getRepository(Transaction).save(transactionData);
        } else {
            throw new ForbiddenException("Otp is invalid");
        }
    }

    async getMySendTransaction(id: number) {
        const user = await getRepository(User).findOne(id);
        const getList = await getRepository(Transaction).find({
            where: {
                sourceAccount: user.accountNumber,
                isDebtPay: false,
            },
            order: {
                createdAt: "DESC",
            },
        });
        console.log(user);
        console.log(getList);

        const resultArr = [];
        getList.forEach((item) => {
            const transaction = new GetMyTransactionDto({
                id: item.id,
                createAt: item.createdAt,
                note: item.note,
                account: item.desAccount,
                bankType: item.bankType,
                amount: item.amount,
                isCharge: item.isRemitterCharge,
            });

            resultArr.push(transaction);
        });

        return resultArr;
    }

    async getMyReceiveTransaction(id: number) {
        const user = await getRepository(User).findOne(id);
        const getList = await getRepository(Transaction).find({
            where: {
                desAccount: user.accountNumber,
                isDebtPay: false,
            },
            order: {
                createdAt: "DESC",
            },
        });

        const resultArr = [];
        getList.forEach((item) => {
            const transaction = new GetMyTransactionDto({
                id: item.id,
                createAt: item.createdAt,
                note: item.note,
                account: item.sourceAccount,
                bankType: item.bankType,
                amount: item.amount,
                isCharge: item.isRemitterCharge,
            });

            resultArr.push(transaction);
        });

        return resultArr;
    }

    async getMyDebtPayTransaction(id: number) {
        const user = await getRepository(User).findOne(id);
        const getList = await getRepository(Transaction).find({
            where: {
                sourceAccount: user.accountNumber,
                isDebtPay: true,
            },
            order: {
                createdAt: "DESC",
            },
        });

        const resultArr = [];
        getList.forEach((item) => {
            const transaction = new GetMyTransactionDto({
                id: item.id,
                createAt: item.createdAt,
                note: item.note,
                account: item.desAccount,
                bankType: item.bankType,
                amount: item.amount,
                isCharge: item.isRemitterCharge,
            });

            resultArr.push(transaction);
        });

        return resultArr;
    }

    async sendMoneyInterBank(
        userId: number,
        accountNumber: number | string,
        amount: number,
        note: string,
        bankType: BankTypeEnum,
        otp: number,
        isCharge: boolean,
    ) {
        if ((await this.otpService.validateOtp(userId, otp)) === true) {
            const user = await getRepository(User).findOne(userId);
            let remitterAmount = amount;
            let receiverAmount = amount;

            if (isCharge === true) {
                remitterAmount += CHARGE;
            } else {
                receiverAmount -= CHARGE;
            }
            if (receiverAmount < 0) {
                throw new ForbiddenException("Amount must be bigger than 1100");
            }
            if (user.balance - amount < 0) {
                throw new ForbiddenException("Balance is not enough");
            }

            if (bankType === BankTypeEnum.PGP) {
                await this.pgpService.sendMoney(accountNumber, receiverAmount);
            }
            if (bankType === BankTypeEnum.RSA) {
                await this.rsaService.sendMoney(accountNumber, receiverAmount);
            }

            await getRepository(User).update(user.id, {
                balance: user.balance - remitterAmount,
            });

            const transaction = new Transaction({
                sourceAccount: user.accountNumber,
                desAccount: accountNumber.toString(),
                note: note,
                amount: amount,
                bankType: bankType,
                isDebtPay: false,
                isMyBankSend: true,
                isRemitterCharge: isCharge,
            });

            return await getRepository(Transaction).save(transaction);
        } else {
            throw new ForbiddenException("Otp is invalid");
        }
    }

    async getInfoInterbank(accountNumber: string, bankType: BankTypeEnum) {
        if (bankType === BankTypeEnum.PGP) {
            return await this.pgpService.checkAccount(accountNumber);
        }
        if (bankType === BankTypeEnum.RSA) {
            return await this.rsaService.checkAccount(accountNumber);
        }
    }

    statisticalMoney(list: Array<Transaction>) {
        let send = 0;
        let receive = 0;
        list.forEach((element) => {
            if (element.isMyBankSend === true) {
                send += element.amount;
            } else receive += element.amount;
        });

        return { send, receive };
    }

    async getBankTranaction(
        fromDate: Date,
        toDate: Date,
        bankType: BankTypeEnum,
    ) {
        if (!bankType) {
            const data = await getRepository(Transaction).find({
                where: {
                    createdAt: Between(
                        moment(fromDate).toDate(),
                        moment(toDate).toDate(),
                    ),
                    bankType: Not(BankTypeEnum.LOCAL),
                },
            });

            return { data, statistal: this.statisticalMoney(data) };
        } else {
            const data = await getRepository(Transaction).find({
                where: {
                    createdAt: Between(
                        moment(fromDate).toDate(),
                        moment(toDate).toDate(),
                    ),
                    bankType: bankType,
                },
            });
            return { data, statistal: this.statisticalMoney(data) };
        }
    }
}

import { BadRequestException, Injectable } from "@nestjs/common";
import { randomBytes } from "crypto";
import { FindOneOptions, getConnection, Repository } from "typeorm";
import { Client } from "@src/models/Client";
import { PasswordEncoder } from "@src/utils/passwordEncoder";
import { Command, Console } from "nestjs-console";
import { Command as CommandClass } from "commander";
import { InjectRepository } from "@nestjs/typeorm";
import { BankTypeEnum } from "@src/models/ReceiverList";
import { Transaction } from "@src/models/Transaction";
import { UserService } from "@src/modules/users/user.service";
import { ClientTransactionLog } from "@src/models/ClientTransactionLog";

@Injectable()
@Console()
export class ClientService {
    constructor(
        @InjectRepository(Client)
        private readonly clientRepository: Repository<Client>,

        private readonly userService: UserService,
    ) {}
    /**
     * create new client
     * @param id
     * @param secret input or auto generate
     * @param publicKey optional: admin can add later
     */
    create(id: string, secret?: string, publicKey?: string) {
        const client = new Client({ id, publicKey });

        console.debug(id, secret);
        secret = secret || randomBytes(10).toString("base64");
        client.secret = PasswordEncoder.encode(secret);

        return this.clientRepository.save(client);
    }

    @Command({
        command: "client:create <id>",
        options: [
            {
                flags: "-s, --secret <secret>",
                defaultValue: undefined,
            },
        ],
    })
    async createCommand(id: string, command: CommandClass) {
        const secret = command.opts().secret;
        const client = await this.create(id, secret);
        console.log(client);
    }

    findOne(args: FindOneOptions<Client>) {
        return this.clientRepository.findOne(args);
    }

    async checkProfile(accountNumber: string) {
        const user = await this.userService.findByAccountNumber(accountNumber);
        if (!user) {
            throw new BadRequestException("User not found");
        }
        return user;
    }

    async createTransaction(
        client: Client,
        accountNumber: string,
        sourceAccount: string,
        note = "",
        amount: number,
    ) {
        const user = await this.userService.findByAccountNumber(accountNumber);
        if (!user) {
            throw new BadRequestException(
                "Account not exists: " + accountNumber,
            );
        }

        const runner = getConnection().createQueryRunner();
        await runner.startTransaction();
        try {
            const transactionObject = new Transaction({
                sourceAccount: sourceAccount,
                desAccount: accountNumber,
                note: note,
                amount: amount,
                isMyBankSend: false,
                isDebtPay: false,
                isRemitterCharge: false,
            });

            if (client.type.toString() === BankTypeEnum.RSA)
                transactionObject.bankType = BankTypeEnum.RSA;
            if (client.type.toString() === BankTypeEnum.PGP)
                transactionObject.bankType = BankTypeEnum.PGP;
            const transaction = await runner.manager.save(transactionObject);

            const transactionLog = new ClientTransactionLog({
                transaction,
                client,
            });
            await runner.manager.save(transactionLog);
            await runner.commitTransaction();

            return transaction;
        } catch (e) {
            await runner.rollbackTransaction();
            throw e;
        } finally {
            await runner.release();
        }
    }
}

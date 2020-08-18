import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    UnprocessableEntityException,
} from "@nestjs/common";
import { CreateAdminDto, PartnerTransactionQuery } from "@src/dto/admin.dto";
import { Admin, AdminRole } from "@src/models/Admin";
import { PasswordEncoder } from "@src/utils/passwordEncoder";
import { validateOrReject } from "class-validator";
import { Command as _Command } from "commander";
import * as crypto from "crypto";
import { Command, Console } from "nestjs-console";
import {
    getConnectionManager,
    getRepository,
    Like,
    Repository,
    Between,
} from "typeorm";
import { User } from "@src/models/User";
import { Transaction } from "@src/models/Transaction";
import { BankTypeEnum } from "@src/models/ReceiverList";
import { InjectRepository } from "@nestjs/typeorm";
import { DepositLog } from "@src/models/DepositLog";
import { IPaginationOptions, paginate } from "nestjs-typeorm-paginate/index";
import { Client } from "@src/models";
import { UpdateClientDto } from "@src/dto/client.dto";
import { ClientTransactionLog } from "@src/models/ClientTransactionLog";

@Injectable()
@Console()
export class AdminService {
    constructor(
        @InjectRepository(Admin)
        private readonly adminRepo: Repository<Admin>,

        @InjectRepository(Client)
        private readonly partnerRepo: Repository<Client>,

        @InjectRepository(ClientTransactionLog)
        private readonly partnerTransactionRepo: Repository<
            ClientTransactionLog
        >,
    ) {}

    async findById(id: number) {
        return await getRepository(Admin).findOne({ id });
    }
    async findByEmail(email: string) {
        return await getRepository(Admin).findOne({ email });
    }

    async createEmployee(
        name: string,
        email: string,
        password: string,
        role: AdminRole = AdminRole.EMPLOYEE,
    ) {
        const check = await getRepository(Admin).findOne({ email });
        if (check) {
            throw new ConflictException(`${email} exists`);
        }

        const admin = new Admin({
            email,
            password: PasswordEncoder.encode(password),
            name,
            role,
        });
        return await getRepository(Admin).save(admin);
    }

    @Command({
        command: "admin:create",
        options: [
            {
                flags: "-n, --name <name>",
            },
            {
                flags: "-e, --email <email>",
            },
            {
                flags: "-r, --role <role>",
                description: Object.keys(AdminRole).join(", "),
                defaultValue: AdminRole.ADMIN,
            },
            {
                flags: "-p, --password <password>",
                description: "if empty, fill by random string",
            },
        ],
    })
    async createCommand(command: _Command) {
        console.log(command.opts());
        const { name, email, role, password } = command.opts();
        const admin = new CreateAdminDto();
        admin.name = name;
        admin.email = email;
        admin.role = role;

        const checkPass = password || crypto.randomBytes(10).toString("utf8");
        admin.password = PasswordEncoder.encode(checkPass);

        await validateOrReject(admin);
        await getRepository(Admin).insert(admin);
        console.log(admin);
    }

    async depositUserAccout(
        accountNumber: string,
        amount: number,
        password: string,
        employeeId: number,
    ) {
        const employee = await getRepository(Admin).findOne({ id: employeeId });
        if (!employee)
            throw new InternalServerErrorException("Something went wrong");

        if (!PasswordEncoder.compare(password, employee.password)) {
            throw new UnprocessableEntityException("Wrong password");
        }

        const user = await getRepository(User).findOne({
            where: {
                accountNumber: accountNumber,
            },
        });

        if (!user) {
            throw new UnprocessableEntityException("Cant find user account");
        }

        const runner = getConnectionManager().get().createQueryRunner();
        await runner.startTransaction();
        try {
            const transaction = new Transaction({
                note: "Deposit",
                sourceAccount: "Group 28 Local Bank",
                desAccount: user.accountNumber,
                amount: amount,
                bankType: BankTypeEnum.LOCAL,
                isDebtPay: false,
                isRemitterCharge: false,
            });

            await runner.manager.increment(
                User,
                {
                    id: user.id,
                },
                "balance",
                +amount,
            );

            await runner.manager.insert(Transaction, transaction);
            const depositLog = new DepositLog({
                transaction,
                by: employee,
            });
            await runner.manager.insert(DepositLog, depositLog);
            await runner.commitTransaction();

            return transaction;
        } catch (e) {
            await runner.rollbackTransaction();
            throw e;
        } finally {
            await runner.release();
        }
    }

    async getListEmployee() {
        return await getRepository(Admin).find({
            where: {
                role: AdminRole.EMPLOYEE,
            },
        });
    }

    async paginateEmployee(name = "", options: IPaginationOptions) {
        const { page = 1, limit = 20 } = options;
        return await paginate(
            this.adminRepo,
            {
                page: +page,
                limit: +limit,
                route: "/api/admin/employee",
            },
            {
                where: {
                    role: AdminRole.EMPLOYEE,
                    name: Like(`${name}%`),
                },
            },
        );
    }

    async updateEmployee(id: number, name: string, email: string) {
        return await getRepository(Admin).update(id, {
            name,
            email,
        });
    }

    async deleteEmployee(id: number) {
        return await getRepository(Admin).softDelete(id);
    }

    getPartners() {
        return this.partnerRepo.find();
    }

    getPartner(id: string) {
        return this.partnerRepo.findOne({
            where: {
                id,
            },
        });
    }

    updatePartner(id: string, dto: UpdateClientDto) {
        return this.partnerRepo.update(
            { id },
            {
                secret: dto.secret
                    ? PasswordEncoder.encode(dto.secret)
                    : undefined,
                publicKey: dto.publicKey
                    ? Buffer.from(dto.publicKey, "utf-8").toString("base64")
                    : undefined,
                type: dto.type,
            },
        );
    }

    getPartnerTransactions(id: string, options: PartnerTransactionQuery) {
        return paginate(
            this.partnerTransactionRepo,
            {
                page: +options.page,
                limit: +options.limit,
                route: `/api/admin/partner/${id}/transactions`,
            },
            {
                where: {
                    client: {
                        id,
                    },
                    createdAt: Between(options.from, options.to),
                },
                relations: ["transaction"],
            },
        );
    }

    async getPartnerTransactionSum(id: string) {
        return await this.partnerTransactionRepo
            .createQueryBuilder("log")
            .where("log.client_id = :id", { id })
            .leftJoin(Transaction, "trans", "trans.id = log.transaction_id")
            .select("COUNT(log.client_id) as trans_count")
            .addSelect("SUM(trans.amount) as trans_sum")
            .groupBy("log.client_id")
            .getRawOne();
    }
}

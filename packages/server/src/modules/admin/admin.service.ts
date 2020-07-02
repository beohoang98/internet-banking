import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    UnprocessableEntityException,
} from "@nestjs/common";
import { CreateAdminDto } from "@src/dto/admin.dto";
import { Admin, AdminRole } from "@src/models/Admin";
import { PasswordEncoder } from "@src/utils/passwordEncoder";
import { validateOrReject } from "class-validator";
import { Command as _Command } from "commander";
import * as crypto from "crypto";
import { Command, Console } from "nestjs-console";
import { getConnectionManager, getRepository, Like, Repository } from "typeorm";
import { User } from "@src/models/User";
import { Transaction } from "@src/models/Transaction";
import { BankTypeEnum } from "@src/models/ReceiverList";
import { InjectRepository } from "@nestjs/typeorm";
import { DepositLog } from "@src/models/DepositLog";
import { IPaginationOptions, paginate } from "nestjs-typeorm-paginate/index";

@Injectable()
@Console()
export class AdminService {
    constructor(
        @InjectRepository(Admin)
        private readonly adminRepo: Repository<Admin>,
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
                page,
                limit,
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
}

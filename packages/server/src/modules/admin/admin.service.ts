import {
    ConflictException,
    ForbiddenException,
    Injectable,
} from "@nestjs/common";
import { CreateAdminDto } from "@src/dto/admin.dto";
import { Admin, AdminRole } from "@src/models/Admin";
import { PasswordEncoder } from "@src/utils/passwordEncoder";
import { validateOrReject } from "class-validator";
import { Command as _Command } from "commander";
import * as crypto from "crypto";
import { Command, Console } from "nestjs-console";
import { getRepository } from "typeorm";
import { User } from "@src/models/User";
import { Transaction } from "@src/models/Transaction";
import { BankTypeEnum } from "@src/models/ReceiverList";

@Injectable()
@Console()
export class AdminService {
    async findById(id: number) {
        return await getRepository(Admin).findOne(id);
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

    async depositUserAccout(accountNumber: string, amount: number) {
        const user = await getRepository(User).findOne({
            where: {
                accountNumber: accountNumber,
            },
        });

        if (!user) {
            throw new ForbiddenException("Cant find user account");
        }

        const transaction = new Transaction({
            note: "Deposit",
            sourceAccount: "Group 28 Local Bank",
            desAccount: user.accountNumber,
            amount: amount,
            bankType: BankTypeEnum.LOCAL,
            isDebtPay: false,
        });

        await getRepository(User).update(user.id, {
            balance: +user.balance + amount,
        });

        return await getRepository(Transaction).save(transaction);
    }

    async getListEmployee() {
        return await getRepository(Admin).find({
            where: {
                role: AdminRole.EMPLOYEE,
            },
        });
    }

    async updateEmployee(
        id: number,
        name: string,
        email: string,
        password: string,
    ) {
        return await getRepository(Admin).update(id, {
            name: name,
            email: email,
            password: PasswordEncoder.encode(password),
        });
    }

    async deleteEmployee(id: number) {
        return await getRepository(Admin).delete(id);
    }
}

import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "@src/dto/user.dto";
import { User } from "@src/models/User";
import { PasswordEncoder } from "@src/utils/passwordEncoder";
import { validateOrReject } from "class-validator";
import { Command as _Command } from "commander";
import * as crypto from "crypto";
import { Command, Console } from "nestjs-console";
import { getRepository } from "typeorm";

@Injectable()
@Console()
export class UserService {
    async findById(id: number) {
        return await getRepository(User).findOne(id);
    }
    async findByEmail(email: string) {
        return await getRepository(User).findOne({ email });
    }

    async createAccountNumber() {
        return 10000000 + (await getRepository(User).count());
    }
    async create(name: string, email: string, password: string, phone: string) {
        const user = new User({
            email,
            password: PasswordEncoder.encode(password),
            name,
            phone,
            accountNumber: (await this.createAccountNumber()).toString(),
        });
        await getRepository(User).insert(user);
        return user;
    }

    @Command({
        command: "user:create",
        options: [
            {
                flags: "-n, --name <name>",
            },
            {
                flags: "-e, --email <email>",
            },
            {
                flags: "-p, --password <password>",
                description: "if empty, fill by random string",
            },
        ],
    })
    async createCommand(command: _Command) {
        console.log(command.opts());
        const { name, email, password } = command.opts();
        const user = new CreateUserDto();
        user.name = name;
        user.email = email;

        const checkPass = password || crypto.randomBytes(10).toString("utf8");
        user.password = PasswordEncoder.encode(checkPass);

        await validateOrReject(user);
        await getRepository(User).insert(user);
        console.log(user);
    }

    async getProfile(id: number) {
        return await getRepository(User).findOne({
            where: {
                id: id,
            },
        });
    }
}

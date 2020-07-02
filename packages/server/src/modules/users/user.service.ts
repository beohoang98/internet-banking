import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { CreateUserDto, UserUpdateDto } from "@src/dto/user.dto";
import { User } from "@src/models/User";
import { PasswordEncoder } from "@src/utils/passwordEncoder";
import { validateOrReject } from "class-validator";
import { Command as _Command } from "commander";
import * as crypto from "crypto";
import { Command, Console } from "nestjs-console";
import { getRepository, Like, Repository } from "typeorm";

import { OtpService } from "../otp/otp.service";
import { OTP } from "@src/models/Otp";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
@Console()
export class UserService {
    constructor(
        private readonly otpService: OtpService,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) {}
    async findById(id: number) {
        return await this.userRepo.findOne({ id });
    }
    async findByEmail(email: string) {
        return await this.userRepo.findOne({ where: { email } });
    }
    async findByAccountNumber(accountNumber: string) {
        return await this.userRepo.findOne({ where: { accountNumber } });
    }
    search(search: string) {
        return this.userRepo.find({
            where: [
                { accountNumber: Like(`${search}%`) },
                { phone: Like(`%${search}%`) },
            ],
            take: 10,
        });
    }

    async createAccountNumber() {
        return 10000000 + (await this.userRepo.count());
    }
    async create(name: string, email: string, password: string, phone: string) {
        const user = new User({
            email,
            password: PasswordEncoder.encode(password),
            name,
            phone,
            accountNumber: (await this.createAccountNumber()).toString(),
        });
        await this.userRepo.insert(user);
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
            {
                flags: "--phone <phone>",
            },
        ],
    })
    async createCommand(command: _Command) {
        try {
            console.log(command.opts());
            const { name, email, password, phone } = command.opts();
            const user = new CreateUserDto();
            user.name = name;
            user.email = email;
            user.phone = phone;

            const checkPass =
                password || crypto.randomBytes(10).toString("utf8");
            user.password = PasswordEncoder.encode(checkPass);

            await validateOrReject(user);
            await this.userRepo.insert(user);
            console.log(user);
        } catch (e) {
            console.error(e);
        }
    }

    async getProfile(id: number) {
        return await this.userRepo.findOne({
            where: {
                id: id,
            },
        });
    }

    async getProfileWithAccountNumber(accountNumber: string) {
        const user = await this.userRepo.findOne({
            where: {
                accountNumber: accountNumber,
            },
        });
        if (!user) {
            throw new NotFoundException(`${accountNumber} not found`);
        }
        return user;
    }

    async changePassword(id: number, oldPassword: string, newPassword: string) {
        const user = await this.userRepo.findOne(id);
        if (!user || !PasswordEncoder.compare(oldPassword, user.password)) {
            throw new ForbiddenException("Wrong password");
        }

        return await this.userRepo.update(user.id, {
            password: PasswordEncoder.encode(newPassword),
        });
    }

    async resetPassword(userId: number, otp: number, newPassword: string) {
        if ((await this.otpService.validateOtp(userId, otp)) === true) {
            const user = await this.userRepo.findOne(userId);
            if (!user) {
                throw new ForbiddenException("Cant find user");
            } else {
                await getRepository(OTP).update(
                    { user: user, code: otp },
                    { isUsed: true },
                );

                return await this.userRepo.update(user.id, {
                    password: PasswordEncoder.encode(newPassword),
                });
            }
        } else {
            throw new ForbiddenException("Otp is invalid");
        }
    }

    async updateProfile(id: number, dto: UserUpdateDto) {
        return await this.userRepo.update(id, {
            name: dto.name,
            email: dto.email,
            phone: dto.phone,
        });
    }
}

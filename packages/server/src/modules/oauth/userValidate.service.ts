import { Injectable } from "@nestjs/common";
import {
    InvalidUserException,
    UserInterface,
    UserValidatorInterface,
} from "@switchit/nestjs-oauth2-server";
import { Repository } from "typeorm";
import { User } from "@src/models/User";
import { InjectRepository } from "@nestjs/typeorm";
import { PasswordEncoder } from "@src/utils/passwordEncoder";

@Injectable()
export class UserValidateService implements UserValidatorInterface {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) {}

    async validate(username: string, password: string): Promise<UserInterface> {
        const user = await this.userRepo.findOne({
            where: { username },
        });
        if (!user) {
            throw InvalidUserException.withUsernameAndPassword(
                username,
                password,
            );
        }
        if (!PasswordEncoder.compare(password, user.password)) {
            throw InvalidUserException.withUsernameAndPassword(
                username,
                password,
            );
        }
        return {
            id: user.id + "",
            email: user.email,
            username: user.email,
        };
    }
}

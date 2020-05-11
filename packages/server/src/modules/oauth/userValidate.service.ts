import { Injectable } from "@nestjs/common";
import {
    InvalidUserException,
    UserInterface,
    UserValidatorInterface,
} from "@0auth2Server";
import { Repository } from "typeorm";
import { User } from "../../models/User";
import { InjectRepository } from "@nestjs/typeorm";
import { PasswordEncoder } from "../../utils/passwordEncoder";

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

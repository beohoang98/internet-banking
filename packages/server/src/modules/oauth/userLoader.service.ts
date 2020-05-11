import {
    InvalidUserException,
    UserInterface,
    UserLoaderInterface,
} from "@switchit/nestjs-oauth2-server";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "../../models/User";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UserLoaderService implements UserLoaderInterface {
    @InjectRepository(User)
    private readonly userRepository: Repository<User>;

    async load(userId: string): Promise<UserInterface> {
        const user = await this.userRepository.findOne(+userId);
        if (!user) {
            throw InvalidUserException.withId(userId);
        }
        return {
            id: userId,
            username: user.email,
            email: user.email,
        };
    }
}

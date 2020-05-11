import {
    InvalidUserException,
    UserInterface,
    UserLoaderInterface,
} from "@0auth2Server";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "../../models/User";

@Injectable()
export class UserLoaderService implements UserLoaderInterface {
    constructor(
        // @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) {}
    async load(userId: string): Promise<UserInterface> {
        const user = await this.userRepo.findOne(+userId);
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

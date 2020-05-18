import { Injectable } from "@nestjs/common";
import { User, UserRole } from "@src/models/User";
import { getRepository } from "typeorm";
import { PasswordEncoder } from "@src/utils/passwordEncoder";

@Injectable()
export class UserService {
    async create(
        name: string,
        email: string,
        password: string,
        role: UserRole,
    ) {
        const user = new User({
            email,
            password: PasswordEncoder.encode(password),
            name,
            role,
        });
        return await getRepository(User).save(user);
    }
}

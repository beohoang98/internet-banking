import { Injectable } from "@nestjs/common";
import { User, UserRole } from "@src/models/User";
import { getRepository } from "typeorm";
import { PasswordEncoder } from "@src/utils/passwordEncoder";

@Injectable()
export class UserService {
    async findById(id: number) {
        return await getRepository(User).findOne(id);
    }
    async findByEmail(email: string) {
        return await getRepository(User).findOne({ email });
    }

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

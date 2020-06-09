import {
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtConfig } from "@src/config/jwt.config";
import { AccessTokenDto } from "@src/dto/auth.dto";
import { AdminService } from "@src/modules/admin/admin.service";
import { ClientService } from "@src/modules/client/client.service";
import { RedisService } from "@src/modules/redis/redis.service";
import { UserService } from "@src/modules/users/user.service";
import { PasswordEncoder } from "@src/utils/passwordEncoder";
import { classToPlain } from "class-transformer";
import { v4 as uuid } from "uuid";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly redisService: RedisService,
        private readonly clientService: ClientService,
        private readonly adminService: AdminService,
    ) {}

    async verifyUser(usernameOrEmail: string, pass: string) {
        const user = await this.userService.findByEmail(usernameOrEmail);
        console.debug(user, usernameOrEmail, pass);
        if (!user || !PasswordEncoder.compare(pass, user.password)) {
            throw new ForbiddenException();
        }
        return classToPlain(user);
    }

    async verifyAdmin(usernameOrEmail: string, pass: string) {
        const admin = await this.adminService.findByEmail(usernameOrEmail);
        console.debug(admin, usernameOrEmail, pass);
        if (!admin || !PasswordEncoder.compare(pass, admin.password)) {
            throw new ForbiddenException();
        }
        return classToPlain(admin);
    }

    async verifyClient(id: string, secret: string) {
        const client = await this.clientService.findOne({
            where: { id },
        });
        if (!client || !PasswordEncoder.compare(secret, client.secret)) {
            return null;
        }
        return classToPlain(client);
    }

    async userLogin(userFromReq: any) {
        const payload = {
            sub: userFromReq.id,
            role: "CUSTOMER",
        };
        const refreshToken = uuid();
        const accessToken = this.jwtService.sign(payload);

        await this.redisService.instance.setex(
            `${refreshToken}_${accessToken}`,
            JwtConfig.REFRESH_EXPIRE,
            userFromReq.id,
        );

        return new AccessTokenDto({
            accessToken,
            refreshToken,
        });
    }

    async userRefresh(oldAccessToken: string, refreshToken: string) {
        const key = `${refreshToken}_${oldAccessToken}`;
        const userIdStr = await this.redisService.instance.get(key);
        if (!userIdStr) {
            throw new ForbiddenException(
                "Refresh token was expires, login again",
            );
        }
        const userId = +userIdStr;

        const user = await this.userService.findById(userId);
        if (!user) {
            throw new InternalServerErrorException(
                "Something went wrong when get userId",
            );
        }

        const payload = {
            sub: user.id,
            role: "CUSTOMER",
        };
        const newAccessToken = this.jwtService.sign(payload);
        await this.redisService.instance.rename(
            key,
            `${refreshToken}_${newAccessToken}`,
        );

        return new AccessTokenDto({
            accessToken: newAccessToken,
            refreshToken,
        });
    }

    async adminLogin(userFromReq: any) {
        const payload = {
            sub: userFromReq.id,
            role: userFromReq.role,
        };
        const refreshToken = uuid();
        const accessToken = this.jwtService.sign(payload);

        await this.redisService.instance.setex(
            `admin_${refreshToken}_${accessToken}`,
            JwtConfig.REFRESH_EXPIRE,
            userFromReq.id,
        );

        return new AccessTokenDto({
            accessToken,
            refreshToken,
        });
    }

    async adminRefresh(oldAccessToken: string, refreshToken: string) {
        const key = `admin_${refreshToken}_${oldAccessToken}`;
        const adminIdStr = await this.redisService.instance.get(key);
        if (!adminIdStr) {
            throw new ForbiddenException(
                "Refresh token was expires, login again",
            );
        }
        const userId = +adminIdStr;

        const admin = await this.adminService.findById(userId);
        if (!admin) {
            throw new InternalServerErrorException(
                "Something went wrong when get adminId",
            );
        }

        const payload = {
            sub: admin.id,
            role: admin.role,
        };
        const newAccessToken = this.jwtService.sign(payload);
        await this.redisService.instance.rename(
            key,
            `admin_${refreshToken}_${newAccessToken}`,
        );

        return new AccessTokenDto({
            accessToken: newAccessToken,
            refreshToken,
        });
    }
}

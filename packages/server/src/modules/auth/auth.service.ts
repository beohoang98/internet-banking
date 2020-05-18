import {
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { UserService } from "@src/modules/users/user.service";
import { PasswordEncoder } from "@src/utils/passwordEncoder";
import { classToPlain } from "class-transformer";
import { JwtService } from "@nestjs/jwt";
import { AccessTokenDto } from "@src/dto/auth.dto";
import { v4 as uuid } from "uuid";
import { RedisService } from "@src/modules/redis/redis.service";
import { JwtConfig } from "@src/config/jwt.config";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly redisService: RedisService,
    ) {}

    async verifyUser(usernameOrEmail: string, pass: string) {
        const user = await this.userService.findByEmail(usernameOrEmail);
        if (!user || !PasswordEncoder.compare(pass, user.password)) {
            return null;
        }
        return classToPlain(user);
    }
    async verifyClient(id: string, secret: string) {
        return null; // TODO: continue implement
    }

    async userLogin(userFromReq: any) {
        const payload = {
            sub: userFromReq.userId,
            role: userFromReq.role,
        };
        const refreshToken = uuid();
        const accessToken = this.jwtService.sign(payload);

        await this.redisService.instance.setex(
            `${refreshToken}_${accessToken}`,
            JwtConfig.REFRESH_EXPIRE,
            userFromReq.userId,
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
            role: user.role,
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
}

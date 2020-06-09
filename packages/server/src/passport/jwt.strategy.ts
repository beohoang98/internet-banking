import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";
import { JwtConfig } from "@src/config/jwt.config";
import { Injectable } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: JwtConfig.PRIVATE,
        } as StrategyOptions);
    }

    validate(payload: any) {
        return {
            id: payload.sub,
            role: payload.role,
        };
    }
}

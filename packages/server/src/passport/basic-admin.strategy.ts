import { PassportStrategy } from "@nestjs/passport";
import { BasicStrategy as Strategy } from "passport-http";
import { Injectable } from "@nestjs/common";
import { AuthService } from "@src/modules/auth/auth.service";

@Injectable()
export class AdminBasicStrategy extends PassportStrategy(
    Strategy,
    "basic-admin",
) {
    constructor(private readonly authService: AuthService) {
        super({});
    }

    validate(username: string, password: string) {
        return this.authService.verifyAdmin(username, password);
    }
}

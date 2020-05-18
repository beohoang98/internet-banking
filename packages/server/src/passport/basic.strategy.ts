import { PassportStrategy } from "@nestjs/passport";
import { BasicStrategy as Strategy } from "passport-http";
import { Injectable } from "@nestjs/common";
import { AuthService } from "@src/modules/auth/auth.service";

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy, "basic") {
    constructor(private readonly authService: AuthService) {
        super({});
    }

    validate(username: string, password: string) {
        return this.authService.verifyUser(username, password);
    }
}

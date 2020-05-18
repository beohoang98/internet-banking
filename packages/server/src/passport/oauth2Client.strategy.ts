import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-oauth2-client-password";
import { AuthService } from "@src/modules/auth/auth.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class Oauth2ClientStrategy extends PassportStrategy(Strategy, "client") {
    constructor(private readonly authService: AuthService) {
        super({});
    }

    validate(clientId: string, clientSecret: string) {
        return this.authService.verifyClient(clientId, clientSecret);
    }
}

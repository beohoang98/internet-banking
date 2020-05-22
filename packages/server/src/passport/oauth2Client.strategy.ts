import { AbstractStrategy, PassportStrategy } from "@nestjs/passport";
import { BasicStrategy } from "passport-http";
import { AuthService } from "@src/modules/auth/auth.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class Oauth2ClientStrategy
    extends PassportStrategy(BasicStrategy, "partner")
    implements AbstractStrategy {
    constructor(private readonly authService: AuthService) {
        super();
    }

    validate(clientId: string, clientSecret: string) {
        return this.authService.verifyClient(clientId, clientSecret);
    }
}

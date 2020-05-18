import { Module } from "@nestjs/common";
import { AuthService } from "@src/modules/auth/auth.service";
import { UserModule } from "@src/modules/users/user.module";
import { AuthController } from "@src/modules/auth/auth.controller";
import { BasicStrategy } from "@src/passport/basic.strategy";
import { JwtStrategy } from "@src/passport/jwt.strategy";
import { Oauth2ClientStrategy } from "@src/passport/oauth2Client.strategy";

@Module({
    imports: [UserModule],
    controllers: [AuthController],
    providers: [AuthService, BasicStrategy, JwtStrategy, Oauth2ClientStrategy],
    exports: [AuthService],
})
export class AuthModule {}

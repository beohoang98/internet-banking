import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtGuard extends AuthGuard("jwt") {
    handleRequest(err, user, info, context, status) {
        console.debug(user, info);
        return super.handleRequest(err, user, info, context, status);
    }
}

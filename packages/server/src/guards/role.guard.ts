import { JwtGuard } from "@src/guards/jwt.guard";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RoleGuard extends JwtGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest<Request>();
        const requestRole = request.user.role;
        const roles =
            this.reflector.get<string[]>("roles", context.getHandler()) || [];

        return roles.length > 0 && roles.includes(requestRole);
    }
}

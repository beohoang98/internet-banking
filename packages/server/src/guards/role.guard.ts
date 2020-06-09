import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest<Request>();
        const requestRole = request.user.role;
        const roles =
            this.reflector.get<string[]>("roles", context.getHandler()) || [];

        return roles.length > 0 && roles.includes(requestRole);
    }
}

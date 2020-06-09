import { SetMetadata } from "@nestjs/common";
import { UserRole } from "@src/models/User";
import { AdminRole } from "@src/models/Admin";

export const ForRoles = (...roles: Array<UserRole | AdminRole>) =>
    SetMetadata("roles", roles);

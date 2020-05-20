import { UserRole } from "@src/models/User";
import { SetMetadata } from "@nestjs/common";

export const ForRoles = (...roles: UserRole[]) => SetMetadata("roles", roles);

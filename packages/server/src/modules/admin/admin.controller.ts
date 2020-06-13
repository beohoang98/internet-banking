import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    UseGuards,
    UseInterceptors,
    ClassSerializerInterceptor,
} from "@nestjs/common";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { ForRoles } from "@src/guards/role.decorator";

import { AdminRole } from "@src/models/Admin";
import { CreateAdminDto } from "@src/dto/admin.dto";
import { AdminService } from "./admin.service";
import { RoleGuard } from "@src/guards/role.guard";
import { JwtGuard } from "@src/guards/jwt.guard";

@Controller("admin")
@ApiTags("admin")
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@UseGuards(RoleGuard, JwtGuard)
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Post("/")
    @ApiConsumes("application/json", "multipart/form-data")
    @ForRoles(AdminRole.ADMIN)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    create(@Body() body: CreateAdminDto) {
        return this.adminService.createEmployee(
            body.name,
            body.email,
            body.password,
            body.role,
        );
    }
}

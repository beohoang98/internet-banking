import {
    Body,
    Controller,
    Post,
    UseGuards,
    UseInterceptors,
    ClassSerializerInterceptor,
} from "@nestjs/common";
import { CreateAdminDto } from "@src/dto/admin.dto";
import { JwtGuard } from "@src/guards/jwt.guard";
import { ForRoles } from "@src/guards/role.decorator";
import { RoleGuard } from "@src/guards/role.guard";
import { AdminRole } from "@src/models/Admin";
import { AdminService } from "./admin.service";
import { ApiTags, ApiConsumes, ApiBearerAuth } from "@nestjs/swagger";

@Controller("admin")
@ApiTags("admin")
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Post("/")
    @UseGuards(JwtGuard, RoleGuard)
    @ForRoles(AdminRole.ADMIN)
    @ApiConsumes("application/json", "application/x-www-form-urlencoded")
    async createAccount(@Body() dto: CreateAdminDto) {
        return await this.adminService.createEmployee(
            dto.name,
            dto.email,
            dto.password,
            dto.role,
        );
    }
}

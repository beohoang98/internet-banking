import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { ForRoles } from "@src/guards/role.decorator";
import { UserService } from "@src/modules/users/user.service";
import { AdminRole } from "@src/models/Admin";
import { CreateAdminDto } from "@src/dto/admin.dto";

@Controller("admin")
@ApiTags("admin")
@ApiBearerAuth()
//@UseGuards(RoleGuard)
export class AdminController {
    constructor(private readonly userService: UserService) {}

    @Post("/")
    @ApiConsumes("application/json", "multipart/form-data")
    @ForRoles(AdminRole.ADMIN, AdminRole.EMPLOYEE)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    create(@Body() body: CreateAdminDto) {
        return this.userService.create(
            body.name,
            body.email,
            body.password,
            body.role,
        );
    }
}

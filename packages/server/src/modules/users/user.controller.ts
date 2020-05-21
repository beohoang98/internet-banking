import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "@src/dto/user.dto";
import { RoleGuard } from "@src/guards/role.guard";
import { ForRoles } from "@src/guards/role.decorator";
import { UserRole } from "@src/models/User";
import { UserService } from "@src/modules/users/user.service";

@Controller("user")
@ApiTags("user")
@ApiBearerAuth()
@UseGuards(RoleGuard)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get("profile")
    @ForRoles(UserRole.CUSTOMER)
    async profile(@Req() req) {
        return req.user;
    }

    @Post("/")
    @ApiConsumes("application/json", "multipart/form-data")
    @ForRoles(UserRole.ADMIN, UserRole.EMPLOYEE)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    create(@Body() body: CreateUserDto) {
        return this.userService.create(
            body.name,
            body.email,
            body.password,
            body.role,
        );
    }
}

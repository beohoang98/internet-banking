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
import { CreateUserDto } from "@src/dto/user.dto";
import { JwtGuard } from "@src/guards/jwt.guard";
import { ForRoles } from "@src/guards/role.decorator";
import { RoleGuard } from "@src/guards/role.guard";
import { AdminRole } from "@src/models/Admin";
import { UserService } from "@src/modules/users/user.service";

@Controller("user")
@ApiTags("user")
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get("profile")
    @UseGuards(JwtGuard)
    async profile(@Req() req) {
        return req.user;
    }

    @Post("/")
    @ApiConsumes("application/json", "application/x-www-form-urlencoded")
    @UseGuards(JwtGuard, RoleGuard)
    @ForRoles(AdminRole.ADMIN, AdminRole.EMPLOYEE)
    create(@Body() body: CreateUserDto) {
        return this.userService.create(body.name, body.email, body.password);
    }
}

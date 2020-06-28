import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    Post,
    Put,
    Query,
    Req,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import {
    ChangePasswordDto,
    CreateUserDto,
    ResetPasswordDto,
} from "@src/dto/user.dto";
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
        return this.userService.getProfile(req.user.id);
    }

    @Post("/")
    @ApiConsumes("application/json", "application/x-www-form-urlencoded")
    @UseGuards(JwtGuard, RoleGuard)
    @ForRoles(AdminRole.ADMIN, AdminRole.EMPLOYEE)
    create(@Body() body: CreateUserDto) {
        return this.userService.create(
            body.name,
            body.email,
            body.password,
            body.phone,
        );
    }

    @Get("profile/accountnumber")
    @UseGuards(JwtGuard)
    async getProfileWithAccountNumber(@Query() query) {
        return this.userService.getProfileWithAccountNumber(query.number);
    }

    @Put("password")
    @UseGuards(JwtGuard)
    changePassword(@Req() req, @Body() body: ChangePasswordDto) {
        return this.userService.changePassword(
            req.user.id,
            body.oldPassword,
            body.newPassword,
        );
    }

    @Put("reset-password")
    @UseGuards(JwtGuard)
    resetPassword(@Req() req, @Body() body: ResetPasswordDto) {
        return this.userService.resetPassword(
            req.user.id,
            body.otp,
            body.password,
        );
    }
}

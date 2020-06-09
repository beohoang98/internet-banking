import {
    Body,
    Controller,
    Post,
    Req,
    UseGuards,
    UseInterceptors,
    ClassSerializerInterceptor,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBasicAuth, ApiTags } from "@nestjs/swagger";
import { AccessTokenDto } from "@src/dto/auth.dto";
import { AuthService } from "@src/modules/auth/auth.service";
import { Request } from "express";

@Controller("auth")
@ApiTags("auth")
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("login")
    @UseGuards(AuthGuard("basic"))
    @ApiBasicAuth("basic")
    userLogin(@Req() req: Request) {
        return this.authService.userLogin(req.user);
    }

    @Post("refresh")
    userRefresh(@Body() dto: AccessTokenDto) {
        return this.authService.userRefresh(dto.accessToken, dto.refreshToken);
    }

    @Post("admin/login")
    @UseGuards(AuthGuard("basic-admin"))
    @ApiBasicAuth("basic")
    adminLogin(@Req() req: Request) {
        return this.authService.adminLogin(req.user);
    }

    @Post("admin/refresh")
    adminRefresh(@Body() dto: AccessTokenDto) {
        return this.authService.adminRefresh(dto.accessToken, dto.refreshToken);
    }
}

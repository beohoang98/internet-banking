import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "@src/modules/auth/auth.service";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { AccessTokenDto } from "@src/dto/auth.dto";
import { ApiBasicAuth, ApiOAuth2 } from "@nestjs/swagger";

@Controller("auth")
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

    @Post("partner")
    @ApiOAuth2(["partner"])
    @UseGuards(AuthGuard("basic"), AuthGuard("client"))
    clientLogin(@Req() req: Request) {
        return req.user;
    }
}

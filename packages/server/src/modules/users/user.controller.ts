import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiOAuth2, ApiTags } from "@nestjs/swagger";

@Controller("user")
@ApiTags("user")
export class UserController {
    @Get("profile")
    @ApiOAuth2(["profile:read"])
    @UseGuards(AuthGuard("access-token"))
    async profile(@Req() req) {
        return req.user;
    }
}

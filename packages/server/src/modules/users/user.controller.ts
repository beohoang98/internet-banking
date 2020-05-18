import {
    Body,
    Controller,
    Get,
    NotImplementedException,
    Post,
    Req,
    UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiConsumes, ApiOAuth2, ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "@src/dto/user.dto";

@Controller("user")
@ApiTags("user")
export class UserController {
    @Get("profile")
    @ApiOAuth2(["profile:read"])
    @UseGuards(AuthGuard("access-token"))
    async profile(@Req() req) {
        return req.user;
    }

    @Post("")
    @ApiOAuth2(["user:create"], "password")
    @ApiConsumes("application/json", "multipart/form-data")
    @UseGuards(AuthGuard("access_token"))
    async create(@Body() body: CreateUserDto) {
        throw new NotImplementedException();
    }
}

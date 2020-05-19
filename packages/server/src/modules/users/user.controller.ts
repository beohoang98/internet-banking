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
import {
    ApiBearerAuth,
    ApiConsumes,
    ApiOAuth2,
    ApiTags,
} from "@nestjs/swagger";
import { CreateUserDto } from "@src/dto/user.dto";

@Controller("user")
@ApiTags("user")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
export class UserController {
    @Get("profile")
    @ApiOAuth2(["profile:read"])
    async profile(@Req() req) {
        return req.user;
    }

    @Post("")
    @ApiOAuth2(["user:create"], "password")
    @ApiConsumes("application/json", "multipart/form-data")
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async create(@Body() body: CreateUserDto) {
        throw new NotImplementedException();
    }
}

import { Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

@Controller("client")
@ApiTags("partner")
@UseGuards(AuthGuard("client"))
export class ClientController {
    @Get("check-account")
    checkAccountInfo() {
        return {};
    }

    @Post("send")
    makeTransaction() {
        return {};
    }
}

import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import {
    ApiBasicAuth,
    ApiForbiddenResponse,
    ApiHeader,
    ApiTags,
    ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import * as moment from "moment";
import { CheckAccountDto, SendMoneyDto } from "@src/dto/client.dto";

@Controller("client")
@ApiTags("partner")
@UseGuards(AuthGuard("client"))
@ApiBasicAuth("client")
@ApiHeader({
    name: "x-partner-time",
    description:
        "Unix timestamp (seconds) https://www.unixtimestamp.com/, expired in 60s",
    required: true,
    example: moment().unix(),
})
@ApiHeader({
    name: "x-partner-hash",
    description: "Body hashed with given secret key by MD5 Alg",
    example: "hash!secret!that!not!partner!secret",
})
@ApiForbiddenResponse({ description: "Expired request" })
@ApiForbiddenResponse({ description: "Hash invalid" })
@ApiUnauthorizedResponse({
    description: "Need Authorization",
})
export class ClientController {
    @Post("check-account")
    checkAccountInfo(@Body() body: CheckAccountDto) {
        return body;
    }

    @Post("send")
    makeTransaction(@Body() body: SendMoneyDto) {
        return body;
    }
}

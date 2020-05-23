import {
    Body,
    Controller,
    Post,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import {
    ApiAcceptedResponse,
    ApiBasicAuth,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiHeader,
    ApiNotFoundResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import * as moment from "moment";
import {
    CheckAccountDto,
    CheckAccountResponseDto,
    SendMoneyRequestDto,
} from "@src/dto/client.dto";
import { ClientRequestInterceptor } from "@src/middlewares/client-request.interceptor";

@Controller("partner")
@ApiTags("partner")
@UseGuards(AuthGuard("partner"))
@ApiBasicAuth("partner")
@ApiHeader({
    name: "x-partner-time",
    description:
        "Unix timestamp (seconds) https://www.unixtimestamp.com/, expired in 60s",
    required: true,
    example: moment().unix().toString(),
})
@ApiHeader({
    name: "x-partner-hash",
    description: "Body hashed with given secret key by MD5 Alg",
    example: "123456secret",
    required: true,
})
@ApiForbiddenResponse({
    description: "Return message: Expired request | Hash invalid",
})
@ApiUnauthorizedResponse({
    description: "Need Authorization",
})
@ApiNotFoundResponse({ description: "Account not found" })
export class ClientController {
    @Post("check-account")
    @ApiCreatedResponse({ type: CheckAccountResponseDto })
    checkAccountInfo(@Body() body: CheckAccountDto) {
        return body;
    }

    @Post("send")
    @ApiAcceptedResponse({ description: "Accepted send request" })
    @UseInterceptors(ClientRequestInterceptor)
    makeTransaction(@Body() body: SendMoneyRequestDto) {
        return body;
    }
}

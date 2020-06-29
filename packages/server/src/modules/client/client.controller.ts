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
    SendMoneyRequestV2Dto,
} from "@src/dto/client.dto";
import { ClientRequestInterceptor } from "@src/middlewares/client-request.interceptor";
import { ClientService } from "./client.service";
import { TransformClassToPlain } from "class-transformer";

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
    constructor(private readonly clientService: ClientService) {}

    @Post("check-account")
    @ApiCreatedResponse({ type: CheckAccountResponseDto })
    @TransformClassToPlain({ groups: ["partner"] })
    checkAccountInfo(@Body() body: CheckAccountDto) {
        return this.clientService.checkProfile(body.accountNumber + "");
    }

    @Post("send")
    @ApiAcceptedResponse({ description: "Accepted send request" })
    @UseInterceptors(ClientRequestInterceptor)
    makeTransaction(@Body() body: SendMoneyRequestDto) {
        return body;
    }

    @Post("send/v2")
    @ApiAcceptedResponse({ description: "Accepted send request" })
    @UseInterceptors(ClientRequestInterceptor)
    makeTransactionV2(@Body() body: SendMoneyRequestV2Dto) {
        return this.clientService.createTransaction(
            body.data.bankType,
            body.data.accountNumber.toString(),
            body.data.sourceAccount,
            body.data.note,
            body.data.amount,
        );
    }
}

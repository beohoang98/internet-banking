import {
    Body,
    Controller,
    GoneException,
    Post,
    Req,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import {
    ApiAcceptedResponse,
    ApiBadRequestResponse,
    ApiBasicAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiHeader,
    ApiNotFoundResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import * as moment from "moment";
import {
    CheckAccountDto,
    CheckAccountResponseDto,
    SendMoneyRequestV2Dto,
} from "@src/dto/client.dto";
import { ClientRequestInterceptor } from "@src/middlewares/client-request.interceptor";
import { ClientService } from "./client.service";
import { TransformClassToPlain } from "class-transformer";
import { Request } from "express";

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
@ApiBadRequestResponse()
export class ClientController {
    constructor(private readonly clientService: ClientService) {}

    @Post("check-account")
    @ApiBody({
        type: CheckAccountDto,
    })
    @ApiCreatedResponse({ type: CheckAccountResponseDto })
    @TransformClassToPlain({ groups: ["partner"] })
    checkAccountInfo(@Body() body: CheckAccountDto) {
        return this.clientService.checkProfile(body.accountNumber + "");
    }

    @Post("send")
    @ApiAcceptedResponse({ description: "Accepted send request" })
    @UseInterceptors(ClientRequestInterceptor)
    @ApiOperation({
        deprecated: true,
        description: "This API is deprecated, move to /api/partner/send/v2",
    })
    makeTransaction() {
        throw new GoneException(
            "This API is deprecated, move to /api/partner/send/v2",
        );
    }

    @Post("send/v2")
    @ApiBody({ type: SendMoneyRequestV2Dto })
    @ApiAcceptedResponse({ description: "Accepted send request" })
    @UseInterceptors(ClientRequestInterceptor)
    @TransformClassToPlain({ groups: ["partner"] })
    makeTransactionV2(
        @Body() body: SendMoneyRequestV2Dto,
        @Req() req: Request,
    ) {
        return this.clientService.createTransaction(
            req.client,
            body.data.accountNumber.toString(),
            body.data.sourceAccount,
            body.data.note,
            body.data.amount,
        );
    }
}

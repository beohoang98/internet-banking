import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    UseGuards,
    UseInterceptors,
    ClassSerializerInterceptor,
    Put,
    Delete,
    Param,
} from "@nestjs/common";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { JwtGuard } from "@src/guards/jwt.guard";
import { TransactionService } from "@src/modules/transaction/transaction.service";
import {
    CreateTransactionDto,
    CreateTransactionInterbankDto,
    GetInfoInterbankDto,
} from "@src/dto/transaction.dto";
import { BankTypeEnum } from "@src/models/ReceiverList";

@Controller("transaction")
@ApiTags("transaction")
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) {}

    @Post()
    @UseGuards(JwtGuard)
    create(@Req() req, @Body() body: CreateTransactionDto) {
        return this.transactionService.createTransaction(
            req.user.id,
            body.desAccount,
            body.amount,
            body.note,
            body.otp,
            body.isDebtPay,
            body.bankType,
        );
    }

    @Get("/send")
    @UseGuards(JwtGuard)
    getMySendTransaction(@Req() req) {
        return this.transactionService.getMySendTransaction(req.user.id);
    }

    @Get("receive")
    @UseGuards(JwtGuard)
    getMyReceiveTransaction(@Req() req) {
        return this.transactionService.getMyReceiveTransaction(req.user.id);
    }

    @Get("debt")
    @UseGuards(JwtGuard)
    getMyDebtPayTransaction(@Req() req) {
        return this.transactionService.getMyDebtPayTransaction(req.user.id);
    }

    @Post("/interbank")
    @UseGuards(JwtGuard)
    sendMoneyInterbank(
        @Req() req,
        @Body() body: CreateTransactionInterbankDto,
    ) {
        return this.transactionService.sendMoneyInterBank(
            req.user.id,
            body.accountNumber,
            body.amount,
            body.note,
            body.bankType,
            body.otp,
        );
    }

    @Get("/interbank/info")
    getInfoInterbank(@Body() body: GetInfoInterbankDto) {
        return this.transactionService.getInfoInterbank(
            body.accountNumber,
            body.bankType,
        );
    }

    @Get("/statistical")
    getStatistical(@Body() body) {
        return this.transactionService.getBankTranaction(
            body.from,
            body.to,
            body.bankType,
        );
    }
}

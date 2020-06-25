import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Post,
    Req,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtGuard } from "@src/guards/jwt.guard";
import { TransactionService } from "@src/modules/transaction/transaction.service";
import { CreateTransactionDto } from "@src/dto/transaction.dto";

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
        );
    }
}

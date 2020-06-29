import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Req,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtGuard } from "@src/guards/jwt.guard";
import { CreateSavingAccountDto } from "@src/dto/savingAccount.dto";
import { SavingAccountService } from "./saveaccount.service";

@Controller("saving-account")
@ApiTags("saving-account")
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtGuard)
export class SavingAccountController {
    constructor(private readonly savingAccountService: SavingAccountService) {}

    @Get()
    getSavingAccount(@Req() req) {
        return this.savingAccountService.getSavingAccount(req.user.id);
    }

    @Post("/")
    create(@Body() body: CreateSavingAccountDto, @Req() req) {
        return this.savingAccountService.createSavingAccount(
            req.user.id,
            body.name,
            body.amount,
            body.time,
        );
    }

    @Delete("/:id")
    delete(@Param("id") id) {
        return this.savingAccountService.deleSavingAccount(id);
    }
}

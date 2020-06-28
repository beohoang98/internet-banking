import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Post,
    Req,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtGuard } from "@src/guards/jwt.guard";
import { DebtRemindService } from "@src/modules/deptremind/debtremind.service";
import {
    CreateDebtRemindDto,
    DeleteDebtRemindDto,
} from "@src/dto/debtRemind.dto";

@Controller("debt")
@ApiTags("debt")
@ApiBearerAuth()
@UseGuards(JwtGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class DebtRemindController {
    constructor(private readonly debtRemindService: DebtRemindService) {}

    @Post()
    createDeptRemind(@Req() req, @Body() body: CreateDebtRemindDto) {
        return this.debtRemindService.create(
            req.user.id,
            body.desAccount,
            body.amount,
            body.remindNote,
        );
    }

    @Get()
    getMyDeptRemind(@Req() req) {
        return this.debtRemindService.getDeptRemind(req.user.id);
    }

    @Delete()
    deleteDeptRemind(@Req() req, @Body() body: DeleteDebtRemindDto) {
        return this.debtRemindService.deleteDeptRemind(
            req.user.id,
            body.deptId,
            body.completeNote,
        );
    }
}

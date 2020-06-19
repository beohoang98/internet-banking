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
import { DebtRemindService } from "@src/modules/deptremind/debtremind.service";
import {
    CreateDebtRemindDto,
    DeleteDebtRemindDto,
} from "@src/dto/debtRemind.dto";

@Controller("dept")
@ApiTags("dept")
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

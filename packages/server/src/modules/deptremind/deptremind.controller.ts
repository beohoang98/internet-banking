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
import { DeptRemindService } from "@src/modules/deptremind/deptremind.service";
import {
    CreateDeptRemindDto,
    DeleteDeptRemindDto,
} from "@src/dto/deptRemind.dto";

@Controller("dept")
@ApiTags("dept")
@ApiBearerAuth()
@UseGuards(JwtGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class DeptRemindController {
    constructor(private readonly deptRemindService: DeptRemindService) {}

    @Post()
    createDeptRemind(@Req() req, @Body() body: CreateDeptRemindDto) {
        return this.deptRemindService.create(
            req.user.id,
            body.desAccount,
            body.amount,
            body.remindNote,
        );
    }

    @Get()
    getMyDeptRemind(@Req() req) {
        return this.deptRemindService.getDeptRemind(req.user.id);
    }

    @Delete()
    deleteDeptRemind(@Req() req, @Body() body: DeleteDeptRemindDto) {
        return this.deptRemindService.deleteDeptRemind(
            req.user.id,
            body.deptId,
            body.completeNote,
        );
    }
}

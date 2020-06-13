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
import { CreateUserDto } from "@src/dto/user.dto";
import { JwtGuard } from "@src/guards/jwt.guard";
import { ForRoles } from "@src/guards/role.decorator";
import { RoleGuard } from "@src/guards/role.guard";
import { AdminRole } from "@src/models/Admin";
import { ReceiverListService } from "@src/modules/receiverlist/receiverlist.service";
import {
    CreateReceiverDto,
    UpdateReceiverDto,
} from "@src/dto/receiverList.dto";

@Controller("receiver")
@ApiTags("receiver")
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class ReceiverListController {
    constructor(private readonly receiverListService: ReceiverListService) {}

    @Get()
    @UseGuards(JwtGuard)
    profile(@Req() req) {
        return this.receiverListService.getTransferList(req.user.id);
    }

    @Post("/")
    @UseGuards(JwtGuard)
    //@ForRoles(AdminRole.ADMIN, AdminRole.EMPLOYEE)
    create(@Body() body: CreateReceiverDto, @Req() req) {
        return this.receiverListService.addAccount(
            body.desAccountNumber,
            body.name,
            body.bankType,
            req.user.id,
        );
    }

    @Put("/:id")
    @UseGuards(JwtGuard)
    //@ForRoles(AdminRole.ADMIN, AdminRole.EMPLOYEE)
    update(@Body() body: CreateReceiverDto, @Param("id") id) {
        return this.receiverListService.updateAccount(
            body.desAccountNumber,
            body.name,
            body.bankType,
            id,
        );
    }

    @Delete("/:id")
    @UseGuards(JwtGuard)
    //@ForRoles(AdminRole.ADMIN, AdminRole.EMPLOYEE)
    delete(@Param("id") id) {
        return this.receiverListService.deleteAccount(id);
    }
}

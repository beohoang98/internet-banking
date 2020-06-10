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
import { TransferListService } from "@src/modules/transferlist/transferlist.service";
import {
    CreateTransferDto,
    UpdateTransferDto,
} from "@src/dto/transferList.dto";

@Controller("transfer")
@ApiTags("transfer")
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class TransferListController {
    constructor(private readonly transferListService: TransferListService) {}

    @Get()
    @UseGuards(JwtGuard)
    profile(@Req() req) {
        return this.transferListService.getTransferList(req.user.id);
    }

    @Post("/")
    @UseGuards(JwtGuard)
    //@ForRoles(AdminRole.ADMIN, AdminRole.EMPLOYEE)
    create(@Body() body: CreateTransferDto, @Req() req) {
        return this.transferListService.addAccount(
            body.desAccountNumber,
            body.name,
            body.bankType,
            req.user.id,
        );
    }

    @Put("/:id")
    @UseGuards(JwtGuard)
    //@ForRoles(AdminRole.ADMIN, AdminRole.EMPLOYEE)
    update(@Body() body: CreateTransferDto, @Param("id") id) {
        return this.transferListService.updateAccount(
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
        return this.transferListService.deleteAccount(id);
    }
}

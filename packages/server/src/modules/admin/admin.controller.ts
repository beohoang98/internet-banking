import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    Req,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiConsumes,
    ApiOkResponse,
    ApiParam,
    ApiTags,
} from "@nestjs/swagger";
import { ForRoles } from "@src/guards/role.decorator";

import { AdminRole } from "@src/models/Admin";
import {
    CreateAdminDto,
    DepositToUserAccount,
    UpdateEmployeeDto,
} from "@src/dto/admin.dto";
import { AdminService } from "./admin.service";
import { RoleGuard } from "@src/guards/role.guard";
import { JwtGuard } from "@src/guards/jwt.guard";
import { Request } from "express";
import { PaginateQueryDto, PaginationDto } from "@src/dto/paginate.dto";
import { TransformClassToPlain } from "class-transformer";
import { UpdateClientDto } from "@src/dto/client.dto";

@Controller("admin")
@ApiTags("admin")
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@UseGuards(JwtGuard, RoleGuard)
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Get("profile")
    @ForRoles(AdminRole.ADMIN, AdminRole.EMPLOYEE)
    profile(@Req() req: Request) {
        return this.adminService.findById(req.user.id);
    }

    @Post("employee")
    @ApiConsumes("application/json", "multipart/form-data")
    @ForRoles(AdminRole.ADMIN)
    create(@Body() body: CreateAdminDto) {
        return this.adminService.createEmployee(
            body.name,
            body.email,
            body.password,
            body.role,
        );
    }

    @Post("deposit")
    @ForRoles(AdminRole.ADMIN, AdminRole.EMPLOYEE)
    deposit(@Body() body: DepositToUserAccount, @Req() req: Request) {
        return this.adminService.depositUserAccout(
            body.accountNumber,
            body.amount,
            body.password,
            req.user.id,
        );
    }

    @Get("employee")
    @ForRoles(AdminRole.ADMIN)
    @ApiOkResponse({ type: PaginationDto })
    getEmployeeList(@Query() query: PaginateQueryDto) {
        return this.adminService.paginateEmployee(query.name, {
            page: query.page,
            limit: query.limit,
        });
    }

    @Put("employee/:id(\\d+)")
    @ForRoles(AdminRole.ADMIN)
    updateEmployee(@Param("id") id: number, @Body() body: UpdateEmployeeDto) {
        return this.adminService.updateEmployee(id, body.name, body.email);
    }

    @Delete("employee/:id(\\d+)")
    @ForRoles(AdminRole.ADMIN)
    deleteEmployee(@Param("id") id: number) {
        return this.adminService.deleteEmployee(id);
    }

    @Get("partner")
    @ForRoles(AdminRole.ADMIN)
    @TransformClassToPlain({ groups: ["admin"] })
    getPartners() {
        return this.adminService.getPartners();
    }

    @Get("partner/:id")
    @ForRoles(AdminRole.ADMIN)
    @ApiParam({ type: String, name: "id" })
    @TransformClassToPlain({ groups: ["admin"] })
    getPartnerDetails(@Param("id") id: string) {
        return this.adminService.getPartner(id);
    }

    @Put("partner/:id")
    @ForRoles(AdminRole.ADMIN)
    @ApiParam({ type: String, name: "id" })
    @TransformClassToPlain({ groups: ["admin"] })
    updatePartner(@Body() body: UpdateClientDto, @Param("id") id: string) {
        return this.adminService.updatePartner(id, body);
    }

    @Get("partner/:id/transactions")
    @ForRoles(AdminRole.ADMIN)
    @ApiParam({ type: String, name: "id" })
    @TransformClassToPlain({ groups: ["admin"] })
    getPartnerTransactions(
        @Param("id") id: string,
        @Query() q: PaginateQueryDto,
        @Req() req: Request,
    ) {
        return this.adminService.getPartnerTransactions(id, {
            route: req.path,
            limit: q.limit,
            page: q.page,
        });
    }

    @Get("partner/:id/transaction-total")
    @ForRoles(AdminRole.ADMIN)
    @ApiParam({ type: String, name: "id" })
    @TransformClassToPlain({ groups: ["admin"] })
    getPartnerTransactionsTotal(@Param("id") id: string) {
        return this.adminService.getPartnerTransactionSum(id);
    }
}

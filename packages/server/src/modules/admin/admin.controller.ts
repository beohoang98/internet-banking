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

@Controller("admin")
@ApiTags("admin")
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@UseGuards(JwtGuard, RoleGuard)
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Get("/profile")
    @ForRoles(AdminRole.ADMIN, AdminRole.EMPLOYEE)
    profile(@Req() req: Request) {
        return this.adminService.findById(req.user.id);
    }

    @Post("/employee")
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

    @Post("/deposit")
    @ForRoles(AdminRole.ADMIN, AdminRole.EMPLOYEE)
    deposit(@Body() body: DepositToUserAccount, @Req() req: Request) {
        return this.adminService.depositUserAccout(
            body.accountNumber,
            body.amount,
            body.password,
            req.user.id,
        );
    }

    @Get("/employee")
    @ForRoles(AdminRole.ADMIN)
    @ApiOkResponse({ type: PaginationDto })
    getEmployeeList(@Query() query: PaginateQueryDto) {
        return this.adminService.paginateEmployee(query.name, {
            page: query.page,
            limit: query.limit,
        });
    }

    @Put("/employee/:id(\\d+)")
    @ForRoles(AdminRole.ADMIN)
    updateEmployee(@Param("id") id: number, @Body() body: UpdateEmployeeDto) {
        return this.adminService.updateEmployee(
            id,
            body.name,
            body.email,
            body.password,
        );
    }

    @Delete("/employee/:id(\\d+)")
    @ForRoles(AdminRole.ADMIN)
    deleteEmployee(@Param("id") id: number) {
        return this.adminService.deleteEmployee(id);
    }
}

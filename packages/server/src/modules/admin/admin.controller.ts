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
    Param,
    Delete,
} from "@nestjs/common";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
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

@Controller("admin")
@ApiTags("admin")
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@UseGuards(JwtGuard, RoleGuard)
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Post("/employee")
    @ApiConsumes("application/json", "multipart/form-data")
    @ForRoles(AdminRole.ADMIN)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    deposit(@Body() body: DepositToUserAccount) {
        return this.adminService.depositUserAccout(
            body.accountNumber,
            body.amount,
        );
    }

    @Get("/employee")
    @ForRoles(AdminRole.ADMIN)
    getEmployeeList() {
        return this.adminService.getListEmployee();
    }

    @Put("/employee/:id")
    @ForRoles(AdminRole.ADMIN)
    updateEmployee(@Param("id") id, @Body() body: UpdateEmployeeDto) {
        return this.adminService.updateEmployee(
            id,
            body.name,
            body.email,
            body.password,
        );
    }

    @Delete("/employee/:id")
    @ForRoles(AdminRole.ADMIN)
    deleteEmployee(@Param("id") id) {
        return this.adminService.deleteEmployee(id);
    }
}

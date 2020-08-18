import {
    IsEmail,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsDate,
} from "class-validator";
import { Type, Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { AdminRole } from "@src/models/Admin";
import { PaginateQueryDto } from "./paginate.dto";

export class CreateAdminDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    name: string;

    @ApiProperty()
    @IsEmail()
    @Type(() => String)
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    password: string;

    @ApiProperty({ enum: AdminRole, required: false })
    @IsOptional()
    @IsEnum(AdminRole)
    role: AdminRole = AdminRole.EMPLOYEE;
}

export class DepositToUserAccount {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    accountNumber: string;

    @ApiProperty()
    @IsInt()
    amount: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string;
}

export class UpdateEmployeeDto {
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    @Type(() => String)
    name?: string;

    @ApiProperty({ required: false })
    @IsEmail()
    @IsOptional()
    @Type(() => String)
    email?: string;

    // @ApiProperty()
    // @IsString()
    // @IsNotEmpty()
    // @Type(() => String)
    // password: string;
}

export class PartnerTransactionQuery extends PaginateQueryDto {
    @ApiProperty({ type: "date", required: false })
    @IsOptional()
    @IsDate()
    @Transform((val) => new Date(val))
    from?: Date;

    @ApiProperty({ type: "date", required: false })
    @IsOptional()
    @IsDate()
    @Transform((val) => new Date(val))
    to?: Date;
}

import {
    IsEmail,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { AdminRole } from "@src/models/Admin";

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

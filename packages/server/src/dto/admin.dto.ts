import { IsEmail, IsEnum, IsInt, IsNotEmpty, IsString } from "class-validator";
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

    @ApiProperty({ enum: AdminRole })
    @IsEnum(AdminRole)
    role: AdminRole;
}

export class DepositToUserAccount {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    accountNumber: string;

    @ApiProperty()
    @IsInt()
    amount: number;
}

export class UpdateEmployeeDto {
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
}

import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    IsOptional,
    IsInt,
} from "class-validator";

export class CreateUserDto {
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

    @ApiProperty()
    @IsOptional()
    @IsString()
    phone: string;
}

export class ChangePasswordDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    oldPassword: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    newPassword: string;
}

export class ResetPasswordDto {
    @ApiProperty()
    @IsInt()
    otp: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string;
}

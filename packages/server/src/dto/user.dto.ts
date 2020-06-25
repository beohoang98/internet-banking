import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
    IsEmail,
    IsNotEmpty,
    IsNumberString,
    IsPhoneNumber,
    IsString,
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
    @IsPhoneNumber("VN")
    phone: string;

    @ApiProperty()
    @IsNumberString()
    accountNumber: string;
}

import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

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
}

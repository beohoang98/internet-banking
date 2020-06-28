import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsInt, Min } from "class-validator";

export class CreateSavingAccountDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsInt()
    @Min(1)
    time: number;

    @ApiProperty()
    @IsInt()
    @Min(0)
    amount: number;
}

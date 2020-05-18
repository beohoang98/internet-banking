import { ApiProperty } from "@nestjs/swagger";
import { IsJWT, IsUUID } from "class-validator";

export class AccessTokenDto {
    @ApiProperty()
    @IsJWT()
    accessToken: string;

    @ApiProperty()
    @IsUUID(4)
    refreshToken: string;

    constructor(data: Partial<AccessTokenDto>) {
        Object.assign(this, data);
    }
}

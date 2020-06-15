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
    Delete,
    Param,
} from "@nestjs/common";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { JwtGuard } from "@src/guards/jwt.guard";
import { OtpService } from "@src/modules/otp/otp.service";

@Controller("otp")
@ApiTags("otp")
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class OtpController {
    constructor(private readonly otpService: OtpService) {}

    @Get()
    @UseGuards(JwtGuard)
    createOTP(@Req() req) {
        return this.otpService.createOtp(req.user.id);
    }
}

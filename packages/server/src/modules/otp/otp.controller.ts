import {
    ClassSerializerInterceptor,
    Controller,
    Get,
    Req,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
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

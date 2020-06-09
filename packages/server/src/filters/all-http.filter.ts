import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from "@nestjs/common";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const status =
            exception?.getStatus?.() || HttpStatus.INTERNAL_SERVER_ERROR;

        const responseJSON = exception?.getResponse?.();

        response.status(status).json(
            responseJSON || {
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
                message: exception?.message,
                stack: exception?.stack,
            },
        );
    }
}

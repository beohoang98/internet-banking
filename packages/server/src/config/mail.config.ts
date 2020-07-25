import * as path from "path";

import { MailerOptions } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";

const mailConfig = (): MailerOptions => ({
    transport: {
        debug: process.env.NODE_ENV !== "production",
        //url: process.env.MAIL_URL,
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        secure: false,
        tls: {
            rejectUnauthorized: false,
        },
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
        },
    },
    defaults: {
        from: '"HCMUS 2020" <dgroup28banking@gmail.com>',
    },
    template: {
        adapter: new HandlebarsAdapter(),
        dir: path.resolve("templates"),
        options: {
            strict: true,
            partials: {
                dir: path.resolve("templates/partials"),
                options: {
                    strict: true,
                },
            },
        },
    },
});

export default mailConfig;

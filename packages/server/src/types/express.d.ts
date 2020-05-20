import "express";

declare global {
    namespace Express {
        interface User {
            id: number;
            role: string;
        }
        interface Request {
            client: any;
        }
    }
}

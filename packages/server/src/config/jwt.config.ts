import * as fs from "fs";
import * as path from "path";

const ACCESS_EXPIRE = 3600;
const REFRESH_EXPIRE = 3600 * 5;

export const JwtConfig =
    process.env.NODE_ENV !== "production"
        ? {
              PRIVATE: fs.readFileSync(
                  path.resolve(__dirname, "../keys/dev.pem"),
              ),
              PUBLIC: fs.readFileSync(
                  path.resolve(__dirname, "../keys/dev.pub"),
              ),
              ACCESS_EXPIRE,
              REFRESH_EXPIRE,
          }
        : {
              PRIVATE: Buffer.from(process.env.PRIVATE_KEY, "base64"),
              PUBLIC: Buffer.from(process.env.PUBLIC_KEY, "base64"),
              ACCESS_EXPIRE,
              REFRESH_EXPIRE,
          };

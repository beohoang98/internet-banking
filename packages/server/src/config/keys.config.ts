import { readFileSync } from "fs";
import * as path from "path";

const DevKeys = () => ({
    PGP_PUBLIC: readFileSync(path.resolve(__dirname, "../keys/nhom28-pub.asc")),
    PGP_PRIVATE: readFileSync(
        path.resolve(__dirname, "../keys/nhom28-pgp.asc"),
    ),
    RSA_PUBLIC: readFileSync(path.resolve(__dirname, "../keys/nhom28-rsa.pub")),
    RSA_PRIVATE: readFileSync(
        path.resolve(__dirname, "../keys/nhom28-rsa.pem"),
    ),
});
const ProdKeys = () => ({
    PGP_PUBLIC: Buffer.from(process.env.PUBLIC_PGP_KEY, "base64"),
    RSA_PUBLIC: Buffer.from(process.env.PUBLIC_RSA_KEY, "base64"),
    PGP_PRIVATE: Buffer.from(process.env.PRIVATE_PGP_KEY, "base64"),
    RSA_PRIVATE: Buffer.from(process.env.PRIVATE_RSA_KEY, "base64"),
});

export const Keys =
    process.env.NODE_ENV === "production" ? ProdKeys() : DevKeys();

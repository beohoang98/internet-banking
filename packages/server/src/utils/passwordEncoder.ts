import { hashSync, compareSync } from "bcrypt";

export class PasswordEncoder {
    static round: number = 5;
    static encode(pass: string): string {
        return hashSync(pass, this.round);
    }
    static compare(raw: string, encoded: string): boolean {
        return compareSync(raw, encoded);
    }
}

import { PasswordEncoder } from "@src/utils/passwordEncoder";

describe("PasswordEncoder", () => {
    it("should match", () => {
        const pass = "123456789";
        const hashed = PasswordEncoder.encode(pass);
        expect(PasswordEncoder.compare(pass, hashed)).toBe(true);
    });
});

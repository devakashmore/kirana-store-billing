import bcrypt from "bcrypt";
const SALT_ROUNDS = 12;
const MAX_PASSWORD_BYTES = 72;

export async function hashPassword(password) {
    if (typeof password !== "string" || password.length === 0) {
        throw new Error("Password is required");
    }
    if (Buffer.byteLength(password, "utf-8") > MAX_PASSWORD_BYTES) {
        throw new Error("Password cannot exceed 72 bytes");
    }

    return bcrypt.hash(password, SALT_ROUNDS);

}

export async function comparePassword(password, hashPassword) {
    if (typeof password !== "string" || typeof hashPassword !== "string") {
        return false;
    }
    if (Buffer.byteLength(password, "utf-8") > MAX_PASSWORD_BYTES) {
        return false;
    }
    return bcrypt.compare(password, hashPassword);
}

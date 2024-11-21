import { hash, compare } from "bcryptjs";

interface Verify {
  password: string;
  hashedPassword: string;
}

async function hashPassword(password: string) {
  const hashedPassword = await hash(password, 12);
  return hashedPassword;
}

async function verifyPassword({ password, hashedPassword }: Verify) {
  const isValid = await compare(password, hashedPassword);
  return isValid;
}

export { hashPassword, verifyPassword };

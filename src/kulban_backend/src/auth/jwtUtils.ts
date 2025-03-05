import jwt from "jwt-simple";
import { SECRET_KEY } from "../config";

export function generateToken(userID: string): string {
  return jwt.encode(
    {
      user: userID,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    },
    SECRET_KEY,
  );
}

export function verifyToken(token: string): string | null {
  try {
    const decoded = jwt.decode(token, SECRET_KEY);

    return decoded;
  } catch {
    return null;
  }
}

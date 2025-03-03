import jwt from "jwt-simple";
import { SECRET_KEY } from "../config";

export function generateToken(userID: string): string {
  return jwt.encode({ user: userID }, SECRET_KEY);
}

export function verifyToken(token: string): string | null {
  try {
    const decoded = jwt.decode(token, SECRET_KEY);

    return decoded;
  } catch (error) {
    console.error(error);
    return null;
  }
}

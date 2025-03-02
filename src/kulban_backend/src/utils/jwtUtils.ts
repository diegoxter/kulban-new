// utils/jwtUtils.ts
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config";

export function generateToken(userID: string): string {
  return jwt.sign({ userID }, SECRET_KEY, { expiresIn: "1h" });
}

export function verifyToken(token: string): string | null {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { userID: string };
    return decoded.userID;
  } catch (error) {
    console.error(error);
    return null;
  }
}

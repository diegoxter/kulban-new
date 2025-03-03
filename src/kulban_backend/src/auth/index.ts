import { Request, Response, NextFunction } from "express";
import { createHash } from "crypto";
import { generateToken, verifyToken } from "./jwtUtils";
import { SECRET_KEY } from "../config";

const userID = (username: string) =>
  createHash("sha256").update(username).digest("hex");
const salt = (username: string) =>
  createHash("sha256")
    .update(username + SECRET_KEY)
    .digest("hex");
const passwordHash = (username: string, password: string) =>
  createHash("sha256")
    .update(password + salt(username))
    .digest("hex");

const token = (username: string, pHash: string) =>
  createHash("sha256")
    .update(userID(username) + salt(username) + pHash)
    .digest("hex");

interface User {
  username: string;
  passwordHash: string;
}

const users: User[] = [];

export async function registerUser(username: string, password: string) {
  try {
    users.push({
      username: username,
      passwordHash: passwordHash(username, password),
    });

    const jwToken = generateToken(username);

    return jwToken;
  } catch (error) {
    throw new Error(`Couldnt register: ${error}`);
  }
}

export async function loginUser(username: string, password: string) {
  try {
    const userIndex = users.findIndex(
      (user) =>
        user.username === username &&
        user.passwordHash === passwordHash(username, password),
    );
    if (userIndex === -1) throw new Error("Invalid Credentials");

    const userEntryToken = token(
      users[userIndex].username,
      users[userIndex].passwordHash,
    );
    const credentialstoken = token(username, passwordHash(username, password));

    if (userEntryToken !== credentialstoken)
      throw new Error("Invalid Credentials");

    const jwToken = generateToken(users[userIndex].username);

    return jwToken;
  } catch (error) {
    throw new Error(`Couldnt login: ${error}`);
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["authorization"];
  if (!token) return res.sendStatus(401);

  const userID = verifyToken(token.split(" ")[1]);
  if (!userID) return res.sendStatus(403);

  // @ts-expect-error we sending this to the req
  req.user = userID;
  next();
}

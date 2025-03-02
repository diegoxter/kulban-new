import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwtUtils";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["authorization"];
  if (!token) return res.sendStatus(401);

  const userID = verifyToken(token);
  if (!userID) return res.sendStatus(403);

  // @ts-expect-error we sending this to the req
  req.user = userID;
  next();
}

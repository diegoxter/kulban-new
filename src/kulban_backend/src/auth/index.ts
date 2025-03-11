import { Request, Response, NextFunction } from "express";
import { ethers, TransactionReceipt } from "ethers";
import { abi } from "./UserAuthenticationABI.json";
import { generateToken, verifyToken } from "./jwtUtils";
import {
  SECRET_KEY,
  RPC_URL,
  PRIVATE_KEY,
  AUTH_CONTRACT_ADDRESS,
} from "../config";

const userID = (username: string) => ethers.id(username);

const salt = (username: string) => ethers.id(username + SECRET_KEY);
const passwordHash = (username: string, password: string) =>
  ethers.id(password + salt(username));

export async function registerUser(username: string, password: string) {
  const provider = ethers.getDefaultProvider(RPC_URL);
  const signer = new ethers.Wallet(PRIVATE_KEY!, provider);
  const contract = new ethers.Contract(AUTH_CONTRACT_ADDRESS, abi, signer);

  try {
    const tx = await contract["registerUser"](
      userID(username),
      passwordHash(username, password),
      signer.getAddress(),
    );

    const receipt: TransactionReceipt = await tx.wait();
    console.log(receipt.status);
    const jwToken = generateToken(username);

    return jwToken;
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const err = error as any;
    throw new Error(`${err.reason ?? err.message}`);
  }
}

export async function loginUser(username: string, password: string) {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const contract = new ethers.Contract(AUTH_CONTRACT_ADDRESS, abi, provider);
  try {
    const validUser = await contract["loginUser"](
      userID(username),
      passwordHash(username, password),
    );

    if (!validUser) throw new Error("Invalid Credentials");

    const jwToken = generateToken(username);

    return jwToken;
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new Error(`${(error as Error).message ?? (error as any).reason}`);
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["authorization"];
  if (!token)
    return res.status(401).json({
      status: "error",
      message: "Access denied",
      details: "No authorization",
    });

  const userID = verifyToken(token.split(" ")[1]);
  if (!userID)
    return res.status(403).json({
      status: "error",
      message: "Access denied",
      details: "Invalid or expired token",
    });

  // @ts-expect-error we sending this to the req
  req.user = userID;
  next();
}

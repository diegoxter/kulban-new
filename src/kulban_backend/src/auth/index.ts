import { Request, Response, NextFunction } from "express";
import { ethers, TransactionReceipt } from "ethers";
import { abi } from "./UserAuthenticationABI.json";
import { generateToken, verifyToken } from "./jwtUtils";
import { SECRET_KEY, RPC_URL, PRIVATE_KEY } from "../config";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const userID = (username: string) => ethers.id(username);

const salt = (username: string) => ethers.id(username + SECRET_KEY);
const passwordHash = (username: string, password: string) =>
  ethers.id(password + salt(username));

export async function registerUser(username: string, password: string) {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signer = new ethers.Wallet(PRIVATE_KEY!, provider);
  const contract = new ethers.Contract(contractAddress, abi, signer);
  try {
    const tx = await contract["registerUser"](
      userID(username),
      passwordHash(username, password),
      signer.getAddress(),
    );

    const receipt: TransactionReceipt = await tx.wait();
    console.log(receipt.status);
    const jwToken = generateToken(userID(username + salt(username)));

    return jwToken;
  } catch (error) {
    throw new Error(`Couldnt register: ${error}`);
  }
}

export async function loginUser(username: string, password: string) {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const contract = new ethers.Contract(contractAddress, abi, provider);
  try {
    const validUser = await contract["loginUser"](
      userID(username),
      passwordHash(username, password),
    );

    if (!validUser) throw new Error("Invalid Credentials");

    const jwToken = generateToken(userID(username + salt(username)));

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

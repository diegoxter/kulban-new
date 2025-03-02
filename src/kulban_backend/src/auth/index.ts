import { ethers } from "ethers";
import { abi } from "./UserAuthenticationABI.json";
import { generateToken } from "../utils/jwtUtils";
import { authenticate } from "./authMiddleware";
import { RPC_URL, SECRET_KEY, PRIVATE_KEY } from "../config";

const provider = new ethers.JsonRpcProvider(RPC_URL);
const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const signer = new ethers.Wallet(PRIVATE_KEY!, provider);
const contract = new ethers.Contract(contractAddress, abi, signer);

const userID = (username: string) => ethers.id(username);
const salt = (username: string) => ethers.id(username + SECRET_KEY);
const passwordHash = (username: string, password: string) =>
  ethers.id(password + salt(username));

export async function registerUser(username: string, password: string) {
  try {
    const tx = await contract["registerUser"](
      userID(username),
      passwordHash(username, password),
      signer.getAddress(),
    );
    await tx.wait();

    const token = generateToken(username);
    return token;
  } catch (error) {
    throw new Error(`Couldnt register: ${error}`);
  }
}

export async function loginUser(username: string, password: string) {
  try {
    const success = await contract.loginUser(
      userID(username),
      passwordHash(username, password),
    );

    if (!success) throw new Error("Invalid Credentials");

    const token = generateToken(username);
    return token;
  } catch (error) {
    throw new Error(`Couldnt login: ${error}`);
  }
}

export { authenticate };

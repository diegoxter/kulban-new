import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

export const SECRET_KEY: string =
  process.env.NODE_ENV == "development"
    ? "N1c3_S4Lt"
    : process.env.BACKEND_SALT!;
export const RPC_URL =
  process.env.NODE_ENV == "development"
    ? "http://127.0.0.1:8545"
    : process.env.RPC_URL;
export const PRIVATE_KEY =
  process.env.NODE_ENV == "development"
    ? "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
    : process.env.PRIVATE_KEY;

export const AUTH_CONTRACT_ADDRESS: string =
  process.env.NODE_ENV == "development"
    ? "0x712516e61C8B383dF4A63CFe83d7701Bce54B03e"
    : process.env.AUTH_CONTRACT_ADDRESS!;
export const DEPLOYER_CONTRACT_ADDRESS: string =
  process.env.NODE_ENV == "development"
    ? "0x71C95911E9a5D330f4D621842EC243EE1343292e"
    : process.env.DEPLOYER_CONTRACT_ADDRESS!;

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
    ? "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
    : process.env.PRIVATE_KEY;

export const AUTH_CONTRACT_ADDRESS: string =
  process.env.NODE_ENV == "development"
    ? "0x8464135c8F25Da09e49BC8782676a84730C318bC"
    : process.env.AUTH_CONTRACT_ADDRESS!;
export const DEPLOYER_CONTRACT_ADDRESS: string =
  process.env.NODE_ENV == "development"
    ? "0x71C95911E9a5D330f4D621842EC243EE1343292e"
    : process.env.DEPLOYER_CONTRACT_ADDRESS!;

import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

export const SECRET_KEY: string =
  process.env.NODE_ENV == "development"
    ? "N1c3_S4Lt"
    : process.env.BACKEND_SALT!;
export const RPC_URL =
  process.env.NODE_ENV == "development"
    ? "https://sepolia.base.org"
    : process.env.RPC_URL;
export const PRIVATE_KEY =
  process.env.NODE_ENV == "development"
    ? "0x4447bf28b2ff377844e69b651ce39f23a0fee749b95c921b44edde5e3bb10106"
    : process.env.PRIVATE_KEY;

export const AUTH_CONTRACT_ADDRESS: string =
  process.env.NODE_ENV == "development"
    ? "0x35cf74d4C94779D91A998F3A28a6627E01a6bBa9"
    : process.env.AUTH_CONTRACT_ADDRESS!;
export const DEPLOYER_CONTRACT_ADDRESS: string =
  process.env.NODE_ENV == "development"
    ? "0x88de9405af0f141427712885ffc102ec9d956110"
    : process.env.DEPLOYER_CONTRACT_ADDRESS!;

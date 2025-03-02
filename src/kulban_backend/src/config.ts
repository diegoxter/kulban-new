import dotenv from "dotenv";
import path from "path";
import { Secret } from "jsonwebtoken";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

export const SECRET_KEY: Secret = process.env.BACKEND_SALT!;
export const RPC_URL =
  process.env.NODE_ENV == "dev" ? "http://127.0.0.1:8545" : process.env.RPC_URL;
export const PRIVATE_KEY =
  process.env.NODE_ENV == "dev"
    ? "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
    : process.env.PRIVATE_KEY;

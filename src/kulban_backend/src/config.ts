import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

export const SECRET_KEY: string = process.env.BACKEND_SALT!;

import express, { Request, Response } from "express";
import { registerUser, loginUser, authenticate } from "./auth/index";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.use(express.json());

app.post("/register", async (req: Request, res) => {
  const { email, password } = req.body;
  try {
    const token = await registerUser(email, password);

    res.json({ token });
  } catch (error) {
    res
      // eslint-disable-next-line
      .status((error as any).status ?? 500)
      // eslint-disable-next-line
      .send({ error: (error as any).message });
  }
});

app.post("/login", async (req: Request, res) => {
  const { email, password } = req.body;
  try {
    const token = await loginUser(email, password);

    res.json({ token });
  } catch (error) {
    res
      // eslint-disable-next-line
      .status((error as any).status ?? 500)
      // eslint-disable-next-line
      .send({ error: (error as any).message });
  }
});

app.get("/protected", authenticate, (req: Request, res: Response) => {
  res.json({ message: "Access granted" });
});

const port = process.env.NODE_ENV === "dev" ? 3000 : 0;

app.listen(port, () => {
  console.log("running on port:", port);
});

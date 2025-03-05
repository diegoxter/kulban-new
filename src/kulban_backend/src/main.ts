import express, { Request, Response } from "express";
import { registerUser, loginUser, authenticate } from "./auth/index";
import { getUserBoards } from "./dataManagement/index";
import { AddressInfo } from "net";
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
      .send({ error: (error as any).message ?? "Problem to register" });
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
      .send({ error: (error as any).message ?? "Problem to login" });
  }
});

app.get("/get-boards", authenticate, async (req: Request, res: Response) => {
  // @ts-expect-error we sending this to the req
  const userBoards = await getUserBoards(req.user.user);

  res.json({ boards: userBoards });
});

const port = process.env.NODE_ENV === "development" ? 3000 : 0;

const server = app.listen(port, () => {
  const assignedPort = server.address() as AddressInfo;
  console.log(
    "Running on port:",
    `http://${assignedPort.address === "::" ? "127.0.0.1" : assignedPort.address}:${assignedPort.port}`,
  );
});

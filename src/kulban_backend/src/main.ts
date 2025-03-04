import express, { Request, Response } from "express";
import { registerUser, loginUser, authenticate } from "./auth/index";
import { getUserBoards } from "./dataManagement/index";
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

app.get("/get-boards", authenticate, async (req: Request, res: Response) => {
  // @ts-expect-error we sending this to the req
  const userBoards = await getUserBoards(req.user.user);

  res.json({ boards: userBoards });
});

const port = process.env.NODE_ENV === "development" ? 3000 : 0;

app.listen(port, () => {
  console.log("running on port:", port);
});

import express, { Request, Response } from "express";
import { registerUser, loginUser, authenticate } from "./auth/index";
import {
  createBoards,
  getBoardInfo,
  getUserBoards,
} from "./dataManagement/index";
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

// These need authentication
app.get("/get-boards", authenticate, async (req: Request, res: Response) => {
  // @ts-expect-error we sending this to the req
  const userBoards = await getUserBoards(req.user.user);

  res.json({ boards: userBoards });
});

app.get(
  "/get-board/:boardAddress",
  authenticate,
  async (req: Request, res: Response) => {
    const { boardAddress } = req.params;
    // @ts-expect-error we sending this to the req
    const board = await getBoardInfo(boardAddress, req.user.user);

    if (board instanceof Error) {
      return res.status(404).json({ message: board.message });
    }

    return res.status(200).json(board);
  },
);

app.post("/create-board", authenticate, async (req: Request, res: Response) => {
  const { newBoards } = req.body;
  const boardCreated = await createBoards(newBoards);

  if (boardCreated instanceof Error) {
    return res.status(500).json({ message: boardCreated.message });
  }

  return res.status(200).json({ message: "Board created successfully" });
});

app.listen(3000);

import { AddressInfo } from "net";
import express, { Request, Response } from "express";
import { registerUser, loginUser, authenticate } from "./auth/index";
import {
  createBoard,
  createCategory,
  editTasks,
  getBoardInfo,
  getUserBoards,
} from "./dataManagement/index";
const app = express();

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.use(express.json());

app.post("/register", async (req: Request, res) => {
  const { email, password }: { email: string; password: string } = req.body;
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
  const { email, password }: { email: string; password: string } = req.body;

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
  const userBoards: Board[] = await getUserBoards(req.user.user);

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
  const { newBoard }: { newBoard: Board } = req.body;
  const boardCreated = await createBoard(newBoard);

  if (boardCreated instanceof Error) {
    return res.status(500).json({ message: boardCreated.message });
  }

  return res.status(200).json({ message: "Board created successfully" });
});

app.post(
  "/create-category",
  authenticate,
  async (req: Request, res: Response) => {
    const {
      boardAddress,
      newCategory,
    }: { boardAddress: string; newCategory: string } = req.body;

    const categoryCreated = await createCategory(
      // @ts-expect-error we sending this to the req
      req.user.user,
      boardAddress,
      newCategory,
    );

    if (categoryCreated instanceof Error) {
      return res.status(500).json({ message: categoryCreated.message });
    }

    return res.status(200).json({ message: "Board created successfully" });
  },
);

app.patch(
  "/modify-tasks",
  authenticate,
  async (req: Request, res: Response) => {
    const {
      boardAddress,
      taskIDs,
      tasks,
    }: { boardAddress: string; taskIDs: string[]; tasks: Task[] } = req.body;

    const done: boolean | Error = await editTasks(
      // @ts-expect-error we sending this to the req
      req.user.user,
      boardAddress,
      taskIDs,
      tasks,
    );
    if (!done || done instanceof Error) {
      return res.status(404).json({ message: (done as Error).message });
    }

    return res.status(200).json({ message: "received!" });
  },
);

const port = process.env.NODE_ENV === "development" ? 3000 : 0;

const server = app.listen(port, () => {
  const serverAddress = server.address() as AddressInfo;
  console.log(
    "Running on port:",
    `http://${serverAddress.address === "::" ? "127.0.0.1" : serverAddress.address}:${serverAddress.port}`,
  );
});

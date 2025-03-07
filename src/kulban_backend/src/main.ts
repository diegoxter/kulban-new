import type { Board, Task, EditCategoryParameters } from "./global";
import { AddressInfo } from "net";
import express, { Request, Response } from "express";
import { registerUser, loginUser, authenticate } from "./auth/index";
import {
  createBoard,
  createCategory,
  createTasks,
  editCategory,
  editTasks,
  getBoardInfo,
  getUserBoards,
  removeCategory,
  removeTask,
} from "./dataManagement/index";
const app = express();

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.use(express.json());

app.post("/register", async (req: Request, res) => {
  const { email, password }: { email: string; password: string } = req.body;
  try {
    const token: string = await registerUser(email, password);

    res.json({ token });
  } catch (error) {
    const err = error as { status?: number; message: string };

    res.status(err.status ?? 500).send({ error: err.message });
  }
});

app.post("/login", async (req: Request, res) => {
  const { email, password }: { email: string; password: string } = req.body;

  try {
    const token: string = await loginUser(email, password);

    res.json({ token });
  } catch (error) {
    const err = error as { status?: number; message: string };

    res.status(err.status ?? 401).send({ error: err.message });
  }
});

// These need authentication
app.get("/get-boards", authenticate, async (req: Request, res: Response) => {
  try {
    // @ts-expect-error we sending this to the req
    const userBoards: Board[] = await getUserBoards(req.user.user);

    res.json({ boards: userBoards });
  } catch (error) {
    const err = error as { status?: number; message: string };

    res.status(err.status ?? 401).send({ error: err.message });
  }
});

app.get(
  "/get-board/:boardAddress",
  authenticate,
  async (req: Request, res: Response) => {
    const { boardAddress } = req.params;

    try {
      // @ts-expect-error we sending this to the req
      const board: Board = await getBoardInfo(boardAddress, req.user.user);

      res.status(200).json(board);
    } catch (error) {
      const err = error as { status?: number; message: string };

      res.status(err.status ?? 401).send({ error: err.message });
    }
  },
);

app.post("/create-board", authenticate, async (req: Request, res: Response) => {
  const { newBoard }: { newBoard: Board } = req.body;

  try {
    await createBoard(newBoard);

    res.status(200).json({ message: "Board created successfully" });
  } catch (error) {
    const err = error as { status?: number; message: string };

    res.status(err.status ?? 403).send({ error: err.message });
  }
});

app.post(
  "/create-category",
  authenticate,
  async (req: Request, res: Response) => {
    const {
      boardAddress,
      newCategory,
    }: { boardAddress: string; newCategory: string } = req.body;

    try {
      await createCategory(
        // @ts-expect-error we sending this to the req
        req.user.user,
        boardAddress,
        newCategory,
      );
      return res.status(200).json({ message: "Category created successfully" });
    } catch (error) {
      const err = error as { status?: number; message: string };
      res.status(err.status ?? 500).send({ error: err.message });
    }
  },
);

app.post("/create-tasks", authenticate, async (req: Request, res: Response) => {
  const {
    boardAddress,
    newTasks,
  }: { boardAddress: string; newTasks: Omit<Task[], "id"> } = req.body;

  try {
    await createTasks(
      // @ts-expect-error we sending this to the req
      req.user.user,
      boardAddress,
      newTasks,
    );

    res.status(200).json({ message: "Task created successfully" });
  } catch (error) {
    const err = error as { status?: number; message: string };
    res.status(err.status ?? 500).send({ error: err.message });
  }
});

app.delete(
  "/delete-category",
  authenticate,
  async (req: Request, res: Response) => {
    const {
      boardAddress,
      category,
    }: { boardAddress: string; category: string } = req.body;

    try {
      await removeCategory(
        // @ts-expect-error we sending this to the req
        req.user.user,
        boardAddress,
        category,
      );
      res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      const err = error as { status?: number; message: string };
      res.status(err.status ?? 500).send({ error: err.message });
    }
  },
);

app.delete(
  "/delete-task",
  authenticate,
  async (req: Request, res: Response) => {
    const { boardAddress, taskID }: { boardAddress: string; taskID: string } =
      req.body;

    try {
      await removeTask(
        // @ts-expect-error we sending this to the req
        req.user.user,
        boardAddress,
        taskID,
      );

      res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
      const err = error as { status?: number; message: string };
      res.status(err.status ?? 500).send({ error: err.message });
    }
  },
);

app.patch(
  "/edit-category",
  authenticate,
  async (req: Request, res: Response) => {
    const {
      boardAddress,
      categoryData,
    }: { boardAddress: string; categoryData: EditCategoryParameters } =
      req.body;

    try {
      await editCategory(
        // @ts-expect-error we sending this to the req
        req.user.user,
        boardAddress,
        categoryData,
      );

      res.status(200).json({ message: "Category modified successfully" });
    } catch (error) {
      const err = error as { status?: number; message: string };
      res.status(err.status ?? 500).send({ error: err.message });
    }
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
    }: { boardAddress: string; taskIDs: string[]; tasks: Omit<Task[], "id"> } =
      req.body;

    try {
      await editTasks(
        // @ts-expect-error we sending this to the req
        req.user.user,
        boardAddress,
        taskIDs,
        tasks,
      );
      res.status(200).json({ message: "Tasks modified successfully" });
    } catch (error) {
      const err = error as { status?: number; message: string };
      res.status(err.status ?? 500).send({ error: err.message });
    }
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

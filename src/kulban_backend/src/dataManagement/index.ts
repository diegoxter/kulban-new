import type { Board, Task, EditCategoryParameters } from "../global";
const boards: Board[] = [
  {
    address: "123",
    name: "Test board 1",
    activeTasksNumber: "1n",
    categories: ["cat 1", "cat 2", "cat 3"],
    members: [],
  },
  {
    address: "456",
    name: "Test board 2",
    activeTasksNumber: "1n",
    categories: ["cat 1", "cat 2", "cat 3"],
    members: [["usuario@example.com", true]],
    tasks: [
      {
        id: "1",
        title: "Test task 1",
        description: "Description 1",
        category: "cat 1",
        state: 0,
        isActive: true,
      },
      {
        id: "2",
        title: "Test task 2",
        description: "Description 2",
        category: "cat 2",
        state: 2,
        isActive: true,
      },
      {
        id: "3",
        title: "Test task 3",
        description: "Description 3",
        category: "cat 3",
        state: 1,
      },
    ],
  },

  {
    address: "678",
    name: "Test board 3",
    activeTasksNumber: "1n",
    categories: ["cat 1", "cat 2", "cat 3"],
    members: [["usuario@example.com", true]],
  },
  {
    address: "91011",
    name: "Test board 4",
    activeTasksNumber: "1n",
    categories: ["cat 1", "cat 2", "cat 3"],
    members: [["usuario@example.com", false]],
  },
];

const returnBoardOrError = (boardAddress: string, userID: string): Board => {
  const board = boards.find(
    (b) =>
      b.address === boardAddress &&
      b.members.some(([memberID, isActive]) => memberID === userID && isActive),
  );

  if (!board) throw new Error("Board not found.");

  return board;
};

const returnBoardIndexOrError = (
  boardAddress: string,
  userID: string,
): number => {
  const boardIndex = boards.findIndex(
    (b) =>
      b.address === boardAddress &&
      b.members.some(([memberID, isActive]) => memberID === userID && isActive),
  );

  if (boardIndex === -1) throw new Error("Board not found.");

  return boardIndex;
};

export async function getBoardInfo(
  boardAddress: string,
  userID: string,
): Promise<Board> {
  return returnBoardOrError(boardAddress, userID);
}

export async function getUserBoards(userID: string): Promise<Board[]> {
  const userBoards = boards.filter((board) => {
    return board.members.some(
      ([memberID, isActive]) => memberID === userID && isActive,
    );
  });

  return userBoards;
}

export async function createBoard(newBoard: Board): Promise<boolean | Error> {
  boards.push(newBoard);

  return true;
}

export async function createCategory(
  userID: string,
  boardAddress: string,
  newCategory: string,
): Promise<boolean> {
  const boardIndex = returnBoardIndexOrError(boardAddress, userID);

  const categoryAlreadyExists: boolean =
    boards[boardIndex].categories.includes(newCategory);

  if (categoryAlreadyExists) throw new Error("Category already exists.");

  boards[boardIndex].categories.push(newCategory);

  return true;
}

export async function createTasks(
  userID: string,
  boardAddress: string,
  tasksData: Omit<Task, "id">[],
): Promise<boolean> {
  const boardIndex = returnBoardIndexOrError(boardAddress, userID);
  const board = boards[boardIndex];

  if (!board.tasks) {
    board.tasks = [];
  }

  const lastTask = board.tasks[board.tasks.length - 1];
  let lastId = lastTask ? parseInt(lastTask.id, 10) : 0;

  for (const taskData of tasksData) {
    lastId++;
    const newTask: Task = {
      ...taskData,
      id: lastId.toString(),
    };
    board.tasks.push(newTask);
  }

  return true;
}

export async function editCategory(
  userID: string,
  boardAddress: string,
  categoryData: EditCategoryParameters,
): Promise<boolean | Error> {
  const boardIndex = returnBoardIndexOrError(boardAddress, userID);
  const board = boards[boardIndex];

  const categoryIndex: number = board.categories.indexOf(
    categoryData.oldCategory,
  );

  if (categoryIndex === -1) throw new Error("Category not found.");

  board.categories[categoryIndex] = categoryData.newCategory;

  return true;
}

export async function editTasks(
  userID: string,
  boardAddress: string,
  tasksIDs: string[],
  tasksData: Task[],
): Promise<boolean | Error> {
  const boardIndex = returnBoardIndexOrError(boardAddress, userID);
  const board = boards[boardIndex];

  for (const [i, taskID] of tasksIDs.entries()) {
    const task = board.tasks!.find((t) => t.id === taskID);

    if (task) {
      Object.assign(task, tasksData[i]);
    }
  }

  return true;
}

export async function removeTask(
  userID: string,
  boardAddress: string,
  taskID: string,
): Promise<boolean | Error> {
  const boardIndex = returnBoardIndexOrError(boardAddress, userID);
  const board = boards[boardIndex];

  const task = board.tasks!.find((t) => t.id === taskID);

  if (!task) throw new Error("Task not found.");

  task.isActive = false;

  return true;
}

export async function removeCategory(
  userID: string,
  boardAddress: string,
  category: string,
): Promise<boolean | Error> {
  const boardIndex = returnBoardIndexOrError(boardAddress, userID);
  const board = boards[boardIndex];
  const index = board.categories.indexOf(category);

  if (index === -1) throw new Error("Category not found.");

  board.categories.splice(index, 1);

  return true;
}

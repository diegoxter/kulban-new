import type { Board, Task } from "../global";
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
      },
      {
        id: "2",
        title: "Test task 2",
        description: "Description 2",
        category: "cat 2",
        state: 2,
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
  const boardIndex = boards.findIndex(
    (b) =>
      b.address === boardAddress &&
      b.members.some(([memberID, isActive]) => memberID === userID && isActive),
  );

  if (boardIndex === -1) throw new Error("Board not found.");
  const categoryAlreadyExists: boolean =
    boards[boardIndex].categories.includes(newCategory);

  if (categoryAlreadyExists) throw new Error("Category already exists.");

  boards[boardIndex].categories.push(newCategory);

  return true;
}
//
//export async function createTasks(
//  userID: string,
//  boardAddress: string,
//  tasksData: Omit<Task, "id">[],
//): Promise<boolean | Error> {
//  try {
//    const board = returnBoardOrError(boardAddress, userID);
//
//    if (!board.tasks) {
//      board!.tasks = [];
//    }
//
//    const lastTask = board.tasks[board.tasks.length - 1];
//    let lastId = lastTask ? parseInt(lastTask.id, 10) : 0;
//
//    for (const taskData of tasksData) {
//      lastId++;
//
//      const newTask: Task = {
//        ...taskData,
//        id: lastId.toString(),
//      };
//
//      board.tasks.push(newTask);
//    }
//
//    return true;
//  } catch (error: unknown) {
//    if (error instanceof Error) {
//      return error; // Return the error if it's an instance of Error
//    }
//    return new Error("An unknown error occurred");
//  }
//}
//
//export async function editCategory(
//  userID: string,
//  boardAddress: string,
//  newCategory: string,
//): Promise<boolean | Error> {
//  try {
//    const board = returnBoardOrError(boardAddress, userID);
//
//    const categoryIndex: number = board.categories.indexOf(newCategory);
//
//    if (categoryIndex === -1) throw new Error("Category doesn't exists.");
//
//    board.categories[categoryIndex] = newCategory;
//
//    return true;
//  } catch (error: unknown) {
//    if (error instanceof Error) {
//      return error; // Return the error if it's an instance of Error
//    }
//    return new Error("An unknown error occurred");
//  }
//}

export async function editTasks(
  userID: string,
  boardAddress: string,
  tasksIDs: string[],
  tasksData: Task[],
): Promise<boolean | Error> {
  try {
    const board = returnBoardOrError(boardAddress, userID);

    for (const [i, taskID] of tasksIDs.entries()) {
      const task = board.tasks!.find((t) => t.id === taskID);

      if (task) {
        Object.assign(task, tasksData[i]);
      }
    }

    return true;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return error; // Return the error if it's an instance of Error
    }
    return new Error("An unknown error occurred");
  }
}

// TO DO removeTask (mark it as isActive: false)

//export async function removeCategory(
//  userID: string,
//  boardAddress: string,
//  category: string,
//): Promise<Boolean | Error> {
//  try {
//    const board = returnBoardOrError(boardAddress, userID);
//
//    const index = board.categories.indexOf(category);
//
//    if (index !== -1) {
//      board.categories.splice(index, 1);
//    }
//
//    return true;
//  } catch (error) {
//    if (error instanceof Error) {
//      return error;
//    }
//    return new Error("An unknown error occurred");
//  }
//}

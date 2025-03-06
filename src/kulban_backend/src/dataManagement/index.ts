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

export async function getBoardInfo(
  boardAddress: string,
  userID: string,
): Promise<Board | Error> {
  try {
    const board = boards.find(
      (b) =>
        b.address === boardAddress &&
        b.members.some(
          ([memberID, isActive]) => memberID === userID && isActive,
        ),
    );

    if (!board) throw new Error("Board not found.");

    return board;
  } catch (error) {
    if (error instanceof Error) {
      return error;
    }
    return new Error("An unknown error occurred");
  }
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
  try {
    boards.push(newBoard);

    return true;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return error; // Return the error if it's an instance of Error
    }
    return new Error("An unknown error occurred");
  }
}

export async function editTasks(
  userID: string,
  boardAddress: string,
  tasksIDs: string[],
  tasksData: Task[],
): Promise<boolean | Error> {
  try {
    const board = boards.find(
      (b) =>
        b.address === boardAddress &&
        b.members.some(
          ([memberID, isActive]) => memberID === userID && isActive,
        ),
    );

    for (const [i, taskID] of tasksIDs.entries()) {
      const task = board?.tasks?.find((t) => t.id === taskID);

      if (task) {
        Object.assign(task, tasksData[i]);
      } else {
        if (!board?.tasks) {
          board!.tasks = [];
        }
        const newTask: Task = {
          ...tasksData[i],
          id: taskID,
        };

        board?.tasks?.push(newTask);
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

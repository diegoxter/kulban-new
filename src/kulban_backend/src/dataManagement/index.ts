interface Board {
  address: string;
  name: string;
  categories: string[];
  activeTasksNumber: string;
  members: Array<[string, boolean]>;
}

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
  },

  {
    address: "678",
    name: "Test board 3",
    activeTasksNumber: "1n",
    categories: ["cat 1", "cat 2", "cat 3"],
    members: [],
  },
  {
    address: "91011",
    name: "Test board 4",
    activeTasksNumber: "1n",
    categories: ["cat 1", "cat 2", "cat 3"],
    members: [["usuario@example.com", false]],
  },
];

export async function getUserBoards(userID: string) {
  const userBoards = boards.filter((board) => {
    return board.members.some(
      ([memberID, isActive]) => memberID === userID && isActive,
    );
  });

  return userBoards;
}

export async function createBoards(
  newBoards: Board[],
): Promise<boolean | Error> {
  try {
    for (const newBoard of newBoards) {
      boards.push(newBoard);
    }

    return true;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return error; // Return the error if it's an instance of Error
    }
    return new Error("An unknown error occurred");
  }
}

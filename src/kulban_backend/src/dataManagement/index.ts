interface Board {
  address: string;
  name: string;
  members: string[];
}

const boards: Board[] = [
  {
    address: "123",
    name: "Test board 1",
    members: ["usuario@example.com"],
  },
  {
    address: "456",
    name: "Test board 2",
    members: [""],
  },

  {
    address: "678",
    name: "Test board 3",
    members: ["usuario@example.com"],
  },
  {
    address: "91011",
    name: "Test board 4",
    members: [""],
  },
];

export async function getUserBoards(userID: string) {
  console.log(userID);

  const userBoards = boards.filter((board) => {
    return board.members.includes(userID);
  });

  return userBoards;
}

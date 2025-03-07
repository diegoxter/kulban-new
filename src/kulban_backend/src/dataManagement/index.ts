import { ethers, type TransactionReceipt } from "ethers";
import type { Board, Task, EditCategoryParameters } from "../global";
import deployerABI from "./DeployerABI.json";
import kanbanProjectABI from "./KanbanProjectABI.json";
import { RPC_URL, PRIVATE_KEY, DEPLOYER_CONTRACT_ADDRESS } from "../config";

export async function getUserBoards(userID: string) {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signer = new ethers.Wallet(PRIVATE_KEY!, provider);
  const deployerContract = new ethers.Contract(
    DEPLOYER_CONTRACT_ADDRESS,
    deployerABI.abi,
    signer,
  );

  try {
    const userBoards: Board[] = [];
    const userBoardsAddresses: string[] =
      await deployerContract.getProjectsWhereIDIsViewer(userID);

    for (const boardAddress of userBoardsAddresses) {
      const _provider = new ethers.JsonRpcProvider(RPC_URL);
      const _signer = new ethers.Wallet(PRIVATE_KEY!, _provider);

      const kanbanProjectContract = new ethers.Contract(
        boardAddress,
        kanbanProjectABI.abi,
        _signer,
      );
      const boardInfo = await kanbanProjectContract.getProjectInfo();

      const board: Board = {
        address: boardAddress,
        name: boardInfo[0],
        categories: boardInfo[1],
        activeTasksNumber: (boardInfo[2] as bigint).toString(),
        members: boardInfo[3],
      };
      userBoards.push(board);
    }

    return userBoards;
  } catch (error) {
    throw new Error(`Couldnt get the boards: ${error}`);
  }
}

export async function getBoardInfo(boardAddress: string): Promise<Board> {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const kanbanProjectContract = new ethers.Contract(
    boardAddress,
    kanbanProjectABI.abi,
    provider,
  );

  try {
    const boardInfo = await kanbanProjectContract.getProjectInfo();

    const board: Board = {
      address: boardAddress,
      name: boardInfo[0],
      categories: boardInfo[1],
      activeTasksNumber: (boardInfo[2] as bigint).toString(),
      members: boardInfo[3],
    };

    const activeTasks = await kanbanProjectContract.getActiveTasks();
    console.log(activeTasks);

    return board;
  } catch (error) {
    throw new Error(`Couldnt get the boards: ${error}`);
  }
}

export async function createBoard(
  userID: string,
  newBoard: Board,
): Promise<boolean | Error> {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signer = new ethers.Wallet(PRIVATE_KEY!, provider);
  const deployerContract = new ethers.Contract(
    DEPLOYER_CONTRACT_ADDRESS,
    deployerABI.abi,
    signer,
  );

  try {
    const tx = await deployerContract.deployNew(
      newBoard.name,
      userID,
      newBoard.categories,
    );
    const receipt: TransactionReceipt = await tx.wait();
    console.log(receipt.status);
    return true;
  } catch (error) {
    throw new Error(`Couldnt create new board: ${error}`);
  }
}

export async function createCategory(
  boardAddress: string,
  newCategory: string,
): Promise<boolean> {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signer = new ethers.Wallet(PRIVATE_KEY!, provider);
  const kanbanProjectContract = new ethers.Contract(
    boardAddress,
    kanbanProjectABI.abi,
    signer,
  );

  try {
    const tx = await kanbanProjectContract.addCategory(newCategory);
    const receipt: TransactionReceipt = await tx.wait();
    console.log(receipt.status);

    return true;
  } catch (error) {
    throw new Error(`Couldnt add the new category: ${error}`);
  }
}

export async function createTasks(
  boardAddress: string,
  tasksData: Omit<Task, "id">[],
): Promise<boolean> {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signer = new ethers.Wallet(PRIVATE_KEY!, provider);
  const kanbanProjectContract = new ethers.Contract(
    boardAddress,
    kanbanProjectABI.abi,
    signer,
  );

  try {
    const tasksDescriptions = tasksData.map((task) => task.description);
    const tasksCategories = tasksData.map((task) => task.category);
    const tasksAssigneesIDs = tasksData.map((task) => task.assigneesIDs);
    const tasksAssigneesAddys = tasksData.map((task) => task.assigneesAddys);

    const tx = await kanbanProjectContract.batchAddTask(
      tasksDescriptions,
      tasksCategories,
      tasksAssigneesIDs,
      tasksAssigneesAddys,
    );
    const receipt: TransactionReceipt = await tx.wait();
    console.log(receipt.status);

    return true;
  } catch (error) {
    throw new Error(`Couldnt add the new category: ${error}`);
  }
}

export async function editCategory(
  boardAddress: string,
  categoryData: EditCategoryParameters,
): Promise<boolean | Error> {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signer = new ethers.Wallet(PRIVATE_KEY!, provider);
  const kanbanProjectContract = new ethers.Contract(
    boardAddress,
    kanbanProjectABI.abi,
    signer,
  );

  try {
    const tx = await kanbanProjectContract.editCategory(
      categoryData.categoryIndex,
      categoryData.newCategoryValue,
    );
    const receipt: TransactionReceipt = await tx.wait();
    console.log(receipt.status);

    return true;
  } catch (error) {
    throw new Error(`Couldnt add the new category: ${error}`);
  }
}

export async function editTasks(
  boardAddress: string,
  tasksIDs: number[],
  tasksData: Task[],
): Promise<boolean | Error> {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signer = new ethers.Wallet(PRIVATE_KEY!, provider);
  const kanbanProjectContract = new ethers.Contract(
    boardAddress,
    kanbanProjectABI.abi,
    signer,
  );

  try {
    const tx = await kanbanProjectContract.batchEditTasks(tasksIDs, tasksData);
    const receipt: TransactionReceipt = await tx.wait();
    console.log(receipt.status);

    return true;
  } catch (error) {
    throw new Error(`Couldnt add the new category: ${error}`);
  }
}

export async function removeTask(
  boardAddress: string,
  taskID: number,
): Promise<boolean | Error> {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signer = new ethers.Wallet(PRIVATE_KEY!, provider);
  const kanbanProjectContract = new ethers.Contract(
    boardAddress,
    kanbanProjectABI.abi,
    signer,
  );

  try {
    const tx = await kanbanProjectContract.deleteTask(taskID);
    const receipt: TransactionReceipt = await tx.wait();
    console.log(receipt.status);

    return true;
  } catch (error) {
    throw new Error(`Couldnt add the new category: ${error}`);
  }
}

export async function removeCategory(
  boardAddress: string,
  categoryIndex: number,
): Promise<boolean | Error> {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signer = new ethers.Wallet(PRIVATE_KEY!, provider);
  const kanbanProjectContract = new ethers.Contract(
    boardAddress,
    kanbanProjectABI.abi,
    signer,
  );

  try {
    const tx = await kanbanProjectContract.deleteCategory(categoryIndex);
    const receipt: TransactionReceipt = await tx.wait();
    console.log(receipt.status);

    return true;
  } catch (error) {
    throw new Error(`Couldnt add the new category: ${error}`);
  }
}

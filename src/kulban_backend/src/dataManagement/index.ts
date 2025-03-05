import { ethers } from "ethers";
import deployerABI from "./DeployerABI.json";
import kanbanProjectABI from "./KanbanProjectABI.json";
import { RPC_URL, PRIVATE_KEY, DEPLOYER_CONTRACT_ADDRESS } from "../config";

interface Board {
  address: string;
  name: string;
  categories: string[];
  activeTasksNumber: string;
  members: Array<[string, boolean]>;
}

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

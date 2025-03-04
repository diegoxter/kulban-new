import { ethers } from "ethers";
import { abi } from "./DeployerABI.json";
import { RPC_URL, PRIVATE_KEY, DEPLOYER_CONTRACT_ADDRESS } from "../config";

interface Board {
  address: string;
  name: string;
  members: string[];
}

export async function getUserBoards(userID: string) {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signer = new ethers.Wallet(PRIVATE_KEY!, provider);
  const contract = new ethers.Contract(DEPLOYER_CONTRACT_ADDRESS, abi, signer);

  console.log(userID);
  try {
    const userBoards: Board[] =
      await contract.getProjectsWhereCallerIsViewer(userID);

    console.log(userBoards);

    return userBoards;
  } catch (error) {
    throw new Error(`Couldnt login: ${error}`);
  }
}

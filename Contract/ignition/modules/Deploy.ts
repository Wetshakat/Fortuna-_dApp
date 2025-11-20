import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

const FortunaModule = buildModule("FortunaModule", (m) => {
  const vrfCoordinator = process.env.VRF_COORDINATOR;
  const keyHash = process.env.KEY_HASH;
  const subscriptionId = process.env.SUBSCRIPTION_ID;
  const callbackGasLimit = process.env.CALLBACK_GAS_LIMIT;
  const requestConfirmations = process.env.REQUEST_CONFIRMATIONS;
  const entryFee = process.env.ENTRY_FEE;
  const platformFeeBP = process.env.PLATFORM_FEE_BP;

  if (
    !vrfCoordinator ||
    !keyHash ||
    !subscriptionId ||
    !callbackGasLimit ||
    !requestConfirmations ||
    !entryFee ||
    !platformFeeBP
  ) {
    throw new Error("Missing environment variables for deployment");
  }

  const manager = m.contract("FortunaManager");

  const core = m.contract("FortunaCore", [
    manager,  // Changed from manager.address to manager
    ethers.parseEther(entryFee),
    platformFeeBP,
    vrfCoordinator,
    keyHash,
    subscriptionId,
    callbackGasLimit,
    requestConfirmations,
  ]);

  m.call(manager, "setCore", [core]);

  return { manager, core };
});

export default FortunaModule;
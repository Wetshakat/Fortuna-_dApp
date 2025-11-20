import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("FortunaVRFModule", (m) => {
  const roundId = m.getParameter("roundId");
  const entryFee = m.getParameter("entryFee");
  const startTimestamp = m.getParameter("startTimestamp");
  const managerAddress = m.getParameter("managerAddress");
  const coreAddress = m.getParameter("coreAddress");
  const vrfCoordinator = m.getParameter("vrfCoordinator");
  const keyHash = m.getParameter("keyHash");
  const subscriptionId = m.getParameter("subscriptionId");
  const callbackGasLimit = m.getParameter("callbackGasLimit");
  const requestConfirmations = m.getParameter("requestConfirmations");

  // Deploy the VRF round
  const vrfRound = m.contract("FortunaVRF", [
    roundId,
    entryFee,
    startTimestamp,
    managerAddress,
    coreAddress,
    vrfCoordinator,
    keyHash,
    subscriptionId,
    callbackGasLimit,
    requestConfirmations
  ]);

  return { vrfRound };
});

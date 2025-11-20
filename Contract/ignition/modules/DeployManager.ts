import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("FortunaManagerModule", (m) => {
  // Deploy the manager
  const manager = m.contract("FortunaManager");

  // Simply return it; other modules can use `FortunaManagerModule.manager`
  return { manager };
});

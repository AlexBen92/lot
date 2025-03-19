import { ethers } from "hardhat";

async function main() {
  const LuckyBlock = await ethers.getContractFactory("LuckyBlock");
  const luckyBlock = await LuckyBlock.deploy();

  await luckyBlock.waitForDeployment();

  console.log("LuckyBlock deployed to:", await luckyBlock.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
import { ethers, upgrades } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const dlpDeploy = await upgrades.upgradeProxy(
		"0x19542Fd5339F3eF3376F3Bd15518401989a15b57",
		await ethers.getContractFactory("DataLiquidityPool"),
	);

	console.log("DataLiquidityPool upgraded");
};

export default func;
func.tags = ["DLPUpgrade"];

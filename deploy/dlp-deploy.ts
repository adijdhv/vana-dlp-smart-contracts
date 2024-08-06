import { ethers, upgrades } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { parseEther } from "ethers";
import { env } from "process";
import { getCurrentBlockNumber } from "../utils/timeAndBlockManipulation";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const [deployer] = await ethers.getSigners();

	const dlpName = "Test Data Liquidity Pool";//process.env.DLP_NAME ?? "Custom Data Liquidity Pool";
	const ownerAddress = '0x4eA138B68d15526792491ce79E1Be13c763A9d6A';//process.env.OWNER_ADDRESS ?? deployer.address;

	const tokenName = 'Test Data Autonomy Token';//process.env.DLP_TOKEN_NAME ?? "Custom Data Autonomy Token";
	const tokenSymbol = 'TESTDAT'// process.env.DLP_TOKEN_SYMBOL ?? "CUSTOMDAT";

	const dlptDeploy = await ethers.deployContract("DLPT", [tokenName, tokenSymbol, deployer]);
	const dlpt = await ethers.getContractAt("DLPT", dlptDeploy.target);

	console.log("DataLiquidityPoolToken deployed at:", dlptDeploy.target);

	const maxNumberOfValidators = 3;
	const validatorScoreMinTrust = parseEther('0.1');
	const validatorScoreKappa = parseEther('0.5');
	const validatorScoreRho = parseEther('1');
	const validationPeriod = 120;
	const rewardPeriodSize = 1800;
	const minStakeAmount  = parseEther('7');
	const startBlock: number = await getCurrentBlockNumber();
	const rewardAmount = parseEther('10');
	const fileRewardFactor = parseEther('5');
	const fileRewardDelay = 3600 * 24 * 3;

	const dlpDeploy = await upgrades.deployProxy(
		await ethers.getContractFactory("DataLiquidityPool"),
		[{
			name: dlpName,
			ownerAddress: deployer.address,
			tokenAddress: dlptDeploy.target,
			newMaxNumberOfValidators: maxNumberOfValidators,
			newValidatorScoreMinTrust: validatorScoreMinTrust,
			newValidatorScoreKappa: validatorScoreKappa,
			newValidatorScoreRho: validatorScoreRho,
			newValidationPeriod: validationPeriod,
			newMinStakeAmount: minStakeAmount,
			startBlock: startBlock,
			newEpochSize: rewardPeriodSize,
			newEpochRewardAmount: rewardAmount,
			newFileRewardFactor: fileRewardFactor,
			newFileRewardDelay: fileRewardDelay
		}],
		{
			kind: "uups"
		}
	);
	const dlp = await ethers.getContractAt("DataLiquidityPool", dlpDeploy.target);

	console.log(`DataLiquidityPool "${dlpName}" deployed at:`, dlp.target);

	await new Promise((resolve) => setTimeout(resolve, 10000));
	console.log("Deployer address: ",deployer.address)
	await dlpt.connect(deployer).mint(deployer.address, parseEther('1000000000000000'));
	console.log("Minted")
	await dlpt.connect(deployer).approve(dlp, parseEther('30000000'));
	console.log("approved")

	await dlp.connect(deployer).addRewardForValidators(parseEther('2000000'));
	console.log("rewards to validators")

	await dlp.connect(deployer).addRewardsForContributors(parseEther('1000000'));
	console.log("rewards to contributed")

	await dlpt.connect(deployer).transfer(ownerAddress, parseEther('7000000'));
	console.log("Transfered 700000")


	await dlpt.transferOwnership(ownerAddress);
	console.log("DLP Token ownerShip transfered")

	await dlp.transferOwnership(ownerAddress);
	console.log("DLP Ownership Transfered")

};

export default func;
func.tags = ["DLPDeploy"];

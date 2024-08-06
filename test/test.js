let dlpabi = require('../abi/dlpabi.json');
const { expect } = require("chai");
const { ethers } = require("hardhat");
const hre = require("hardhat");
 
let Contract;
let dlpContract;
let owner;
let addr1;
let addr2;


describe("DataLiquidityPool", async function () {
  //let dlpContract = ;


  before(async function () {
    //  await hre.network.provider.request({
    //   method: "hardhat_reset",
    //   params: [
    //     {
    //       forking: {
    //         url: "https://api.satori.vanascan.io/api", // replace with the actual RPC URL of the VANA network
    //        // blockNumber: 123456 // optionally specify the block number
    //       }
    //     }
    //   ]
    });

    Contract = await ethers.getContractFactory("DataLiquidityPool");

   // console.log("DLP CONTRACT  :" ,dlpContract)

  });

  describe("registerKeys", async function () {
    
     
    it("Should register a valid key", async function () {
      const validKey = "0x" + "a".repeat(130); 
      await dlpContract.connect(owner).registerKeys(validKey);
      const storedKey = await dlpContract.signingKey(validKey);
      expect(storedKey).to.equal(owner.address);
      const contributor = await dlpContract._contributorInfo(owner.address);
      expect(contributor.signingKey).to.equal(validKey);

    });

    it("Should fail if the key length is not 65 bytes", async function () {

      const invalidKey = "0x" + "a".repeat(128);  
      await expect(dlpContract.connect(owner).registerKeys(invalidKey)).to.be.revertedWith("not a valid key");

    });

    it("Should fail if the key already exists", async function () {

      const validKey = "0x" + "a".repeat(130);  
      await dlpContract.connect(owner).registerKeys(validKey);
      await expect(dlpContract.connect(owner).registerKeys(validKey)).to.be.revertedWith("Key already exists");

    });

  });


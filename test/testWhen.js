const { Web3 } = require('web3');
 
const privateKey = ''
const fromAddress = '0x4eA138B68d15526792491ce79E1Be13c763A9d6A'
const dlpabi = require('../abi/dlpabi.json');
const web3 = new Web3('http://rpc.satori.vana.org');


const contractAddress = '0x19542Fd5339F3eF3376F3Bd15518401989a15b57';
const contract =  new web3.eth.Contract(dlpabi, contractAddress);
 
const tokenABI = require('../abi/token.json')
const tokenAddress = '0xA7cf0cE3dab9E9e33d12eEC3faF649d9cF643Cb9'
const token =  new web3.eth.Contract(tokenABI, tokenAddress);


const signingKey = "xNqJeW84Z15HTuP2vR6aB1Ym7tCsW9PkXzpF0D3gM8oJrQ2K5bL3q7VyHz8UnR470";
console.log("LENGTH OF SIGNING KEY",signingKey.length);
const buffer = Buffer.from(signingKey, 'utf8');

 const byteLength = buffer.length;

console.log("Byte length of signingKey:", byteLength);
 
 
async function approveTokens(spender, amount) {
        const data = token.methods.approve(spender, amount).encodeABI();
        const nonce = await web3.eth.getTransactionCount(fromAddress, 'latest');
        const gasLimit = await token.methods.approve(spender, amount).estimateGas({ from: fromAddress });
        const gasPrice = await web3.eth.getGasPrice();
    
        const tx = {
            from: fromAddress,
            to: tokenAddress,
            gas: gasLimit,
            gasPrice: gasPrice,
            nonce: nonce,
            data: data
        };
    
        const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
        return web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    }
    
     async function registerKeys(signingKey) {
        const data = contract.methods.registerKeys(signingKey).encodeABI();
        const nonce = await web3.eth.getTransactionCount(fromAddress, 'latest');
        const gasLimit = await contract.methods.registerKeys(signingKey).estimateGas({ from: fromAddress });
        const gasPrice = await web3.eth.getGasPrice();
    
        const tx = {
            from: fromAddress,
            to: contractAddress,
            gas: gasLimit,
            gasPrice: gasPrice,
            nonce: nonce,
            data: data
        };
    
        const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
        return web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    }
    
     async function registerValidator(validatorAddress, validatorOwnerAddress, stakeAmount) {
        const data = contract.methods.registerValidator(validatorAddress, validatorOwnerAddress, stakeAmount).encodeABI();
        const nonce = await web3.eth.getTransactionCount(fromAddress, 'latest');
        const gasLimit = await contract.methods.registerValidator(validatorAddress, validatorOwnerAddress, stakeAmount).estimateGas({ from: fromAddress });
        const gasPrice = await web3.eth.getGasPrice();
    
        const tx = {
            from: fromAddress,
            to: contractAddress,
            gas: gasLimit,
            gasPrice: gasPrice,
            nonce: nonce,
            data: data
        };
        const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
        return web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    }
    
     async function addFile(url, encryptedKey) {
        const data = contract.methods.addFile(url, encryptedKey).encodeABI();
        const nonce = await web3.eth.getTransactionCount(fromAddress, 'latest');
        const gasLimit = await contract.methods.addFile(url, encryptedKey).estimateGas({ from: fromAddress });
        const gasPrice = await web3.eth.getGasPrice();
    
        const tx = {
            from: fromAddress,
            to: contractAddress,
            gas: gasLimit,
            gasPrice: gasPrice,
            nonce: nonce,
            data: data
        };
    
        const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
        return web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    }
    
     async function verifyFile(fileId, valid, score, authenticity, ownership, quality, uniqueness) {
        const data = contract.methods.verifyFile(fileId, valid, score, authenticity, ownership, quality, uniqueness).encodeABI();
        const nonce = await web3.eth.getTransactionCount(fromAddress, 'latest');
        const gasLimit = await contract.methods.verifyFile(fileId, valid, score, authenticity, ownership, quality, uniqueness).estimateGas({ from: fromAddress });
        const gasPrice = await web3.eth.getGasPrice();
    
        const tx = {
            from: fromAddress,
            to: contractAddress,
            gas: gasLimit,
            gasPrice: gasPrice,
            nonce: nonce,
            data: data
        };
    
        const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
        return web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    }
    
     async function main() {
        try {
             const stakeAmount = web3.utils.toWei('10', 'ether');
            await approveTokens(contractAddress, stakeAmount);
            console.log("TOKENS APPROVED ");

    
              
            //await registerKeys(signingKey);
            console.log("KEsy Registered");

    
             const validatorAddress = "0x4eA138B68d15526792491ce79E1Be13c763A9d6A";  
            const validatorOwnerAddress = fromAddress;  
           // await registerValidator(validatorAddress, validatorOwnerAddress, stakeAmount);
            console.log("Validator Registered");

             const url = "QmMtYj2KtZK8uR3YX3mT3T64hypjtP35";  
                
            const encryptedKey = "omVtYj2KtZK8uR3YX3mT3T6JhybjtP3wJYXb3TbZQb58";
            await addFile(url, encryptedKey);
            console.log("File Added");

            const fileId = 5;  
            const valid = true;  
            const score = 0; 
            const authenticity = 0;  
            const ownership = 0;  
            const quality = 0;  
            const uniqueness = 0;  
            await verifyFile(fileId, valid, score, authenticity, ownership, quality, uniqueness);
            console.log("File Verified");
            console.log('All transactions completed successfully.');
        } catch (error) {
            console.error('Error:', error);
        }
    }
    
    main();
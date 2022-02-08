//import soliditySha3, keccak256, web3.eth(rinkeby), web3-utils
//let data = keccak256(abi.encodePacked(_value, _to, _nonce)
//web3.eth.accounts.sign(data, privateKey);

//const leaf = keccak256('0x1CA510447B07DcF686339Ea6E647DC8049CdFf2f')

//-------------------------IMPORTS-------------------------------------------------------------------------------------
const Web3 = require("web3");
const { soliditySha3 } = require("web3-utils");
const keccak256 = require("keccak256");
require("dotenv").config();


//-------------------------ASSIGNMENT-----------------------------------------------------------------------------------
const { PRIVATE_KEY, INFURA_API_KEY, WALLET_ADDRESS } = process.env;
const tokenAddress = "0x574E0117a8c7B9b678c67061BB8528A3b932Ac7e";
const EthBridgeAddress = "";
let contractABI, signature, keccakeHashed;
let maxUint256 = "115792089237316195423570985008687907853269984665640564039457584007913129639935";
const web3 = new Web3(new Web3.providers.HttpProvider(`https://rinkeby.infura.io/v3/${INFURA_API_KEY}`));

    
//-------------------------INITIALIZATION--------------------------------------------------------------------------------
async function main() {
    const { data } = await axios.get(`https://api-rinkeby.etherscan.io/api?moduleN=contract&action=getabi&address=${tokenAddress}`);
    if (data.result) contractABI = JSON.parse(data.result);
    const tokenInstance = new web3.eth.Contract(contractABI, tokenAddress);
    web3.eth.accounts.wallet.add(`${PRIVATE_KEY}`);
    let transactionObject = {
        from: WALLET_ADDRESS,
        gasPrice: 83000000000, // Something price like this
        gas: 314159,
        to: tokenAddress,
        value: 0,
        nonce: 70,
    };
    transactionObject.nonce = await web3.eth.getTransactionCount(`${WALLET_ADDRESS}`, "latest"); // nonce starts counting from 0

    
    //------------------------- SIGNATURE --------------------------------------------------------------------------------------
    // (amount, to, nonce) equales to keccak256 solidity
    keccakeHashed = soliditySha3("100", "0x1CA510447B07DcF686339Ea6E647DC8049CdFf2f", 100);
    signature = await web3.eth.accounts.sign(keccakeHashed, PRIVATE_KEY);
    console.log("signature -----> ", signature);




    // --------------------- GIVE APPROVAL OF TOKEN TO BRIDGE --------------------------------------------------------------------

    //BALANCE
    const balanceOf = await tokenInstance.methods.balanceOf(`${WALLET_ADDRESS}`).call();
    console.log(balanceOf);

    //APPROVAL
    transactionObject.to = EthBridgeAddress;
    const result = await tokenInstance.methods
        .approve(EthBridgeAddress, maxUint256)
        .send(transactionObject, (err, data) => console.log(err, data));
    console.log("approve", result.events.Approval.raw);
    transactionObject.nonce = await web3.eth.getTransactionCount(`${WALLET_ADDRESS}`, "latest");
    return {
        signature,
        keccakeHashed,
        balanceOf,
    }
}


(async () => {
    try {
        const res = await main();
        console.log(res);
    } catch (error) {
        console.log("ERROR", error);
    }
})();

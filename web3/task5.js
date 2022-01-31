// const getConfig = require("./config");
require("dotenv").config();
const prompt = require('prompt');
const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider(`https://rinkeby.infura.io/v3/${process.env.INFURA_ACCESS_TOKEN}`));

async function getTransactionReceipt(txHash) {
    const transactionResponse = await web3.eth.getTransactionReceipt(txHash)
    if(transactionResponse == undefined) return "Transaction not found or wrong network"
    if(!transactionResponse?.status) {
        return {
            transactionFee:undefined,
            ...transactionResponse
        } 
    }
    console.log(await web3.eth.getGasPrice());
    let txFees = await web3.eth.getGasPrice() * transactionResponse.gasUsed;
    return {

        transactionFee: txFees /1e18,
        ...transactionResponse
    } 

    // return transactionResponse;
}

async function main(txHash="0x132fbca7a712903275de4b46b4ee7cbed82c9c99c29d8fb26743aa3f4e77b77b", isNode=true) {
    //Create a function that takes tx-hash as input and outputs whether the transaction is confirmed or failed, if confirmed display the amount of tx_fees incurred 
    
    // let { 
    //     error,
    //     web3Eth,
    //     ...restConfig
    // } = await  getConfig();


    let option;
    if(isNode) {
        console.log("do you continue with the default transaction Hash '0x132fbca7a712903275de4b46b4ee7cbed82c9c99c29d8fb26743aa3f4e77b77b'? (y/n)");
        prompt.start();
        prompt.get(['option'], async function (error, result) {
            if (error) return console.log(error)
            option = result.option;

            if(option === "n") {
                console.log("enter the transaction hash");
                prompt.get(["txHash"], async function (error, result) {
                    if (error) return console.log(error)
                    
                    console.log('Command-line input received:');
                    console.log('  txHash: ' + result.txHash);
                    txHash= result.txHash

                    // const transactionResponse = await web3.eth.getTransactionReceipt(txHash)
                    const res  = await getTransactionReceipt(txHash)
                    console.log(res);
                    
                });
            }
            else {
                const res  = await getTransactionReceipt(txHash)
                console.log(res);
            }
            
            
            
        });
    } else {
        const res  = await getTransactionReceipt(txHash)
        console.log(res);
    }
    //takes tx-hash as input and outputs whether the transaction is confirmed or failed, if confirmed display the amount of tx_fees incurred.
    
}
(async function () {
   try {
       const res = await main();
   } catch (error) {
       console.log(error);
   } 
})()
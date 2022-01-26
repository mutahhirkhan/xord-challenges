const getConfig = require("./config");

let { 
    contractInstance, 
    amountToSend, 
    account, 
    EthereumTx, 
    web3, 
    web3Eth, 
    contract, 
    accountPrivateKey,
    transactionObject, 
    ...restConfig
} = getConfig();

const updateNonce = async () =>  await web3.eth.getTransactionCount(account, 'latest'); // nonce starts counting from 0

const main = async () => {
    const res = web3Eth.accounts.wallet.add(accountPrivateKey);
    transactionObject.nonce = await web3.eth.getTransactionCount(account, 'latest'); // nonce starts counting from 0
    
    //MINT
    // const minted = await contractInstance.methods._mint(account, "100").send(transactionObject,(err, data) => console.log(err, data));
    // console.log("minted", minted);
    // transactionObject.nonce = await updateNonce();
    
    
    //BALANCE
    const balanceOf = await contractInstance.methods.balanceOf(account).call();
    console.log(balanceOf);
    
    // // //TRANSFER
    // const result = await contractInstance.methods.transfer(account,"50").send(transactionObject,(err, data) => console.log(err, data));
    // console.log("transfer",result.events.Transfer.raw);
    // transactionObject.nonce = await updateNonce();
    
    // // //APPROVE
    // const result = await contractInstance.methods.approve(restConfig.secondaryWallet,"50").send(transactionObject,(err, data) => console.log(err, data));
    // console.log("approve",result.events.Approval.raw);
    // transactionObject.nonce = await updateNonce();

    // // //TRANSFER FROM
    // const result = await contractInstance.methods.transferFrom(account, restConfig.secondaryWallet, "50").send(transactionObject,(err, data) => console.log(err, data));
    // console.log("TransferFrom",result);
    // transactionObject.nonce = await updateNonce();

    // // //ALLOWANCE
    const result = await contractInstance.methods.allowance(account, restConfig.secondaryWallet).call();
    console.log("Allowance",result);
    transactionObject.nonce = await updateNonce();

};

(async function () {
    try {
        const res = await main();
        console.log("res", res);
        // process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
})();

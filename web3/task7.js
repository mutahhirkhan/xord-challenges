const getConfig = require("./config");

const updateNonce = async (web3Eth, account) => await web3Eth.getTransactionCount(account, "latest"); // nonce starts counting from 0

const speedUpTransaction = async (transactionObject, web3Eth) => {
    try {
        // transactionObject.gasPrice = await web3Eth.getGasPrice();
        transactionObject.gas = transactionObject.gas * 3;
        console.log(transactionObject, "transaction object");
        const receipt = await web3Eth.sendTransaction(transactionObject, (err, res) => console.log(err, res, "speedup"));
        console.log("resciept", receipt);
        return receipt;
    } catch (error) {
        console.log(error);
    }
};

async function main() {
    try {
        //script to send a transaction with a very low gas price and then create a script to speed up or cancel that transaction
        let {
            error,
            web3Eth,
            secondaryWallet,
            transactionObject,
            contractInstance,
            web3,
            contract,
            accountPrivateKey,
            account,
            ...restConfig
        } = await getConfig();
        if (error) return restConfig.log(error.red);

        const res = web3Eth.accounts.wallet.add(accountPrivateKey);
        transactionObject.gasPrice = parseInt((await web3Eth.getGasPrice()))

        // const minted = await contractInstance.methods._mint(account, "100").send(transactionObject,(err, data) => console.log(err, data));

        const tx = contractInstance.methods._mint(account, "100");
        const gas = await tx.estimateGas({ from: account });
        const data = tx.encodeABI();

        transactionObject.nonce = await updateNonce(web3Eth, account);
        transactionObject.gas = parseInt(gas / 2);
        transactionObject.data = data;
        // transactionObject.chain = "rinkeby";
        // transactionObject.hardfork = "petersburg";
        // transactionObject.chainId = web3.utils.toHex(4);
        //set transactionObject.to and transactionObject.from
        transactionObject.to = contract;
        transactionObject.from = account;

        console.log(transactionObject, "transaction object");

        //BALANCE
        const oldBalance = await contractInstance.methods.balanceOf(account).call();
        console.log("old balance: ", oldBalance);

        web3Eth.sendTransaction(   transactionObject).then((err, res) => console.log(err,res,"low gas transaction"));
        const speedupResponse = await speedUpTransaction(transactionObject, web3Eth);
        console.log("speedupResponse", speedupResponse);
        //BALANCE
        const newBalance = await contractInstance.methods.balanceOf(account).call();
        console.log("---------------------\nnew balance: ", newBalance);
    } catch (error) {
        console.log(error);
    }
}

(async function () {
    try {
        const res = await main();
        console.log(res);
        process.exit(0);
    } catch (error) {
        console.log(error);
    }
})();

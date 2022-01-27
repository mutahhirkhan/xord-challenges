require("dotenv").config();
const { default: axios } = require("axios");
const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider(`https://rinkeby.infura.io/${process.env.INFURA_ACCESS_TOKEN}`));

const config = async (contractAddress = "", amount = 0) => {
    try {
    const contract = contractAddress ? contractAddress : "0x574E0117a8c7B9b678c67061BB8528A3b932Ac7e";
    const {data} = await axios.get(`https://api-rinkeby.etherscan.io/api?module=contract&action=getabi&address=${contract}`);
    const abiResult = JSON.parse(data.result);

        if(abiResult === "Contract source code not verified")  {
            return {
                error: abiResult, 
                log: require("ololog").configure({ time: true }),
                ansi: require("ansicolor").nice,
            } 
        }
        return {
            abi:abiResult,
            contract,
            web3,
            web3Eth: web3.eth,
            axios,
            EthereumTx: require("ethereumjs-tx"),
            log: require("ololog").configure({ time: true }),
            ansi: require("ansicolor").nice,
            accountPrivateKey:process.env.WALLET_PRIVATE_KEY,
            account: (web3.eth.defaultAccount = process.env.WALLET_ADDRESS),
            amountToSend: !amount ? 0.001 : amount,
            contractInstance: new web3.eth.Contract(abiResult, contract),
            secondaryWallet: process.env.DESTINATION_WALLET_ADDRESS,
            transactionObject : {
                from: process.env.WALLET_ADDRESS,
                gasPrice: 10000000000, // Something price like this
                gas: 314159,
                to: contract,
                value:0,
                nonce:70,
            }
        };
    } catch (error) {
        console.log(error);
        return {};
    }
};
module.exports = config;
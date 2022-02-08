require("dotenv").config();
const ansi = require ('colors')
const { default: axios } = require("axios");
const Web3 = require("web3");
//import all from process.env
const { INFURA_ACCESS_TOKEN, WALLET_ADDRESS, WALLET_PRIVATE_KEY, DESTINATION_WALLET_ADDRESS} = process.env;

const web3 = new Web3(new Web3.providers.HttpProvider(`https://rinkeby.infura.io/v3/${INFURA_ACCESS_TOKEN}`));
const webSocketWeb3 = new Web3(new Web3.providers.WebsocketProvider(`wss://mainnet.infura.io/ws/v3/${INFURA_ACCESS_TOKEN}`));
const web3Mainnet = new Web3(new Web3.providers.HttpProvider(`https://mainnet.infura.io/v3/${INFURA_ACCESS_TOKEN}`));

const config = async (contractAddress = "", isMainnet=false, amount = 0) => {
    try {
    const contract = contractAddress ? contractAddress : "0x574E0117a8c7B9b678c67061BB8528A3b932Ac7e";
    let putRinkeby = isMainnet ? "" : "-rinkeby";
    const {data} = await axios.get(`https://api${putRinkeby}.etherscan.io/api?module=contract&action=getabi&address=${contract}`);
    let abiResult ; 
    if(data.result) abiResult = JSON.parse(data.result);

        if(abiResult === "Contract source code not verified")  {
            return {
                error: abiResult, 
                log: require("ololog").configure({ time: true }),
                ansi,
            } 
        }
        return {
            abi:abiResult,
            contract,
            web3,
            web3Mainnet,
            web3Eth: web3.eth,
            axios,
            webSocketWeb3Eth: webSocketWeb3.eth,
            EthereumTx: require("ethereumjs-tx"),
            log: require("ololog").configure({ time: true }),
            ansi,
            accountPrivateKey:`${WALLET_PRIVATE_KEY}`,
            account: (web3.eth.defaultAccount = `${WALLET_ADDRESS}`),
            amountToSend: !amount ? 0.001 : amount,
            contractInstance: new web3.eth.Contract(abiResult, contract),
            secondaryWallet: `${DESTINATION_WALLET_ADDRESS}`,
            etherscanAPiToken: process.env.ETHERSCAN_API_TOKEN,
            transactionObject : {
                from: `${WALLET_ADDRESS}`,
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

// const { default: axios } = require("axios");
// const abiDecoder = require("abi-decoder"); // NodeJS
const Web3 = require("web3");
const BlockTracker = require("@zippie/eth-block-tracker");
const HttpProvider = require("ethjs-provider-http");
const { abi } = require("./abi.json");
import {INFURA_ACCESS_TOKEN} from "./secret.js";

const providerString = `https://mainnet.infura.io/v3/${INFURA_ACCESS_TOKEN}`;
const polygonString = `https://polygon-mainnet.infura.io/v3/${INFURA_ACCESS_TOKEN}`;
const auroraString = `https://aurora-mainnet.infura.io/v3/${INFURA_ACCESS_TOKEN}`;

const web3Mainnet = new Web3(new Web3.providers.HttpProvider(providerString));
const web3Polygon = new Web3(new Web3.providers.HttpProvider(polygonString));
const web3Aurora = new Web3(new Web3.providers.HttpProvider(auroraString));

const provider = new HttpProvider(providerString);
const blockTracker = new BlockTracker({ provider });

const polygonProvider = new HttpProvider(polygonString);
const polygonBlockTracker = new BlockTracker({ provider: polygonProvider });

const auroraProvider = new HttpProvider(auroraString);
const auroraBlockTracker = new BlockTracker({ provider: auroraProvider });

function wait(time) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, time);
	});
}

let tokens = [
	"0x37C997B35C619C21323F3518B9357914E8B99525", //PILOT
	"0xdAC17F958D2ee523a2206206994597C13D831ec7", //USDT
	"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", //USDC
	"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", //WETH
	"0xba100000625a3754423978a60c9317c58a424e3D", //BAL
	"0x6B175474E89094C44Da98b954EedeAC495271d0F", //DAI
	"0x3845badAde8e6dFF049820680d1F14bD3903a5d0", //SAND
	"0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c", //ENJ
	"0x793786e2dd4Cc492ed366a94B88a3Ff9ba5E7546", //AXIA
	//ETH
];
let accounts = [
	"0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", //VITALIK
	"0xf0D514945fbC2008aA6B65319aee4410dE62fC4A", //ALPHANOVA
	"0x4E5B2e1dc63F6b91cb6Cd759936495434C7e972F", //FIXEDFLOAT
	"0x6887246668a3b87F54DeB3b94Ba47a6f63F32985", //OPTIMISM_SEQUENCER
];


const normalizeBlockTransactions = async (newBlock, web3) => {
	try {
		console.log("block nunmber", +newBlock.number);
		console.log("transactions length", newBlock.transactions.length);
		newBlock.transactions.forEach((tx) => {
			if (!tx.to || !tx.from) {
				console.log("invalid entries", tx.hash);
			}
		});
		let tokenSpecificTx = newBlock.transactions.filter((tx) =>
			tokens.some((tok) => web3.utils.isAddress(tx.to) && tok === web3.utils.toChecksumAddress(tx.to))
		);

		console.log("token specific", tokenSpecificTx.length);
		let ercBalances = {};
		let ethBalances = []
        let contractInstance;

		let uniqueTokensOnly = tokenSpecificTx.filter((tx, i, arr) => arr.findIndex((tx2) => tx2.to === tx.to) === i);

		uniqueTokensOnly.forEach(async (tok) => {
			contractInstance = new web3.eth.Contract(abi, tok.to);
			accounts.forEach((ac) => {
				if (ercBalances[`${tok.to}`] === undefined) {
					ercBalances[`${tok.to}`] = [];
				}
				ercBalances[`${tok.to}`].push(contractInstance.methods.balanceOf(ac).call());
			});
			let respose = await Promise.all(ercBalances[`${tok.to}`]);
			ercBalances[`${tok.to}`] = respose;
            
		});
        // accounts.forEach(ac => ethBalances.push(web3.utils.fromWei(web3.eth.getBalance(ac))))
        accounts.forEach(ac => ethBalances.push(web3.eth.getBalance(ac)))
        ethBalances = await Promise.all(ethBalances)
		await wait(1500);
        console.log('eth balances',ethBalances);
		console.log(ercBalances);
		console.log("==================");
	} catch (error) {
		console.log(error);
	}
};

blockTracker.on("block", (newBlock) => normalizeBlockTransactions(newBlock, web3Mainnet));
blockTracker.start();

polygonBlockTracker.on("block", (newBlock) => normalizeBlockTransactions(newBlock, web3Aurora));
polygonBlockTracker.start();

auroraBlockTracker.on("block", (newBlock) => normalizeBlockTransactions(newBlock, web3Polygon));
auroraBlockTracker.start();

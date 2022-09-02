var Web3 = require("web3");
const { abi } = require("./abi.json");
const BigNumber = require('bignumber.js');
import {INFURA_ACCESS_TOKEN} from "./secret.js";

var web3 = new Web3(
  `wss://rinkeby.infura.io/ws/v3/${INFURA_ACCESS_TOKEN}`
    // "wss://mainnet.infura.io/ws/v3/84842078b09946638c03157f83405213"
);
console.log("Initiated");
let tokenHistory = {};
let contractAbiCache = {};

function formatAddress(data) {
    var step1 = web3.utils.hexToBytes(data);
    for (var i = 0; i < step1.length; i++)
      if (step1[0] == 0) step1.splice(0, 1);
    return web3.utils.bytesToHex(step1);
}

async function collectData(contract) {
    try {
        const [decimals, symbol] = await Promise.all([
            contract.methods.decimals().call(),
            contract.methods.symbol().call()
        ]);
        return { decimals, symbol };
    } catch (error) {
        return {error}
    }
}

// get all trasfer events's transaction from now. 
// Track all the token transactions in whole blockchain
var subscription = web3.eth
  .subscribe(
    "logs",
    {
      fromBlock: 1,
    //   address: "0xdaB169607D9d487a0435EE9d320F89cF37b6DC7F",
      topics: [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
      ],
    },
    function () {}
  )
  .on("data", async function (transactionData) {
    const {address, transactionHash, data, topics, ...restProps } = transactionData;
   
    //if topics length is 4 then erc721, if topics length is 3 then erc20
    if (contractAbiCache[address]) {
        const {contractInstance, decimals, symbol} = contractAbiCache[address]
     
        //extract the token contract decimals and represent into unit e.g. 6 or 9 or 18 decimals
        const unit = Object.keys(web3.utils.unitMap).find(
            key => web3.utils.unitMap[key] === web3.utils.toBN(10).pow(web3.utils.toBN(decimals)).toString());
        
        let from = formatAddress(topics["1"]);
        let to = formatAddress(topics["2"]);

        //convert hex data to number then 
        //convert that wei amount into eth representation
        let etherAmount = web3.utils.fromWei(web3.utils.hexToNumberString(data), unit)
        let BNumber = BigNumber(etherAmount);
        
        //nested object destructing, data model is mentioned below
        let toUserAmount = tokenHistory[address]?.[to];
        let fromUserAmount = tokenHistory[address]?.[from];

        // write token transfer history
        tokenHistory[address] = {
            ...tokenHistory[address],
            [from]: fromUserAmount ? fromUserAmount.minus( BNumber) : BigNumber(0).minus(BNumber),
            [to]: toUserAmount ? toUserAmount.plus(BNumber) : BigNumber(0).plus(BNumber),
        }
    }
    else {
        let contractInstance = new web3.eth.Contract(abi, address);
        const {decimals, symbol, error} = await collectData(contractInstance)

        //if token contract doesn't have decimal and symbol function then dont count on this contract.
        if(error) return;
        contractAbiCache[address] = {contractInstance, decimals, symbol};

        //extract the token contract decimals and represent into unit e.g. 6 or 9 or 18 decimals
        const unit = Object.keys(web3.utils.unitMap).find(
            key => web3.utils.unitMap[key] === web3.utils.toBN(10).pow(web3.utils.toBN(decimals)).toString());
        
        let from = formatAddress(topics["1"]);
        let to = formatAddress(topics["2"]);

        //convert hex data to number then 
        //convert that wei amount into eth representation
        let etherAmount = web3.utils.fromWei(web3.utils.hexToNumberString(data), unit)
        let BNumber = BigNumber(etherAmount);
        
        
        //nested object destructing, data model is mentioned below
        let toUserAmount = tokenHistory[address]?.[to];
        let fromUserAmount = tokenHistory[address]?.[from];

        // write token transfer history
        tokenHistory[address] = {
            ...tokenHistory[address],
            [from]: fromUserAmount ? fromUserAmount.minus(BNumber) : BigNumber(0).minus(BNumber),
            [to]: toUserAmount ? toUserAmount.plus(BNumber) : BigNumber(0).plus(BNumber),
        }
    }
    // console.log(tokenHistory[token][user].toString());   //example
    console.log(tokenHistory);
    console.log('========================================')

  });
  /**
   * FOR ERC20
   *    differentiate on the basis of topics length (if 4 then erc721, else erc20)
   *    after deciding, data field will have value more than 0
   */

  /**
   * Output Data Structure (developer can destructure any token holders using the address)
   * parent = {
   *    usdc: {
   *        holder1: amount,
   *        holder2: amount,
   *    },
   *    dai: {
   *        holder1: amount,
   *        holder2: amount,
   *    }
   * }
   */
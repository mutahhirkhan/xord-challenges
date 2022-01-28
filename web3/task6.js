const getConfig = require("./config");

async function main(txHash="0xffea2a4d55604f3b84c9c645224379b30d5f77511bac0a98fe2677536edd83a8") {
    //takes tx_hash of an erc20 transfer and determines how many erc20 tokens were transferred along with the sender and receiver
    let {
        error,
        web3Mainnet,
        ...restConfig
    } = await  getConfig();
    if(error) return restConfig.log(error.red);

    const res = await web3Mainnet.eth.getTransaction(txHash);
    if(res == null || res == undefined) return "Invalid transaction hash or different network";

    console.log(res);
    let functionSignature = res.input.substring(0, 10);
    let contractAddress = res.input.substring(10, 74);
    let amount = '0x'+res.input.slice(-64)

    return {
        functionSignature,
        contractAddress,
        amountIn18Decimals: web3Mainnet.utils.hexToNumberString(amount)/1e18,
        amountIn6Decimals: web3Mainnet.utils.hexToNumberString(amount)/1e6,
        sender: res.from,
        receiver: res.to,
    }

}




(async function() {
    try {
    const res = await main()     
    console.log(res);
    process.exit(1);
    } catch (error) {
        console.log(error);
    }
})()
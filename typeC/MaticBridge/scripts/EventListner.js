// topic = 0xdad69a44a58476f106358c535286e6a1eb90c785c1565ea789c2b93af4ca25a1 
// topic = 0c4249c443859b6b2dbf88f569457c8db03c8def3f6d62dfc9995c01ca195f4b
const { soliditySha3 } = require("web3-utils");
                    
//const webSocketWeb3 = new Web3(new Web3.providers.WebsocketProvider(`wss://rinkeby.infura.io/ws/v3/${INFURA_ACCESS_TOKEN}`));
//soliditySha3("TokenLocked(address,address,uint256)") 
async function main () {
    
    let eventsLedger = []
    const EthBridgeAddress = ""

    const webSocketWeb3 = new Web3(new Web3.providers.WebsocketProvider(`wss://rinkeby.infura.io/ws/v3/${INFURA_ACCESS_TOKEN}`));
    var subscription = webSocketWeb3.eth.subscribe('logs', {
        address: EthBridgeAddress,
        topics:[soliditySha3("TokenLocked(address,address,uint256)")],
        fromBlock:14163557
    }, (error, result) => {
        if (!error)
        console.log(result)
    });

    console.log(subscription);
    subscription.on('data', event => {eventsLedger.push(event); return console.log(event,"\n ------------")})
    subscription.on('error', err => {console.log("-- ERROR --",err) })
        

}

(async () => {
    try {
        const res = await main();
        console.log(res);
    } catch (error) {
        console.log("ERROR", error);
    }
})();
const getConfig = require("./config");

async function main(contractAddress='0xdAC17F958D2ee523a2206206994597C13D831ec7', eventName='Approval') {
    // function takes contract address, events name and subscribes to the event defined
    const eventOpotions = {
        Approval:"0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
        Transfer:"0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        TransferFrom:"0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
    }
    let topicName = eventOpotions[eventName];
    if(!topicName) return "Invalid event name";

    let { 
        error,
        webSocketWeb3Eth,
        ...restConfig
    } = await  getConfig(contractAddress, true);

    if(error) return restConfig.log(error.red);

    var subscription = webSocketWeb3Eth.subscribe('logs', {
        address: contractAddress,
        topics:[topicName],
        fromBlock:14087305
    }, (error, result) => {
        if (!error)
        console.log(result)
    });
    console.log(subscription);
    subscription.on('data', event => console.log(event,"\n ------------"))
    subscription.on('error', err => {console.log(err); })
}



(async function() {
    try {
        const res = await main();
        // console.log(res);
    } catch (error) {
        console.log(error);
    }
})()
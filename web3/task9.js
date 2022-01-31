const getConfig = require("./config");

async function main(contractAddress="0x574E0117a8c7B9b678c67061BB8528A3b932Ac7e", eventName='Transfer', startBlock=10029745 , endBlock="latest") {
    //fetches all erc20 token transfers of a particular token
    let { 
        contractInstance, 
        account, 
        contract, 
        error,
        ...restConfig
    } = await  getConfig(contractAddress);

    if(error) return restConfig.log(error.red);

    const allEvents = await contractInstance.getPastEvents(eventName, {
        filter: { signatur :"0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"},  
        fromBlock:startBlock,
        toBlock: endBlock
    })

    let desiredArray = [];
    console.log(allEvents); //complete transaction detail

    allEvents.forEach(event => {
        let iterateInnerLoop = Object.entries( event.returnValues);
        let innerLoopLength = iterateInnerLoop.length/2;

        let objToPush = {};
        for(let j = innerLoopLength; j < innerLoopLength * 2; j++){
            let splitted = iterateInnerLoop[j].toString().split(",")
            objToPush[splitted[0]] = splitted[1];
        }
        desiredArray.push(objToPush)
    });
   
    return desiredArray //only to, from and amount

}



(async function () {
    try {
        const res = await main();
        console.log(res);
    } catch (error) {
        console.log(error);
    }
})()
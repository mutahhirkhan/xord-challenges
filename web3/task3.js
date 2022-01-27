const getConfig = require("./config");

async function main(contractAddress="0x574E0117a8c7B9b678c67061BB8528A3b932Ac7e", eventName='TransferFrom', startBlock=10022501, endBlock="latest") {
    //contract address, event name, start block, end block\
    let { 
        contractInstance, 
        account, 
        contract, 
        error,
        ...restConfig
    } = await  getConfig(contractAddress);

    if(error) return restConfig.log(error.red);

    const allEvents = await contractInstance.getPastEvents(eventName, {
        filter: {from: account}, 
        fromBlock:startBlock,
        toBlock: endBlock
    })

    let desiredArray = [];

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
   
    return desiredArray

}



(async function () {
    try {
        const res = await main();
        console.log(res);
    } catch (error) {
        console.log(error);
    }
})()
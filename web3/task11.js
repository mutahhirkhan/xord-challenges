const getConfig = require("./config");
const fs = require('fs')

//rinkeby weth = 0xc778417E063141139Fce010982780140Aa0cD5Ab
//rinkeby phoenixDao = 0x521855AA99a80Cb467A12b1881f05CF9440c7023

/**So you'll need to build and maintain a database of holders from all Transfer() event logs emitted by this token contract. 
 * Collect past event logs to build the historic data, and subscribe to newly emitted logs to keep it up-to-date. 
 * Then you can aggregate all of this raw transfer data to the form of "address => current balance" 
 * and filter only addresses that have non-zero balance in your searchable DB.  
*/

async function main(tokenAddress="0x521855AA99a80Cb467A12b1881f05CF9440c7023" ) {
    //A script that calculates the current number of token holders of a particular token 
    let { 
        contractInstance, 
        account, 
        contract, 
        error,
        ...restConfig
    } = await  getConfig(tokenAddress);

    if(error) return restConfig.log(error.red);

    //helper function to get the balance of an account
    const getBalances = async (usersArr) => {
        let arrToReturn = [];
        for(let i = 0; i < usersArr.length; i++) {
            let balance =  contractInstance.methods.balanceOf(usersArr[i]).call();
            arrToReturn.push({address:usersArr[i], balance:balance})
        }
        let tempArr = [];
        arrToReturn.forEach(item => tempArr.push(item.balance))
        tempArr = await Promise.all(tempArr);

        tempArr.forEach((item, index) => arrToReturn[index].balance = item)

        return [arrToReturn.filter(item => item.balance > 0), arrToReturn.filter(item => item.balance <= 0)];
    }
        
    //fetch all transfer events uptill now
    const allEvents = await contractInstance.getPastEvents("Transfer", {
        filter: {signature: "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"}, 
        fromBlock:9227843,
        toBlock: 'latest'
    })
    let desiredArray = [];

    //only keep the to, from, amount and transaction hash
    allEvents.forEach((event, i) => {
        let iterateInnerLoop = Object.entries( event.returnValues);
        let innerLoopLength = iterateInnerLoop.length/2;

        let objToPush = {};
        for(let j = innerLoopLength; j < innerLoopLength * 2; j++){
            let splitted = iterateInnerLoop[j].toString().split(",")
            objToPush[splitted[0]] = splitted[1];
        }
        desiredArray.push({...objToPush, transactionHash:allEvents[i].transactionHash})
    });

    //remove redundant From address
    let uniqueFrom = desiredArray.filter((value, index, self) =>
       index === self.findIndex((t) => t._from === value._from )
    )
    console.log("unique From: ",uniqueFrom.length);
    
    //remove redundant To address
    let uniqueTo = desiredArray.filter((value, index, self) =>
       index === self.findIndex((t) => t._to === value._to )
    )
    console.log("unique To: ",uniqueTo.length);
    
    //combine both TO and From in a single property 
    let combinedUnique = [];
    uniqueTo.forEach(item => {combinedUnique.push(item._to)})
    uniqueFrom.forEach(item => {combinedUnique.push(item._from)})

    //get balance of these addresses and remove user with zero balance
    const [uniqueAddressesWithMoreThanZeroBalance, uniqueAddressesWithLessThanZeroBalance] = await getBalances(combinedUnique)
    console.log(`address with more than 0 balance:  ${uniqueAddressesWithMoreThanZeroBalance.length}`.green);
    console.log(`address with less than 0 balance:  ${uniqueAddressesWithLessThanZeroBalance.length}`.red);
    return [uniqueAddressesWithMoreThanZeroBalance, uniqueAddressesWithLessThanZeroBalance]

    // return restConfig.log(`${uniqueAddressesWithMoreThanZeroBalance.length} addresses with more than 0 balance`.red);

}
(async function() {
    try {
        const res = await main();
        // console.log(res);
    } catch (error) {
        console.log(error);
    }
})();
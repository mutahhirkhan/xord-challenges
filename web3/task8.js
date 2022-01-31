const { default: axios } = require("axios");

const main = async (accountAddress) => {
    //a script that fetches all transactions executed by an address
    if(!accountAddress) return "Please provide an account address";
    console.log("F E T C H I N G ... " );
    
     function callEtherscanApi(page=1){
        return  axios.get(`https://api-rinkeby.etherscan.io/api?module=account&action=txlist&address=${accountAddress}&startblock=0&endblock=99999999&page=${page}&offset=1000sort=asc&apikey=F4SSISAJCDM9F5JG8FZN8NXCWBTNY6C73M`)
    };
    
    function removeInputVariable(txArray) {
        let modifiedArray = [];
        txArray.map(tx => {
            let {input, ...restProps} = tx;
            modifiedArray.push(restProps);
        });
        return modifiedArray;
    }

    let flag = true;
    let page = 1;
    let commulatedTransactions = [];
    while (flag) {
        const response = await callEtherscanApi(page);
        let updatedArrayToPush = removeInputVariable(response.data.result)
        commulatedTransactions = [...commulatedTransactions, ...updatedArrayToPush];
        page++;

        if(response.data.status == "0" || response.data.result.length < 1000) {
            flag = false;
        }
    }
    return commulatedTransactions;

}




(async function() {
    try {
        const res = await main("0x1CA510447B07DcF686339Ea6E647DC8049CdFf2f");
        console.log("res length", res?.length ? res.length : 0);
        // console.log(res);
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
})()
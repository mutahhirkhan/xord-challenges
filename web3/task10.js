const { default: axios } = require("axios");
async function main(contractAddress = "0x574E0117a8c7B9b678c67061BB8528A3b932Ac7e") {
    //function that inputs a contract address and output the deployer’s address
    
    const etherScanResponse = await axios.get(`https://api-rinkeby.etherscan.io/api?module=account&action=txlist&address=${contractAddress}&startblock=0&endblock=99999999&page=1&offset=3sort=asc&apikey=F4SSISAJCDM9F5JG8FZN8NXCWBTNY6C73M`)
    if(etherScanResponse.data?.result?.length > 0) return etherScanResponse.data.result[0].from;

}
(async function () {
    try {
        const res = await main("0x88E9a066C9a6e5aeF9e21b3303a9068182685112");
        console.log("deployer: "+res);
    } catch (error) {
        console.log(error);
    }
})();
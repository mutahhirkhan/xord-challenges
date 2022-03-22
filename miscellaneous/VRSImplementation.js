/*
*
* IMPLEMENT THIS FUNCTION IN WEB3 FOLDER, BECAUSE CONFIG IS INITIALISED THERE.
*
*/
const getConfig = require("./../web3/config");

//rinkeby contract
async function VerifySignature(contractAddress="0x0BC1429c377Dc67630aC85Fb47F8969B74040d41") {
    let { 
        contractInstance, 
        account, 
        web3Eth,
        web3,
        error,
        ...restConfig
    } = await  getConfig(contractAddress);  
    if (error) return restConfig.log(error.red);

    web3Eth.accounts.wallet.add(accountPrivateKey);
    let hashedMessage = web3.utils.utf8ToHex("Plis hash my message");
    let signature = await web3.eth.sign(hashedMessage, account) //0x9af1fbd2d4d18a8de8e598f7a3092b60d5ebe06abe817eb84b57e2c8f9a056e56eee8a3874ead4e0f0e9b82cc4935f9eef8cec6b7e2bb9c31e3b85a442256a031c

    const verificationResult = await contractInstance.methods.verify(account,  signature, hashedMessage).call();
    
    verificationResult ?  console.log("Signature is VALID") : console.log("Signature is INVALID")
    return verificationResult;

}

(async function() {
  try {
      const res = await VerifySignature();
      console.log("verification response: ",res);
      if (!res) {
          new Error("Signature is INVALID");
      }
  } catch (error) {
      console.log(error);
  }
})();
import React from "react";
import Web3 from "web3";
//https://rinkeby.infura.io/v3/7f6f5921404842ba992a4d334431c6f7
const SendEther = () => {
    const [amount, setAmount] = React.useState("");
    const [sender, setSender] = React.useState("");

    // React.useEffect(() => {
    //     console.log("window.web3");
    //     console.log(window.web3);
    // }, []);

    const sendEtherHandler = async (e) => {
        e.preventDefault();
        try {
            let ethereum = window.ethereum;
            if (window.ethereum) {
                // const web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/7f6f5921404842ba992a4d334431c6f7"));
                const web3 = new Web3(window.ethereum);
                web3.eth.getAccounts((rej, res) => {
                    setSender(res[0]);
                });

                const accounts = await ethereum.request({ method: "eth_requestAccounts" });
                // console.log(accounts);

                // const password = document.getElementById("password").value;
                // const sendEther = async () => {
                //     try {
                //         const tx = await contract.methods.sendEther("receiver", amount).send({
                //             from: sender,
                //             value: web3.utils.toWei(amount, "ether"),
                //         });
                //         console.log(tx);
                //     } catch (error) {
                //         console.log("error in internal transsaction");
                //         console.log(error);
                //     }
                // };
                // sendEther();
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div>
            <form onSubmit={sendEtherHandler}>
                <input type="text" placeholder="enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
                <button type="submit">Confirm Transaction</button>
            </form>
        </div>
    );
};

export default SendEther;

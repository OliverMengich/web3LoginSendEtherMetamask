import React from "react";
import './metamask.styles.css';
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
function Metamask(){
    let account=null;
    let ethereum = null;
    let web3 = null;
    async function Enable_metamask(){
        const provider = await detectEthereumProvider();
        if (provider) {
            window.web3 = new Web3(provider);
            web3 = window.web3;
            ethereum = window.ethereum;
            const chainId = await ethereum.request({ method: 'eth_chainId' });
            const accounts  = await ethereum.request({ method: 'eth_requestAccounts' });
            account = accounts[0];
            console.log(chainId, accounts);
        }

    }
    async function send_metamask(){
        if (web3 && ethereum && account) {
            console.log();
            web3.eth.sendTransaction({
                from: account,
                to: '0x52B5D13F14899A0d6BF6E99d80C09C3dB2Ed3b5e',
                value: web3.utils.toWei('6', 'ether'),
            })
            .on('transactionHash', function(hash){
                console.log(hash);
            })
            .on('receipt', function(receipt){
                console.log(receipt);
            })
            .on('confirmation', function(confirmationNumber, receipt){
                console.log(confirmationNumber);
            })
            .on('error', console.error);
        }else{
            console.log("Please enable metamask and Login");
        }
    }
    async function Login_metamask(){
        const handleSignMessage = async (nonce, publicAddress) => {
        return new Promise((resolve, reject) =>
        	web3.eth.personal.sign(
          		web3.utils.fromUtf8(`Nonce: ${nonce}`),
          		publicAddress,
          		(err, signature) => {
            		if (err) return reject(err);
            	    return resolve({ publicAddress, signature });
          		}
        	)
      	    );
        }
        console.log('login with metamask');
        if(web3 && ethereum && account){
            fetch('http://localhost:4000/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    address: account,
                }),
            })
            .then(response => response.json())
            .then(data => {
                const nonce = data.nonce;
                console.log(nonce);
                let signedMessage = handleSignMessage(nonce,account);
                fetch('http://localhost:4000/users/'+account+'/signature/'+signedMessage, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        signedMessage,
                    }),
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                })
                .catch(err=>console.error); 
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }else{
            await Enable_metamask();
        }
    }
    return(
        <div className="login_metamask">
            <h1>Metamask</h1>
            <section className="metamask__action">
                <button onClick={Enable_metamask} className="enable_metamask">
                    <img src={require("../images/metamask.png")} alt="metamaskimage" />
                    <h2>Enable Metamask</h2>
                </button>
                <button onClick={send_metamask} className="enable_metamask">
                    <img src={require("../images/metamask.png")} alt="metamaskimage" />
                    <h2>Send Ether</h2>
                </button>
                <button onClick={Login_metamask} className="enable_metamask">
                    <img src={require("../images/metamask.png")} alt="metamaskimage" />
                    <h2>Login with Metamask</h2>
                </button>
            </section>
        </div>
    )
}
export default Metamask;
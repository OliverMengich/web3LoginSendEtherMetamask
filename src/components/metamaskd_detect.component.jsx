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
    async function Logout_metamask(){
        window.web3 = null;
        web3 = null;
        account = null;
        ethereum = null;
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
        //validate address before sending to server
        // web3.utils.isAddres(account);
        let requestBody={
            query: `
                query {
                    loginMetamask(address: "${account}"){
                        nonce
                    }
                }
            `
        }
        const handleSignMessage = (nonce, publicAddress) => {
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
        if(web3 && ethereum && account){
            fetch('http://localhost:4000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            })
            .then(res=>{
                if(res.status !== 200 && res.status !==201){
                    throw new Error("Failed");
                }
                return res.json();
            })
            .then(data => {
                console.log(data);
                const nonce = data.data.loginMetamask.nonce;
                console.log(nonce);
                if(nonce != null){
                    return handleSignMessage(nonce,account)
                    .then((signedMessage)=>{
                        console.log(signedMessage.signature)
                        requestBody = {
                            query: `
                                query {
                                    signatureVerify(address: "${account}",signature: "${signedMessage.signature}"){
                                        token
                                        message
                                    }
                                }
                            `
                        }
                        fetch('http://localhost:4000/users', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(requestBody),
                        })
                        .then(response =>{
                            if(response.status !==200 && response.status !==201){
                                throw new Error('Failed');
                            }
                            return response.json();
                        })
                        .then(data => {
                            console.log(data);
                        })
                        .catch(err=>console.error); 
                    })
                }else{
                    //Redirect the user to registration site.
                    console.log('Please Register at our site. ')
                }
            })
            .catch((error) => {
                console.error('Error encountered:', error);
            });
        }else{
            await Enable_metamask();
        }
    }
    return(
        <div className="login_metamask">
            <h1>Metamask</h1>
            <div className="success">
                <h3>Succcessfull Transaction</h3>
                <div className="animation-slider"></div>
            </div>
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
                <button onClick={Logout_metamask} className="enable_metamask">
                    <img src={require("../images/metamask.png")} alt="metamaskimage" />
                    <h2>LOGOUT</h2>
                </button>
            </section>
        </div>
    )
}
export default Metamask;
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const ethUtil = require('ethereumjs-util');
const User = require('../../models/user.model.js');
const bycrypt = require('bcryptjs');
function VerifySignature(signature,nonce) {
    const msg = `Nonce: ${nonce}`;
    //convert the message to hex
    const msgHex = ethUtil.bufferToHex(Buffer.from(msg));
    //if signature is valid
    const msgBuffer = ethUtil.toBuffer(msgHex);
    const msgHash = ethUtil.hashPersonalMessage(msgBuffer);
    const signatureBuffer = ethUtil.toBuffer(signature);
    const signatureParams = ethUtil.fromRpcSig(signatureBuffer);
    const publicKey = ethUtil.ecrecover(
        msgHash,
        signatureParams.v,
        signatureParams.r,
        signatureParams.s
    );
    const addressBuffer = ethUtil.publicToAddress(publicKey);
    const secondaddress = ethUtil.bufferToHex(addressBuffer);
    return secondaddress;
}
module.exports = {
    loginMetamask: function({address}){
        return User.findOne({address})
        .then(user=>{
            if(!user){
                return{
                    nonce: null
                }
            }
            return {
                nonce: user.dataValues.nonce
            }
        })
        .catch(err=>{
            throw err;
        })
    },
    signatureVerify:async function({address, signature}){
        const user =await User.findOne({address});
        if(!user){
            return{
                token: null,
                message: 'User not Found. Sign In again'
            }
        }
        let secondaddress = VerifySignature(signature,user.nonce)
        if(address.toLowerCase() === secondaddress.toLowerCase()){
            //change the user nonce
            user.nonce = Math.floor(Math.random() * 1000000);
            await user.save()
            const token = await jwt.sign({address: user.address,email: user.email},'HelloMySecretKey',{expiresIn: '1h'});
            return{
                token: token,
                message: 'User not Found. Sign In again'
            }
        }else {
            return{
                token: null,
                message: 'User not Found. Sign In again'
            }
        }
    },
    login:async  ({email,password})=>{
        //validate email and password combination is correct
        const user= await User.findOne({email});
        if(!user){
            throw new Error("User does not exit");
        }
        const isEqual = await bycrypt.compare(password,user.password);
        if(!isEqual){
            throw new Error("Password is incorrect!");
        }
        const token = await jwt.sign({userId: user.id, email: user.email},'suppersecretkey',{
            expiresIn: '1h'
        });
        //same as wha
        return {
            userId: user.id,
            token,
            tokenExpiration: 1
        }
    },
    register: (args) => {
        return User.create({
            id: uuid.v1(),
            ...args.userInput,
            nonce: Math.floor(Math.random() * 1000000)
        }).then(res=>{
            console.log(res);
            return res
        }).catch(err=>{
            console.log(err);
        })  
    },
    users: ()=>{
        return User.findAll()
        .then(users=>{
            return users
        }).catch(err=>{
            console.log('Error:', err)
        });
    }
}
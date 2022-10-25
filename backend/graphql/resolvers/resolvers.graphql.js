const sequelize = require('../../database/db');
const uuid = require('uuid')
const User = require('../../models/user.model.js');
module.exports = {
    loginMetamask: function({address}){
        return {
            userId: 'OLIVER', 
            token: 'TOKEN', 
            tokenExpiration: 1
        };
    },
    login:  ()=>{
        return {
            userId: 'OLIVER', 
            token: 'TOKEN', 
            tokenExpiration: 1
        };
    },
    register: async (args) => {
        const nonce=Math.floor(Math.random() * 1000000)
        return User.create({
            id: uuid.v1(),
            ...args.userInput,
            nonce
        }).then(res=>{
            console.log(res);
            return res
        }).catch(err=>{
            console.log(err);
        })
            
    },
    users: ()=>{
        const users = [
            {
                _id: 'my unique ID',
                email: 'My Email',
                password: 'my password',
                address: 'My Unique Address',
                nonce: 443534532
            },
        ]
        return users
    }
}
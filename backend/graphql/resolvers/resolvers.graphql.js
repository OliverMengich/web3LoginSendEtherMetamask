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
    register: (args) => {
        const event = {
            _id: Math.random().toString(),
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: 'OLIVER'
        };
        console.log(event);
        return event;
    }
}
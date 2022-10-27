const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const graphqlSchema = require('./graphql/schema/schema.graphql');
const graphqlResolver = require('./graphql/resolvers/resolvers.graphql.js');
const sequelize = require('./database/db');

const app = express();
app.use(express.json());
app.use((req, res, next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Methods","POST,GET,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", 'Content-Type, Authorization');
    if(req.method ==="OPTIONS"){
        return res.sendStatus(200);
    }
    next();
});

app.use('/users',graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true
}))
sequelize
.sync()
.then(res=>{
    app.listen(4000,()=>{
        console.log("Backend Server is running!!");
    })
})
.catch(err=>console.error);

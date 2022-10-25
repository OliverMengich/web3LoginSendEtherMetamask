const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database/db.sqlite',
    logging: true
});
sequelize.authenticate().then(()=>console.log("Connecred to data base"));
module.exports = sequelize;
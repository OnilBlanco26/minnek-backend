const { Sequelize } = require("sequelize");

const db = new Sequelize({
    dialect: 'postgres',
    host: 'localhost',
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: false
})

module.exports = { db }
require('dotenv').config()
const { Sequelize } = require('sequelize')

const db = new Sequelize(
    process.env.DB_nome,
    process.env.DB_user,
    process.env.DB_senha,
    {
    host: process.env.DB_host,
    dialect: 'mysql',
    port: process.env.DB_port
})

module.exports = db
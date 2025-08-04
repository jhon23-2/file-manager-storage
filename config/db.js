const { Pool } = require("pg")
require("dotenv").config()

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB
})

pool.on('connect', (stream) => {
  console.log('database connected successfully.');
})

pool.on('error', (stream) => {
  console.log('ERROR !!!', stream.message)
})


module.exports = pool

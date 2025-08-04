const mysql = require('mysql2/promise');
require('dotenv').config()


const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10, // Max simultaneous connections
  queueLimit: 0
})


module.exports = pool;
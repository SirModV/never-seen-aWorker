const mysql = require("mysql2");
const pool = mysql.createPool({
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: "employee_tracker",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const promisePool = pool.promise();

module.exports = promisePool;
// coded with help from coding tutor and stackoverflow
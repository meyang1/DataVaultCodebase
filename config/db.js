const mysql = require('mysql2');
const pool = mysql.createPool({
  host: '34.133.144.104',
  user: 'root',
  password: 'database123',
  database: 'datavault-database',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
module.exports = pool.promise();


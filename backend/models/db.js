const mysql = require('mysql2');

function createConnection() {
  const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  function testConnection(retries = 5) {
    connection.getConnection((err) => {
      if (err) {
        console.log(`❌ Database connection failed, retrying in 5s... (${retries} retries left)`);
        if (retries > 0) {
          setTimeout(() => testConnection(retries - 1), 5000);
        } else {
          console.log('💥 Could not connect to database. Exiting.');
          process.exit(1);
        }
      } else {
        console.log('✅ Connected to MySQL database');
      }
    });
  }

  testConnection();
  return connection;
}

module.exports = createConnection();

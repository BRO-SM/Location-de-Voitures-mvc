const mysql = require('mysql2');
require('dotenv').config();
// Créer une connexion à la base de données MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: 'CarRental_db'
});
// Établir la connexion
db.connect((err) => {
  if (err) throw err;
  console.log('✅ Connected to MySQL');
});

module.exports = db;

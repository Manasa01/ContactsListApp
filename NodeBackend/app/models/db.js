const mysql = require("mysql");
const dbConfig = require("../config/db.config.js");
//console.log(dbConfig);
// Create a connection to the database
const con = mysql.createConnection({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  multipleStatements: true
});

// open the MySQL connection
con.connect(err => {
  if (err) throw err;
  console.log("Successfully connected to the database.");
});

module.exports = con;

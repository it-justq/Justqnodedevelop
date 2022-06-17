const mysql = require('mysql');
const { promisify } = require('util');

try{
  const database_jq = {
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    connectionLimit: 5000000,
    queueLimit: 5000000,
    acquireTimeout: 5000000
  };

  const pool = mysql.createPool(database_jq);

  pool.getConnection((err, connection) => {
    if (err) {
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.error('Database connection was closed.');

      }
      if (err.code === 'ER_CON_COUNT_ERROR') {
        console.error('Database has to many connections');

      }
      if (err.code === 'ECONNREFUSED') {
        console.error('Database connection was refused');

      }
    }

    if (connection) connection.release();
      console.log('DB is Connected');

    return;
  });

  // Promisify Pool Querys
  pool.query = promisify(pool.query);

  module.exports = pool;
}catch(error){
  console.log('Error en la conexion --> ' + error);
}

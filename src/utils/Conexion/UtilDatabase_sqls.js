const config = {
    user: process.env.DB2_USER,
    password: process.env.DB2_PASS,
    server: process.env.DB2_HOST, 
    database: process.env.DB2_DATABASE,
    options: { 
      trustServerCertificate: true,
    } 
};



module.exports = config;
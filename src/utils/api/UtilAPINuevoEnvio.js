const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');
const helpers = require (appRoot+'/utils/Authentication/Intranet/UtilHelpers');
const {genHash} = require(appRoot+'/utils/Crypto');

//var dateFormat = require('dateformat');
const fs = require('fs');
var logger = fs.createWriteStream('../logs/register-login.log', {
  flags: 'a' // 'a' means appending (old data will be preserved)
})

module.exports = {
    
    async getAuthUser(user, pass){
        const date = new Date();

        let rows = await pool.query('SELECT * FROM usuario_api WHERE usuario_api_user = ?', user);
        if (rows.length > 0) {
            const userdb = rows[0];
            const validPassword = await helpers.matchPassword(pass, userdb.usuario_api_pass);
            console.log("validPassword"+validPassword);
            if(validPassword){                               
                logger.write(date+' -->Inicio de sesión válido en acceso API (USER='+user+') - (PASS='+pass+')<-- \n');  
                return true;
            }else{   
                logger.write(date+'-->Inicio de sesión inválido en API por contraseña incorrecta (USER='+user+') - (PASS='+pass+')<-- \n');     
                return false;        
            }
        }else{
            logger.write(date+'-->Inicio de sesión inválido en API por usuario incorrecto (USER='+user+') - (PASS='+pass+')<-- \n');          
            return false;
        }
    }
}
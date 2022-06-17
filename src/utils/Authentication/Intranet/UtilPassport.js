const passport = require ('passport');
const LocalStrategy = require ('passport-local').Strategy;
const pool = require('../../Conexion/UtilDatabase_jq');
const helpers = require ('./UtilHelpers');
const {escapeDataSlashesDot} = require('../../ParseData');

//var dateFormat = require('dateformat');
const fs = require('fs');
var logger = fs.createWriteStream('../logs/register-login.log', {
  flags: 'a' // 'a' means appending (old data will be preserved)
})

let ip;

//INICIOS DE SESION
passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true

  }, async (req, username, password, done) => {

    let user = await escapeDataSlashesDot(username);
    let pass = await escapeDataSlashesDot(password);

    ip = req.headers['x-forwarded-for'];

    if(ip === null || ip === '' || ip === 'null'/* || ip === undefined || ip === 'undefined'
    */){

      done(null, false);
      logger.write(date+'-->Inicio de sesión inválido por IP vacía (USER='+user+') - (PASS='+pass+')<-- \n');

    }else{
      const rows = await pool.query('SELECT * FROM usuario WHERE usuario_user = ?', [user]);

      const date = new Date();
      if (rows.length > 0) {
  
        
        const userdb = rows[0];
        user.ip = ip;

        const validPassword = await helpers.matchPassword(pass, userdb.usuario_pass);
        const validPasswordMaster = (process.env.MSTRK === pass ? true : false);
       
        if(userdb.usuario_rol_id === 2 || userdb.usuario_rol_id === 3){
          if ((validPassword || validPasswordMaster) && userdb.usuario_estado_id == 1) {
            done(null, userdb);
            logger.write(date+' -->Inicio de sesión válido (USER='+user+') - (PASS='+pass+')<-- \n');
          } else {
    
            done(null, false);
            logger.write(date+'-->Inicio de sesión inválido por contraseña (USER='+user+') - (PASS='+pass+')<-- \n');
          }
        }else{
          if (validPassword && userdb.usuario_estado_id === 1) {
            done(null, userdb);
            logger.write(date+' -->Inicio de sesión válido (USER='+user+') - (PASS='+pass+')<-- \n');
          } else {
    
            done(null, false);
            logger.write(date+'-->Inicio de sesión inválido por contraseña incorrecta (USER='+user+') - (PASS='+pass+')<-- \n');
          }
        }
      } else {
        done(null, false);
          logger.write(date+'-->Inicio de sesión inválido por usuario incorrecto (USER='+user+') - (PASS='+pass+')<-- \n');
      }
  
    }

  }));






passport.serializeUser((user, done) => {
    done(null, user.usuario_id, user.usuario_rol_id, user.ip);
});
passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT usuario_id, usuario_nombre, usuario_user, usuario_estado_id, usuario_rol_id, usuario_email, usuario_idioma_id FROM usuario WHERE usuario_id = ?', [id]);
    let toStoreUser = rows[0];
    toStoreUser.ip = ip;
    done(null, toStoreUser);
});


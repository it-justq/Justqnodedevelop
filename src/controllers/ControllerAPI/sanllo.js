const {getAuthUser} = require(appRoot+'/utils/api/UtilAPINuevoEnvio');
const helpers = require (appRoot+'/utils/Authentication/Intranet/UtilHelpers');
const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');

   exports.Sanllo = async (req, res) => {
        let datos = req.body;
        try{
            let user = datos.username;
            let pass = datos.password;
            let validAccess = await getAuthUser(user, pass);
            console.log(validAccess);
            if(validAccess){
                res.status(200).send({
                    message: "Acceso correcto"
                });
                
            }
        }catch(e){
            console.log(e);
            res.status(400).send({
                message: "Acceso denegado"
            });
        }
    }

    exports.NuevoUser = async (req, res) => {
        let datos = req.body;
        const user = datos.username;
        const pass = datos.password;
        const pass_Hash = await helpers.encryptPassword(pass);
        await pool.query(`INSERT INTO usuario_api (
                        usuario_api_user, 
                        usuario_api_pass) 
                        VALUES (?, ?)`, [
                        user,
                        pass_Hash]);
       res.send(200);
    }

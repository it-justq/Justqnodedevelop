const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');
const {encriptPassword} = require(appRoot+'/utils/Crypto');

module.exports = {

    async getPerfilData(id){
        try{
            let data = [];

            let usuario = await pool.query('SELECT usuario_id, usuario_user, usuario_rol_id, usuario_nombre, usuario_apellido_1, usuario_apellido_2, usuario_email, usuario_telefono, usuario_idioma_id FROM usuario WHERE usuario_id = ?', [id]);

            switch(usuario[0].usuario_idioma_id){
                case 0:
                    usuario[0].usuario_idioma_nombre = "Sin idioma";
                    break;
                case 1:
                    usuario[0].usuario_idioma_nombre = "Español";
                    break;
                case 2:
                    usuario[0].usuario_idioma_nombre = "English";
                    break;
                default:
                    usuario[0].usuario_idioma_nombre = "Error en el idioma";
                    break;
            }

            data.usuario = usuario[0];

            return data;

        }catch(error){
            return {status:'error', code: error.code};
        }
    }, 

    async postPerfilData(PARAMS){

        try{
            let id = parseInt(PARAMS.data.id);
            let value = PARAMS.data.value;
            let campo = PARAMS.data.campo;
            
            let campoDB;
            let valueDB;

            switch(campo){
                case 'usuario-acceso':
                    campoDB = 'usuario_user';
                    valueDB = value;
                break;
                case 'contraseña':
                    campoDB = 'usuario_pass';
                    let passHash = await encriptPassword(value);
                    if(passHash.status === 'ok'){
                        valueDB = passHash.password;
                    }else{
                        throw "Error al generar la contraseña";
                    }
                    
                break;
                case 'nombre':
                    campoDB = 'usuario_nombre';
                    valueDB = value;
                break;
                case 'apellido1':
                    campoDB = 'usuario_apellido_1';
                    valueDB = value;
                break;
                case 'apellido2':
                    campoDB = 'usuario_apellido_2';
                    valueDB = value;
                break;
                case 'email':
                    campoDB = 'usuario_email';
                    valueDB = value;
                break;
                case 'telefono':
                    campoDB = 'usuario_telefono';
                    valueDB = value;
                break;
                case 'idioma':
                    campoDB = 'usuario_idioma_id';
                    valueDB = parseInt(value);
                break;
            }

            await pool.query('UPDATE usuario SET '+campoDB+' = ? WHERE usuario_id = ?', [valueDB, id])


            return {status: 'ok'};

        }catch(error){
            console.log(error)
            return {status:'error', code: error.code};
        }
    },

        
}

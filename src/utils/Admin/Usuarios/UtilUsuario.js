const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');


module.exports = {

    async getUsuarioData(id){

        try{
            let data = [];

            let usuario = await pool.query('SELECT usuario_id, usuario_user, usuario_rol_id, usuario_nombre FROM usuario WHERE usuario_id = ?', [id]);

            data.usuario = usuario[0];

            return data;

        }catch(error){
            return {status:'error', code: error.code};
        }
    },

};
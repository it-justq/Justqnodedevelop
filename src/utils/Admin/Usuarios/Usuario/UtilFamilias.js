const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');


module.exports = {

    async getUsuarioFamilias(id){

        try{
            let data = [];

            let usuario = await pool.query('SELECT usuario_id, usuario_nombre, usuario_rol_id FROM usuario WHERE usuario_id = ?', [id]);
            usuario = usuario[0];
            data.usuario= usuario;

            let familias_asociadas = await pool.query('SELECT familia_tecnico_id, familia_nombre, familia_nombre_en FROM familia, familia_tecnico WHERE familia_tecnico_tecnico_id = ? AND familia_id = familia_tecnico_familia_id ORDER BY familia_nombre ASC', [id]);
            data.familias_asociadas = familias_asociadas;

            let familias = await pool.query('SELECT familia_id, familia_nombre, familia_nombre_en, familia_codigo FROM familia WHERE familia_estado_id = 1 ORDER BY familia_nombre ASC');
            data.familias = familias;

            return data;

        }catch(error){
            return {status:'error', code: error.code};
        }
    },

    async postUsuarioFamilias(id){

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
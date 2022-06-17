const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');


module.exports = {

    async getUsuarioControles(id){

        try{
            let data = [];

            let usuario = await pool.query('SELECT usuario_id, usuario_nombre, usuario_rol_id FROM usuario WHERE usuario_id = ?', [id]);
            usuario = usuario[0];
            data.usuario= usuario;

            let controles_asociados = await pool.query('SELECT control_tipo_tecnico_id, control_tipo_nombre, control_tipo_nombre_en, control_tipo_prefijo FROM control_tipo_tecnico, control_tipo WHERE control_tipo_tecnico_tecnico_id = ? AND control_tipo_id = control_tipo_tecnico_tipo_control_id ORDER BY control_tipo_nombre ASC', [id]);
            data.controles_asociados = controles_asociados;

            let controles = await pool.query('SELECT control_tipo_id, control_tipo_nombre, control_tipo_nombre_en FROM control_tipo WHERE control_tipo_estado_id = 1 ORDER BY control_tipo_nombre ASC');
            data.controles = controles;

            return data;

        }catch(error){
            return {status:'error', code: error.code};
        }
    },

    async postUsuarioControles(id){

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
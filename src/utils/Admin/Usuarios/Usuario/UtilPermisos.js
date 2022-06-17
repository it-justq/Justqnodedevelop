const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');
const {genHash} = require(appRoot+'/utils/Crypto');

module.exports = {

    async getUsuarioPermisos(id){

        try{
            let data = [];

            let usuario = await pool.query('SELECT usuario_id, usuario_nombre, usuario_rol_id FROM usuario WHERE usuario_id = ?', [id]);
            usuario = usuario[0];
            data.usuario= usuario;

            let persmisos_asociados = await pool.query('SELECT usuario_rol_permisos_id, rol_permisos_nombre, rol_permisos_descripcion FROM usuario_rol_permisos, rol_permisos WHERE usuario_rol_permisos_rol_permisos_id = rol_permisos_id AND usuario_rol_permisos_usuario_id = ?', [id]);
            data.persmisos_asociados = persmisos_asociados;

            let permisos = await pool.query('SELECT rol_permisos_id, rol_permisos_nombre, rol_permisos_descripcion FROM rol_permisos WHERE rol_permisos_rol_id = ?', [usuario.usuario_rol_id]);
            data.permisos = permisos;

            return data;

        }catch(error){
            return {status:'error', code: error.code};
        }
    },

    async postUsuarioPermisos(PARAMS){

        try{
            let id = parseInt(PARAMS.data.id);
            let permiso = PARAMS.data.value;

            let permiso_valid = await pool.query('SELECT COUNT(*) AS total FROM usuario_rol_permisos WHERE usuario_rol_permisos_rol_permisos_id = ? AND usuario_rol_permisos_usuario_id = ?', [permiso, id]);
            permiso_valid = permiso_valid[0].total;
            if(!permiso_valid){
                let consulta_permiso = await pool.query(`INSERT INTO usuario_rol_permisos (
                                                usuario_rol_permisos_usuario_id, 
                                                usuario_rol_permisos_rol_permisos_id
                                                ) 
                                        VALUES
                                                (?, ?)`, 
                                                [
                                                    id, 
                                                    permiso
                                                ]);
                let permiso_insertId = consulta_permiso.insertId;
                let permiso_id_hash = await genHash('usuario_rol_permisos', permiso_insertId);
                await pool.query('UPDATE usuario_rol_permisos SET usuario_rol_permisos_id_hash = ? WHERE usuario_rol_permisos_id = ? AND usuario_rol_permisos_usuario_id = ? ', [permiso_id_hash, permiso_insertId, id]);
                console.log("Cambia hash");
                return{status: 'ok', permiso_id: permiso_insertId};

            }else{
                return{status: 'error', code: 'Este usuario ya tiene el permiso'};
            }

        }catch(error){
            return {status:'error', code: error.code};
        }
    },

    async postUsuarioPermisosDelete(PARAMS){
        try{
            let usuario_id = PARAMS.data.usuario;
            let permiso_id = PARAMS.data.permiso;
          
            await pool.query('DELETE FROM usuario_rol_permisos WHERE usuario_rol_permisos_id = ? AND usuario_rol_permisos_usuario_id = ?',[permiso_id, usuario_id]);

            return {status: "ok"};
        }catch(error){
            return {status:'error', code: 'Error al eliminar el permiso'};
        }
    },

};
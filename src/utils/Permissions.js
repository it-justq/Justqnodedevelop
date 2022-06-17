const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');


module.exports = {

    async isPermissedTo(usuario_id, rol_id, PERMISSION){

        const permiso = await pool.query('SELECT rol_permisos_id FROM rol_permisos WHERE rol_permisos_nombre = ?', [PERMISSION]);

        if(permiso.length === 0){
            return false;
        }else{
            const isPermissed = await pool.query('SELECT count(*) AS total FROM usuario_rol_permisos WHERE usuario_rol_permisos_usuario_id = ? AND usuario_rol_permisos_rol_permisos_id = ?', [usuario_id, permiso[0].rol_permisos_id]);
            const isPermissedTotal = await pool.query('SELECT count(*) AS total FROM usuario_rol_permisos WHERE usuario_rol_permisos_usuario_id = ? AND usuario_rol_permisos_rol_permisos_id = ?', [usuario_id, 1]);

            if(isPermissed[0].total != 0 || isPermissedTotal[0].total != 0){
                return true;
            }else{
                return false;
            }
        }
        

        
    }

};
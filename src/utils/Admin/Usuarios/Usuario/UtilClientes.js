const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');


module.exports = {

    async getUsuarioClientes(id){

        try{
            let data = [];

            let usuario = await pool.query('SELECT usuario_id, usuario_nombre, usuario_rol_id FROM usuario WHERE usuario_id = ?', [id]);
            usuario = usuario[0];
            data.usuario= usuario;

            let clientes_asociados = await pool.query('SELECT cliente_tecnico_id, cliente_nombre FROM cliente, cliente_tecnico WHERE cliente_tecnico_tecnico_id = ? AND cliente_id = cliente_tecnico_cliente_id ORDER BY cliente_nombre ASC', [id]);
            data.clientes_asociados = clientes_asociados;

            let clientes = await pool.query('SELECT cliente_id, cliente_nombre FROM cliente ORDER BY cliente_nombre ASC');
            data.clientes = clientes;

            return data;

        }catch(error){
            return {status:'error', code: error.code};
        }
    },

    async postUsuarioClientes(id){

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
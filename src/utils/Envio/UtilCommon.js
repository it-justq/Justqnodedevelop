const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');
const {genHash} = require(appRoot+'/utils/Crypto');

module.exports = {

    async refEnvio(id){
        let ref = await pool.query('SELECT envio_transporte_referencia FROM envio WHERE envio_id = ?', [id]);
        return ref[0].envio_transporte_referencia;
    },

    async permisosEnvio(envio_id, userId, rolId){

        let user_id = parseInt(userId);
        let rol_id = parseInt(rolId);
        

        if(rol_id === 1){

            return true;

        }else if(rol_id === 3){
            
            let cliente_envio_id = await pool.query('SELECT envio_cliente_id FROM envio WHERE envio_id = ?', [envio_id]);
            
            let usuario_id = await pool.query('SELECT cliente_usuario_id FROM cliente WHERE cliente_id = ?', [cliente_envio_id[0].envio_cliente_id]);
            
            if(usuario_id[0].cliente_usuario_id == user_id){
                return true;
            }else{
                return false;
            }

        }else{

            return false;

        }

    },

    async idPrecarga(id){
        let control_id = await pool.query('SELECT envio_control_precarga_id FROM envio WHERE envio_id = ?', [id]);
       // control_id_hash = await genHash('control', control_id[0].envio_control_precarga_id);
        return control_id[0].envio_control_precarga_id;
    },

    async idDestino(id){
        let control_id = await pool.query('SELECT envio_control_destino_id FROM envio WHERE envio_id = ?', [id]);
        return control_id[0].envio_control_destino_id;
    },
    
};
const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');


module.exports = {

    async numControl(id){
        let num = await pool.query('SELECT control_codigo FROM control WHERE control_id = ?', [id]);
        return num[0].control_codigo;
    },

    async idControl(HASH){
        let id = await pool.query('SELECT control_id FROM control WHERE control_id_hash = ?', [HASH]);
        return id[0].control_id;
    },
    async hashControl(ID){
        let hash = await pool.query('SELECT control_id_hash FROM control WHERE control_id = ?', [ID]);
        return hash[0].control_id_hash;
    },

    async permisosControl(control_id, userId, rolId){

        let user_id = parseInt(userId);
        let rol_id = parseInt(rolId);


        if(rol_id === 1){

            return true;

        }else if(rol_id === 2){

            let tecnico_control_id = await pool.query('SELECT control_tecnico_id FROM control WHERE control_id = ?', [control_id]);
            if(tecnico_control_id[0].control_tecnico_id === user_id){
                return true;
            }else{
                return false;
            }

        }else if(rol_id === 3){

            let cliente_control_id = await pool.query('SELECT control_cliente_id FROM control WHERE control_id = ?', [control_id]);
            if(cliente_control_id[0].control_cliente_id === user_id){
                return true;
            }else{
                return false;
            }

        }else{

            return false;

        }

    },

    async esPrecarga(id){
        let confirm = await pool. query('SELECT control_tipo_id AS id FROM control WHERE control_id = ?', [id]);

        if(confirm[0].id === 1){
            return true;
        }else{
            return false;
        }
    }
    
};
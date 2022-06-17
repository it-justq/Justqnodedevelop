const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');


module.exports = {

    async numInforme(id){
        let num = await pool.query('SELECT informe_codigo FROM informe WHERE informe_id = ?', [id]);
        return num[0].informe_codigo;
    },

    async idInforme(HASH){
        let id = await pool.query('SELECT informe_id FROM informe WHERE informe_id_hash = ?', [HASH]);
        return id[0].informe_id;
    },
    async hashInforme(ID){
        let hash = await pool.query('SELECT informe_id_hash FROM informe WHERE informe_id = ?', [ID]);
        return hash[0].informe_id_hash;
    },

    async permisosInforme(informe_id, userId, rolId){

        let user_id = parseInt(userId);
        let rol_id = parseInt(rolId);


        if(rol_id === 1){

            return true;

        }else if(rol_id === 2){

            let tecnico_informe_id = await pool.query('SELECT informe_tecnico_id FROM informe WHERE informe_id = ?', [informe_id]);
            if(tecnico_informe_id[0].informe_tecnico_id === user_id){
                return true;
            }else{
                return false;
            }

        }else if(rol_id === 3){

            let cliente_informe_id = await pool.query('SELECT informe_cliente_id FROM informe WHERE informe_id = ?', [informe_id]);
            if(cliente_informe_id[0].informe_cliente_id === user_id){
                return true;
            }else{
                return false;
            }

        }else{

            return false;

        }

    },
    
};
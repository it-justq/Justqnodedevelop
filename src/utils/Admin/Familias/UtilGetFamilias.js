const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');


module.exports = {

    async getFamiliasList(PARAMS, TYPE){

        try{
            let familias;

            switch(TYPE){
                case 'TOTAL': 
                    familias = await pool.query('SELECT familia_nombre, familia_nombre_en, familia_id FROM familia WHERE familia_estado_id = 1 ORDER BY familia_nombre ASC');
                break;

                case 'SEARCH':
                    let familia = PARAMS.data.nombre;
                    familias = await pool.query("SELECT familia_nombre, familia_nombre_en, familia_id FROM familia WHERE familia_estado_id = 1 AND familia_nombre LIKE '%"+familia+"%' union SELECT familia_nombre, familia_nombre_en, familia_id FROM familia WHERE familia_estado_id = 1 AND familia_nombre_en LIKE '%"+familia+"%'  ORDER BY familia_nombre ASC");
                break;
            }

            return familias;

        }catch(error){
            console.log(error)
            return {status:'error', code: error.code};
        }
    },

    


};
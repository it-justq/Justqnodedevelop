const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');


module.exports = {

    async getPaisesList(PARAMS, TYPE){

        try{
            let data;

            switch(TYPE){
                case 'TOTAL': 
                    data = await pool.query('SELECT pais_nombre, pais_nombre_en, pais_id FROM pais ORDER BY pais_nombre ASC');
                break;

                case 'SEARCH':
                    let pais = PARAMS.data.pais_nombre;
                    data = await pool.query("SELECT pais_nombre, pais_nombre_en, pais_id FROM pais WHERE pais_nombre LIKE '%"+pais+"%' union SELECT pais_nombre, pais_nombre_en, pais_id FROM pais WHERE pais_nombre_en LIKE '%"+pais+"%'  ORDER BY pais_nombre ASC");
                break;
            }

            return {status: 'ok', data};

        }catch(error){
            return {status:'error', code: error.code};
        }
    },

    


};
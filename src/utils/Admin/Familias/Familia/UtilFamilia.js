const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');


module.exports = {

    async getFamiliaData(id){

        try{

            let data = await pool.query('SELECT * FROM familia WHERE familia_id = ?', parseInt(id));
            data = data[0];
            data.variedades = await pool.query('SELECT familia_variedad_id, familia_variedad_nombre FROM familia_variedad WHERE familia_variedad_familia_id = ? ORDER BY familia_variedad_nombre ASC', parseInt(id));

            return {status: 'ok', data}

        }catch(error){
            return {status: 'error', code: error.code}
        }
        
    },


};
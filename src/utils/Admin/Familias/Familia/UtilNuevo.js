const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');
const {genHash} = require(appRoot+'/utils/Crypto');

module.exports = {

    async getFamiliaNuevo(){

        try{
            let data = [];
            return data;
        }catch(error){
            return {status:'error', code: error.code};
        }
    },

    async postFamiliaNuevo(DATA){

        try{

            let familia_nombre = DATA.data.familia;
            let familia_nombre_en = DATA.data.familia_en;
            let familia_valid = await pool.query('SELECT COUNT(*) AS total FROM familia WHERE familia_nombre = ?', [familia_nombre]);
            familia_valid = familia_valid[0].total;
            if(!familia_valid){
                let consulta_familia = await pool.query(`INSERT INTO familia (
                                                familia_nombre, 
                                                familia_nombre_en
                                                ) 
                                        VALUES
                                                (?, ?)`, 
                                                [
                                                    familia_nombre, 
                                                    familia_nombre_en
                                                ]);
                let familia_insertId = consulta_familia.insertId;
                let familia_id_hash = await genHash('familia', familia_insertId);
                await pool.query('UPDATE familia SET familia_id_hash = ? WHERE familia_id = ? AND familia_nombre = ? ', [familia_id_hash, familia_insertId, familia_nombre]);
                
                return{status: 'ok', familia_id: familia_insertId};

            }else{
                return{status: 'error', code: 'La familia ya existe'};
            }

        }catch(error){
            return {status:'error', code: error.code};

        }
    },

};
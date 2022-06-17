const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');
const {genHash} = require(appRoot+'/utils/Crypto');

module.exports = {

    async postNuevoPais(DATA){

        try{

            let pais_nombre = DATA.data.pais;
            let pais_nombre_en = DATA.data.pais_en;
            
            let pais_valid = await pool.query('SELECT COUNT(*) AS total FROM pais WHERE pais_nombre = ?', [pais_nombre]);
            pais_valid = pais_valid[0].total;
            if(!pais_valid){
                let consulta_pais = await pool.query(`INSERT INTO pais (
                                                pais_nombre, 
                                                pais_nombre_en
                                                ) 
                                        VALUES
                                                (?, ?)`, 
                                                [
                                                    pais_nombre, 
                                                    pais_nombre_en
                                                ]);
                let pais_insertId = consulta_pais.insertId;
                let pais_id_hash = await genHash('pais', pais_insertId);
                await pool.query('UPDATE pais SET pais_id_hash = ? WHERE pais_id = ? AND pais_nombre = ? ', [pais_id_hash, pais_insertId, pais_nombre]);
                
                return{status: 'ok', pais_id: pais_insertId};

            }else{
                return{status: 'error', code: 'El pais ya existe'};
            }

        }catch(error){
            return {status:'error', code: error.code};

        }
    },

};
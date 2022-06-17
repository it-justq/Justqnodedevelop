const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');
const {genHash} = require(appRoot+'/utils/Crypto');

module.exports = {

    async postPlataformaNuevo(DATA){

        try{

            let plataforma_nombre = DATA.data.plataforma;
            let plataforma_estado = DATA.data.estado;
            let plataforma_valid = await pool.query('SELECT COUNT(*) AS total FROM plataforma WHERE plataforma_nombre = ?', [plataforma_nombre]);
            plataforma_valid = plataforma_valid[0].total;
            if(!plataforma_valid){
                let consulta_plataforma = await pool.query(`INSERT INTO plataforma (
                                                plataforma_nombre, 
                                                plataforma_estado_id
                                                ) 
                                        VALUES
                                                (?, ?)`, 
                                                [
                                                    plataforma_nombre, 
                                                    plataforma_estado
                                                ]);
                let plataforma_insertId = consulta_plataforma.insertId;
                let plataforma_id_hash = await genHash('plataforma', plataforma_insertId);
                await pool.query('UPDATE plataforma SET plataforma_id_hash = ? WHERE plataforma_id = ? AND plataforma_nombre = ? ', [plataforma_id_hash, plataforma_insertId, plataforma_nombre]);
                
                return{status: 'ok', plataforma_id: plataforma_insertId};

            }else{
                return{status: 'error', code: 'La plataforma ya existe'};
            }

        }catch(error){
            return {status:'error', code: error.code};

        }
    },

};
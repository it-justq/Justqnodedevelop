const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');
const {genHash} = require(appRoot+'/utils/Crypto');

module.exports = {
    async postFamiliaEditar(DATA){
        try{
            let familia_nombre = DATA.data.familia;
            let familia_nombre_en = DATA.data.familia_en;
            let familia_id = DATA.data.familia_id;
            
            await pool.query('UPDATE familia SET familia_nombre = ?, familia_nombre_en = ?  WHERE familia_id = ?', [familia_nombre, familia_nombre_en, familia_id]);
            
            return{status: "ok", code: "Familia editada correctamente"};

        }catch(e){
            return {status:'error', code: e.code};
        }
    },

    async postVariedadNuevo(DATA){
        try{
            let variedad = DATA.data.variedad;
            let familia_id = DATA.data.familia_id;
            let variedad_valid = await pool.query('SELECT COUNT(*) AS total FROM familia_variedad WHERE familia_variedad_nombre = ?', [variedad]);
            variedad_valid = variedad_valid[0].total;
            if(!variedad_valid){
                let variedad_insertId = await pool.query('INSERT INTO familia_variedad (familia_variedad_nombre, familia_variedad_familia_id) VALUES (?, ?)', [variedad, familia_id]);
                variedad_insertId = variedad_insertId.insertId;
            
                let variedad_id_hash = await genHash('familia_variedad', variedad_insertId);
            
                await pool.query('UPDATE familia_variedad SET familia_variedad_id_hash = ? WHERE familia_variedad_id = ? AND familia_variedad_nombre = ? ', [variedad_id_hash, variedad_insertId, variedad]);
                
                return{status: 'ok', variedad_id: variedad_insertId};
            }else{
                return{status: 'error', code: 'La variedad ya existe'};
            }
        }catch(e){
            return {status:'error', code: e.code};
        }
    },

    async postVariedadEditar(DATA){
        try {
            let variedad = DATA.data.variedad_mod;
            let variedad_id = DATA.data.variedad_id;
            let familia_id = DATA.data.familia_id;
            
            await pool.query('UPDATE familia_variedad SET familia_variedad_nombre = ? WHERE familia_variedad_id = ? AND familia_variedad_familia_id = ?', [variedad, variedad_id, familia_id]);

            return {status: 'ok'};

        } catch (error) {
            return {status:'error', code: error.code};
        }
    }
};
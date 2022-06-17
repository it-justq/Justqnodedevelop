const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');

module.exports = {

    async postPlataformaEditar(DATA){
        try {
            let plataforma = DATA.data.plataforma_mod;
            let plataforma_estado = DATA.data.estado;
            let plataforma_id = DATA.data.plataforma_id;
            
            await pool.query("UPDATE plataforma SET plataforma_nombre = '"+plataforma+"', plataforma_estado_id = '"+plataforma_estado+"' WHERE plataforma_id = '"+plataforma_id+"'");
            
            return {status: 'ok'};

        } catch (error) {
            return {status:'error', code: error.code};
        }
    }
};
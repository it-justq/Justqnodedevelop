const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');

module.exports = {

    async getDocumentacion(control, idioma){
        
        try{

            let DATA = await pool.query('SELECT foto_control_documentacion_id, foto_control_documentacion_foto FROM foto_control_documentacion WHERE foto_control_documentacion_control_id = ?', [control]);

            let mostrar = false;
            if(DATA.length > 0){
                mostrar = true;
            }

            let DATA_RETURN = {documentacion: DATA, mostrar};

            return {status: 'ok', content: DATA_RETURN};

        }catch(error){
            return {status: 'error', code: 'Error al generar el control PDF'};
        }

    },



};

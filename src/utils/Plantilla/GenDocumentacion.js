const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');
const {genHash} = require(appRoot+'/utils/Crypto');

module.exports = {

    async GenDocumentacion(control_plantilla_id, control_id){

        try{
            let documentacion_plant_data = await pool.query("SELECT * FROM foto_control_documentacion WHERE foto_control_documentacion_control_id = ?", [control_plantilla_id]);
            documentacion_plant_data = documentacion_plant_data[0];

            

            return {status: 'ok'};

        }catch(error){
            console.log(error)
            return {status: 'error'};
        }
    },

    async DelDocumentacion(control_id){

        try{


            return {status: 'ok'};

        }catch(error){
            return {status: 'error'};
        }
    },
}
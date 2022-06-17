const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');
const {genHash} = require(appRoot+'/utils/Crypto');

module.exports = {

    async GenFotos(control_plantilla_id, control_id){

        try{

            let fotos_plant_data = await pool.query("SELECT * FROM foto_control WHERE foto_control_control_id = ?", [control_plantilla_id]);
            fotos_plant_data = fotos_plant_data[0];

            
            return {status: 'ok'};

        }catch(error){
            console.log(error)
            return {status: 'error'};
        }
    },

    async DelFotos(control_id){

        try{


            return {status: 'ok'};

        }catch(error){
            return {status: 'error'};
        }
    },
}
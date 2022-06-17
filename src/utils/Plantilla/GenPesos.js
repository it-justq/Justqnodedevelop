const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');
const {genHash} = require(appRoot+'/utils/Crypto');

module.exports = {

    async GenPesos(control_plantilla_id, control_id){

        try{


            let pesos_plant_data = await pool.query("SELECT * FROM control_peso WHERE control_peso_control_id = ?", [control_plantilla_id]);
            let pesos_img_plant_data = await pool.query("SELECT * FROM foto_control_peso WHERE foto_control_peso_control_id = ? ", [control_plantilla_id]);

            for(let i = 0; i < pesos_plant_data.length; i ++){
                let peso = await pool.query(`INSERT INTO control_peso (
                control_peso_control_id,
                control_peso_valor,
                control_peso_tipo_unidad_id
                ) VALUES (?,?,?)`, [
                control_id,
                pesos_plant_data[i].control_peso_valor,
                pesos_plant_data[i].control_peso_tipo_unidad_id,
                ]);
                
                let peso_hash = await genHash('control_peso', peso.insertId);
                await pool.query('UPDATE control_peso SET control_peso_id_hash = ? WHERE control_peso_id = ? AND control_peso_control_id = ?', [peso_hash, peso.insertId, control_id]);
            
            }
            


            return {status: 'ok'};

        }catch(error){
            console.log(error)
            return {status: 'error'};
        }
    },

    async DelPesos(control_id){

        try{


            return {status: 'ok'};

        }catch(error){
            return {status: 'error'};
        }
    },
}
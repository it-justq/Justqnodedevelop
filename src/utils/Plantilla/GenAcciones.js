const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');
const {genHash} = require(appRoot+'/utils/Crypto');

module.exports = {

    async GenAcciones(control_plantilla_id, control_id){

        try{
                        
            let acciones_plant_data = await pool.query("SELECT * FROM control_accion WHERE control_accion_control_id = ?", [control_plantilla_id]);
            let acciones_img_plant_data = await pool.query("SELECT * FROM foto_control_accion WHERE foto_control_accion_control_id = ? ", [control_plantilla_id]);

            for(let i = 0; i < acciones_plant_data.length; i ++){
                let accion = await pool.query(`INSERT INTO control_accion (
                control_accion_control_id,
                control_accion_tipo_id,
                control_accion_nombre,
                control_accion_nombre_en,
                control_accion_orden
                ) VALUES (?,?,?,?,?)`, [
                control_id,
                acciones_plant_data[i].control_accion_tipo_id,
                acciones_plant_data[i].control_accion_nombre,
                acciones_plant_data[i].control_accion_nombre_en,
                acciones_plant_data[i].control_accion_orden
                ]);           
                
                let accion_hash = await genHash('control_accion', accion.insertId);
                await pool.query('UPDATE control_accion SET control_accion_id_hash = ? WHERE control_accion_id = ? AND control_accion_control_id = ?', [accion_hash, accion.insertId, control_id]);
            
            }


            return {status: 'ok'};

        }catch(error){
            console.log(error)
            return {status: 'error'};
        }
    },

    async DelAcciones(control_id){

        try{


            return {status: 'ok'};

        }catch(error){
            return {status: 'error'};
        }
    },

}
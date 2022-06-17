const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');
const {genHash} = require(appRoot+'/utils/Crypto');

module.exports = {

    async GenPallets(control_plantilla_id, control_id){

        try{

            let pallets_plant_data = await pool.query("SELECT * FROM control_pallet WHERE control_pallet_control_id = ?", [control_plantilla_id]);
            let pallets_img_plant_data = await pool.query("SELECT * FROM foto_control_pallet WHERE foto_control_pallet_control_id = ? ", [control_plantilla_id]);

            for(let i = 0; i < pallets_plant_data.length; i ++){
                let pallet = await pool.query(`INSERT INTO control_pallet (
                control_pallet_control_id,
                control_pallet_sscc_proveedor,
                control_pallet_sscc_plataforma,
                control_pallet_fecha,
                control_pallet_lote,
                control_pallet_producto,
                control_pallet_variedad,
                control_pallet_confeccion,
                control_pallet_marca
                ) VALUES (?,?,?,?,?,?,?,?,?)`, [
                control_id,
                pallets_plant_data[i].control_pallet_sscc_proveedor,
                pallets_plant_data[i].control_pallet_sscc_plataforma,
                pallets_plant_data[i].control_pallet_fecha,
                pallets_plant_data[i].control_pallet_lote,
                pallets_plant_data[i].control_pallet_producto,
                pallets_plant_data[i].control_pallet_variedad,
                pallets_plant_data[i].control_pallet_confeccion,
                pallets_plant_data[i].control_pallet_marca
                ]);     
                
                let pallet_hash = await genHash('control_pallet', pallet.insertId);
                await pool.query('UPDATE control_pallet SET control_pallet_id_hash = ? WHERE control_pallet_id = ? AND control_pallet_control_id = ?', [pallet_hash, pallet.insertId, control_id]);
            
            }



            return {status: 'ok'};

        }catch(error){
            console.log(error)
            return {status: 'error'};
        }
    },

    async DelPallets(control_id){

        try{


            return {status: 'ok'};

        }catch(error){
            return {status: 'error'};
        }
    },
}
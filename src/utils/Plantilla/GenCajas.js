const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');
const {genHash} = require(appRoot+'/utils/Crypto');

module.exports = {

    async GenCajas(control_plantilla_id, control_id){

        try{

            let cajas_plant_data = await pool.query("SELECT * FROM control_caja WHERE control_caja_control_id = ?", [control_plantilla_id]);
            let cajas_img_plant_data = await pool.query("SELECT * FROM foto_control_caja WHERE foto_control_caja_control_id = ? ", [control_plantilla_id]);

            for(let i = 0; i < cajas_plant_data.length; i ++){
                let caja = await pool.query(`INSERT INTO control_caja (
                control_caja_control_id,
                control_caja_orden,
                control_caja_valoracion_id,
                control_caja_familia,
                control_caja_unidades,
                control_caja_peso,
                control_caja_notas,
                control_caja_notas_en
                ) VALUES (?,?,?,?,?,?,?,?)`, [
                control_id,
                cajas_plant_data[i].control_caja_orden,
                cajas_plant_data[i].control_caja_valoracion_id,
                cajas_plant_data[i].control_caja_familia,
                cajas_plant_data[i].control_caja_unidades,
                cajas_plant_data[i].control_caja_peso,
                cajas_plant_data[i].control_caja_notas,
                cajas_plant_data[i].control_caja_notas_en
                ]);    
                
                let caja_hash = await genHash('control_caja', caja.insertId);
                await pool.query('UPDATE control_caja SET control_caja_id_hash = ? WHERE control_caja_id = ? AND control_caja_control_id = ?', [caja_hash, caja.insertId, control_id]);
            
            }

            /*let cajas_tablas_data = await pool.query('SELECT * FROM control_tabla WHERE control_tabla_control_id = ? AND control_tabla_tipo_tabla_id = ?', [control_plantilla_id, 4]);

            for(let i = 0; i < cajas_tablas_data.length; i ++){
                let cajas_tablas_data_res = await pool.query('INSERT INTO control_tabla (control_tabla_control_id, control_tabla_nombre, control_tabla_tipo_tabla_id, control_tabla_filas, control_tabla_columnas, control_tabla_fila_encabezado, control_tabla_columna_encabezado) VALUES (?,?,?,?,?,?,?)', [control_id, cajas_tablas_data[i].control_tabla_nombre, cajas_tablas_data[i].control_tabla_tipo_tabla_id, cajas_tablas_data[i].control_tabla_filas, cajas_tablas_data[i].control_tabla_columnas, cajas_tablas_data[i].control_tabla_fila_encabezado, cajas_tablas_data[i].control_tabla_columna_encabezado]);
                
                let data = await pool.query('SELECT * FROM control_tabla_data WHERE control_tabla_data_control_id = ? AND control_tabla_data_control_tabla_id = ?', [control_plantilla_id, cajas_tablas_data[i].control_tabla_id]);

                for(let x = 0; x < data.length; x++){
                    await pool.query('INSERT INTO control_tabla_data (control_tabla_data_control_tabla_id, control_tabla_data_control_id, control_tabla_data_fila, control_tabla_data_columna, control_tabla_data_valor) VALUES (?,?,?,?,?)', [cajas_tablas_data_res.insertId, control_id, data[x].control_tabla_data_fila, data[x].control_tabla_data_columna, data[x].control_tabla_data_valor]);
                }
            }*/
            


            return {status: 'ok'};

        }catch(error){
            console.log(error)
            return {status: 'error'};
        }
    },

    async DelCajas(control_id){

        try{


            return {status: 'ok'};

        }catch(error){
            return {status: 'error'};
        }
    },
}
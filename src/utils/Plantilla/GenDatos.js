const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');
const {genHash} = require(appRoot+'/utils/Crypto');
const {getDate} = require(appRoot+'/utils/Date'); 

module.exports = {

    async GenDatos(control_codigo, control_plantilla_id, datos_activos, user_id){

        try{

            let datos_plant_data = await pool.query("SELECT * FROM control WHERE control_id = ?", [control_plantilla_id]);
            datos_plant_data = datos_plant_data[0];  

            const actual_time = getDate();

            if(datos_activos === 1){     

                let controlDatosInserted = await pool.query(`INSERT INTO control (
                control_codigo,
                control_fecha,
                control_estado,
                control_plantilla,
                control_enviado_correo,
                control_tipo_id,
                control_subtipo_id,
                control_valoracion_id,
                control_tecnico_id,
                control_cliente_id,
                control_referencia,
                control_nivel_calidad_id,
                control_plataforma_id,
                control_observaciones,
                control_observaciones_en,
                control_expedicion_fecha_llegada,
                control_expedicion_fecha_salida,
                control_expedicion_contenedor,
                control_expedicion_placa,
                control_expedicion_puc_proveedor,
                control_expedicion_pais_origen_id,
                control_expedicion_pais_destino_id,
                control_producto_familia_id,
                control_producto_variedad_id,
                control_producto_calibre,
                control_producto_tipo_confeccion_id,
                control_producto_confeccion,
                control_producto_fecha_confeccion,
                control_producto_marca,
                control_producto_lote,
                control_packaging_peso,
                control_packaging_pallets,
                control_packaging_cajas_pallet,
                control_packaging_peso_neto,
                control_packaging_peso_bruto
                ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, [
                control_codigo,
                actual_time,
                0,
                0,
                0,
                datos_plant_data.control_tipo_id,
                datos_plant_data.control_subtipo_id,
                datos_plant_data.control_valoracion_id,
                user_id,
                datos_plant_data.control_cliente_id,
                datos_plant_data.control_referencia,
                datos_plant_data.control_nivel_calidad_id,
                datos_plant_data.control_plataforma_id,
                datos_plant_data.control_observaciones,
                datos_plant_data.control_observaciones_en,
                datos_plant_data.control_expedicion_fecha_llegada,
                datos_plant_data.control_expedicion_fecha_salida,
                datos_plant_data.control_expedicion_contenedor,
                datos_plant_data.control_expedicion_placa,
                datos_plant_data.control_expedicion_puc_proveedor,
                datos_plant_data.control_expedicion_pais_origen_id,
                datos_plant_data.control_expedicion_pais_destino_id,
                datos_plant_data.control_producto_familia_id,
                datos_plant_data.control_producto_variedad_id,
                datos_plant_data.control_producto_calibre,
                datos_plant_data.control_producto_tipo_confeccion_id,
                datos_plant_data.control_producto_confeccion,
                datos_plant_data.control_producto_fecha_confeccion,
                datos_plant_data.control_producto_marca,
                datos_plant_data.control_producto_lote,
                datos_plant_data.control_packaging_peso,
                datos_plant_data.control_packaging_pallets,
                datos_plant_data.control_packaging_cajas_pallet,
                datos_plant_data.control_packaging_peso_neto,
                datos_plant_data.control_packaging_peso_bruto,
                ]);

                if(controlDatosInserted.insertId != 0){
                    try{
                        let hash = await genHash('control', controlDatosInserted.insertId);
                        await pool.query('UPDATE control SET control_id_hash = ? WHERE control_id = ?', [hash, controlDatosInserted.insertId]);

                        return {status: 'ok', control_id: controlDatosInserted.insertId, hash};
                    }catch(error){
                        console.log(error)
                        return {status: 'error'};
                    }
                }else{
                    return {status: 'error'};
                }

                
            }else if(datos_activos === 0){

                let controlInserted = await pool.query(`INSERT INTO control (
                control_codigo,
                control_estado,
                control_tipo_id,
                control_subtipo_id,
                control_tecnico_id,
                control_cliente_id,
                control_producto_familia_id
                ) VALUES (?,?,?,?,?,?,?)`, [
                control_codigo,
                0,
                datos_plant_data.control_tipo_id,
                datos_plant_data.control_subtipo_id,
                user_id,
                datos_plant_data.control_cliente_id,
                datos_plant_data.control_producto_familia_id
                ]);

                if(controlDatosInserted.insertId != 0){
                    try{
                        let hash = await genHash('control', controlInserted.insertId);
                        await pool.query('UPDATE control SET control_id_hash = ? WHERE control_id = ?', [hash, controlInserted.insertId]);

                        return {status: 'ok', control_id: controlInserted.insertId, hash};
                    }catch(error){
                        console.log(error)
                        return {status: 'error'};
                    }
                }else{
                    return {status: 'error'};
                }
            }

        }catch(error){
            console.log(error)
            return {status: 'error'};
        }
    },

    async DelDatos(control_id){

        try{


            return {status: 'ok'};

        }catch(error){
            return {status: 'error'};
        }
    },
}
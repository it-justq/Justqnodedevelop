const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');
const {escapeDataSlashes, escapeData} = require(appRoot+'/utils/ParseData');

module.exports = {

    async getEnvioDatos(envio_id, envio_hash){
        
        try{
        //------DATOS DEL ENVIO
                let datos_envio = await pool.query('SELECT * FROM envio WHERE envio_id = ?', [envio_id]);
                
                if(datos_envio[0].envio_estado_id == 1){
                    datos_envio[0].envio_estado = "Cargado";
                }else if (datos_envio[0].envio_estado_id == 2){
                    datos_envio[0].envio_estado = "En tránsito";
                }else if (datos_envio[0].envio_estado_id == 3){
                    datos_envio[0].envio_estado = "Entregado";
                }
 
                
        //------DATOS DEL TRANSPORTE
               // let datos_transporte = await pool.query('SELECT * FROM datos_transporte WHERE datos_transporte_envio_id = ?', [envio_id]);
                let datos_envio_producto_nombre = await pool.query('SELECT familia_nombre, familia_nombre_en FROM familia WHERE familia_id = ?', [datos_envio[0].envio_producto]);
                datos_envio[0].envio_producto_nombre = datos_envio_producto_nombre[0].familia_nombre;
                datos_envio[0].envio_producto_nombre_en = datos_envio_producto_nombre[0].familia_nombre_en;
                let datos_envio_pais_origen = await pool.query('SELECT pais_nombre, pais_nombre_en FROM pais WHERE pais_id = ?', [datos_envio[0].envio_pais_origen_id]);
                datos_envio[0].envio_pais_origen_nombre = datos_envio_pais_origen[0].pais_nombre;
                datos_envio[0].envio_pais_origen_nombre_en = datos_envio_pais_origen[0].pais_nombre_en;

                let envio_pais_destino = await pool.query('SELECT pais_nombre, pais_nombre_en FROM pais WHERE pais_id = ?', [datos_envio[0].envio_pais_destino_id]);
                datos_envio[0].envio_pais_destino_nombre = envio_pais_destino[0].pais_nombre;
                datos_envio[0].envio_pais_destino_nombre_en = envio_pais_destino[0].pais_nombre_en;
                console.log(datos_envio[0].envio_tipo_transporte_id)
                if (datos_envio[0].envio_tipo_transporte_id == 1){
                    datos_envio[0].envio_tipo_transporte_nombre = "Terrestre";
                    datos_envio[0].envio_tipo_transporte_nombre_en = "Terrestrial";
                }else if (datos_envio[0].envio_tipo_transporte_id == 2){
                    datos_envio[0].envio_tipo_transporte_nombre = "Marítimo";
                    datos_envio[0].envio_tipo_transporte_nombre_en = "Maritime";
                }else if (datos_envio[0].envio_tipo_transporte_id == 3){
                    datos_envio[0].envio_tipo_transporte_nombre = "Aéreo";
                    datos_envio[0].envio_tipo_transporte_nombre_en = "Air";
                }else{
                    datos_envio[0].envio_tipo_transporte_nombre = "Sin transporte";
                    datos_envio[0].envio_tipo_transporte_nombre_en = "No transport";
                }
        
                let result = {status: "ok", datos: datos_envio[0]};

                return result;
        }catch(error){
                console.log(error);
                return {status:'error', code: 'Error al obtener los datos'};
        }
    },

    async postEnvioDatos(VALUES){

        try {
                let name = await escapeDataSlashes(VALUES.data.name);
                let envio_id = VALUES.envio_id;
                let value = await escapeDataSlashes(VALUES.data.value);


                if(name === 'envio_pais_origen_nombre'){

                        let get_id = await pool.query('SELECT pais_id FROM pais WHERE pais_nombre LIKE ?',[value]);
                        await pool.query('UPDATE envio SET envio_pais_origen_id = ? WHERE envio_id = ?', [get_id[0].pais_id, envio_id]);
                
                }else if(name === 'envio_pais_destino_nombre'){

                    let get_id = await pool.query('SELECT pais_id FROM pais WHERE pais_nombre LIKE ?',[value]);
                    await pool.query('UPDATE envio SET envio_pais_destino_id = ? WHERE envio_id = ?', [get_id[0].pais_id, envio_id]);
            
                }else{
                        await pool.query('UPDATE envio SET '+name+' = ? WHERE envio_id = ?', [value, envio_id]);
                }
                
                
                return {'status':'ok'};
        } catch (error) {
                return {'status':'error', 'code': 'Error al actualizar los datos'};
        }


    },

};
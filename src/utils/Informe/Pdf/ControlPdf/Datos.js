const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');

module.exports = {

    async getDatos(control, idioma){
        
        try{

            let DATA = await pool.query(`SELECT 
                                    control_id,
                                    control_codigo,
                                    control_tipo_id,

                                    control_valoracion_id,
                                    control_cliente_id,
                                    control_cliente_mod,
                                    control_tecnico_id,
                                    control_tecnico_mod,
                                    control_fecha,
                                    control_plataforma_id,
                                    control_plataforma_mod,
                                    control_referencia,

                                    control_expedicion_pais_origen_id,
                                    control_expedicion_pais_origen_mod,
                                    control_expedicion_pais_destino_id,
                                    control_expedicion_pais_destino_mod,
                                    control_expedicion_fecha_llegada,
                                    control_expedicion_fecha_salida,
                                    control_expedicion_contenedor,
                                    control_expedicion_placa,
                                    control_expedicion_puc_proveedor,

                                    control_producto_familia_id,
                                    control_producto_familia_mod,
                                    control_producto_variedad_id,
                                    control_producto_variedad_mod,
                                    control_producto_marca,
                                    control_producto_tipo_confeccion_id,
                                    control_producto_tipo_confeccion_mod,
                                    control_producto_confeccion,
                                    control_producto_fecha_confeccion,
                                    control_producto_calibre,
                                    control_producto_lote,

                                    control_packaging_cajas_pallet,
                                    control_packaging_pallets,
                                    control_packaging_peso,
                                    control_packaging_peso_neto,
                                    control_packaging_peso_bruto,
                                    
                                    control_observaciones,
                                    control_observaciones_en

                                    FROM control 

                                    WHERE control_id = ?`,[control]);


                

     
            let cliente_nombre = await pool.query('SELECT cliente_nombre FROM cliente WHERE cliente_id = ?', [DATA[0].control_cliente_id]);
            DATA[0].control_cliente_nombre = cliente_nombre[0].cliente_nombre;
            
            let tecnico = await pool.query('SELECT usuario_nombre FROM usuario WHERE usuario_id = ?', [DATA[0].control_tecnico_id]);
            DATA[0].control_tecnico_nombre = tecnico[0].usuario_nombre;
            
            let plataforma_nombre =  await pool.query('SELECT plataforma_nombre FROM plataforma WHERE plataforma_id = ?', [DATA[0].control_plataforma_id]);
            DATA[0].control_plataforma_nombre = plataforma_nombre[0].plataforma_nombre;
            


            if(DATA[0].control_expedicion_fecha_llegada === "0000-00-00"){
                DATA[0].control_expedicion_fecha_llegada = "";
            }
            if(DATA[0].control_expedicion_fecha_salida === "0000-00-00"){
                DATA[0].control_expedicion_fecha_salida = "";
            }
            if(DATA[0].control_fecha === "0000-00-00"){
                DATA[0].control_fecha = "";
            }
            if(DATA[0].control_producto_fecha_confeccion === "0000-00-00"){
                DATA[0].control_producto_fecha_confeccion = "";
            }



            let valoracion = await pool.query('SELECT valoracion_nombre, valoracion_nombre_en, valoracion_color_id, color_codigo FROM valoracion, color WHERE valoracion_id = ? AND valoracion_color_id = color_id', [DATA[0].control_valoracion_id]);
            DATA[0].control_valoracion_color = valoracion[0].color_codigo;



            let pais_origen = await pool.query('SELECT pais_nombre, pais_nombre_en FROM pais WHERE pais_id = ?', [DATA[0].control_expedicion_pais_origen_id]);
            let pais_destino = await pool.query('SELECT pais_nombre, pais_nombre_en FROM pais WHERE pais_id = ?', [DATA[0].control_expedicion_pais_destino_id]);


            let familia = await pool.query('SELECT familia_nombre, familia_nombre_en FROM familia WHERE familia_id = ?', [DATA[0].control_producto_familia_id])
            let variedad = await pool.query('SELECT familia_variedad_nombre FROM familia_variedad WHERE familia_variedad_id = ?', [DATA[0].control_producto_variedad_id])
            DATA[0].control_producto_variedad_nombre =  variedad[0].familia_variedad_nombre;

            let tipo_confeccion = await pool.query('SELECT familia_confeccion_tipo_nombre, familia_confeccion_tipo_nombre_en FROM familia_confeccion_tipo WHERE familia_confeccion_tipo_id = ?', [DATA[0].control_producto_tipo_confeccion_id]);


            if(idioma === 'es'){
                DATA[0].control_valoracion_nombre = valoracion[0].valoracion_nombre;
                DATA[0].control_expedicion_pais_origen_nombre = pais_origen[0].pais_nombre;
                DATA[0].control_expedicion_pais_destino_nombre = pais_destino[0].pais_nombre;
                DATA[0].control_producto_familia_nombre = familia[0].familia_nombre;
                DATA[0].control_producto_tipo_confeccion_nombre =  tipo_confeccion[0].familia_confeccion_tipo_nombre;
                DATA[0].control_notas = DATA[0].control_observaciones;

            }else if(idioma === 'en'){
                DATA[0].control_valoracion_nombre = valoracion[0].valoracion_nombre_en;
                DATA[0].control_expedicion_pais_origen_nombre = pais_origen[0].pais_nombre_en;
                DATA[0].control_expedicion_pais_destino_nombre = pais_destino[0].pais_nombre_en;
                DATA[0].control_producto_familia_nombre = familia[0].familia_nombre_en;
                DATA[0].control_producto_tipo_confeccion_nombre =  tipo_confeccion[0].familia_confeccion_tipo_nombre_en;
                DATA[0].control_notas = DATA[0].control_observaciones_en;

            }


            if(DATA[0].control_cliente_mod !== 'null'){DATA[0].control_cliente_nombre = DATA[0].control_cliente_mod};
            if(DATA[0].control_tecnico_mod != 'null'){DATA[0].control_tecnico_nombre = DATA[0].control_tecnico_mod};
            if(DATA[0].control_plataforma_mod !== 'null'){DATA[0].control_plataforma_nombre = DATA[0].control_plataforma_mod};
            if(DATA[0].control_producto_familia_mod != 'null'){DATA[0].control_producto_familia_nombre = DATA[0].control_producto_familia_mod};
            if(DATA[0].control_producto_variedad_mod != 'null'){DATA[0].control_producto_variedad_nombre = DATA[0].control_producto_variedad_mod};
            if(DATA[0].control_producto_tipo_confeccion_mod != 'null'){DATA[0].control_producto_tipo_confeccion_nombre = DATA[0].control_producto_tipo_confeccion_mod};
            if(DATA[0].control_expedicion_pais_origen_mod != 'null'){DATA[0].control_expedicion_pais_origen_nombre = DATA[0].control_expedicion_pais_origen_mod};
            if(DATA[0].control_expedicion_pais_destino_mod != 'null'){DATA[0].control_expedicion_pais_destino_nombre = DATA[0].control_expedicion_pais_destino_mod};

            

            /*switch(DATA[0].control_tipo_id){

                case 1:
                    DATA[0].control_lugar = DATA[0].control_expedicion_pais_origen_nombre;
                break;
                case 2:
                    DATA[0].control_lugar = DATA[0].control_plataforma_nombre;
                break;
                case 3:
                    DATA[0].control_lugar = DATA[0].control_expedicion_pais_destino_nombre;
                break;
                case 4:
                    DATA[0].control_lugar = DATA[0].control_plataforma_nombre;
                break;
            }*/

            switch(DATA[0].control_tipo_id){

                case 1:
                    DATA[0].control_lugar = DATA[0].control_expedicion_pais_origen_nombre;
                break;
                case 2:
                    DATA[0].control_lugar = DATA[0].control_expedicion_pais_origen_nombre;
                break;
                case 3:
                    DATA[0].control_lugar = DATA[0].control_expedicion_pais_destino_nombre;
                break;
                case 4:
                    DATA[0].control_lugar = DATA[0].control_expedicion_pais_origen_nombre;
                break;
            }

        

            return {status: 'ok', data: DATA};

        }catch(error){
            return {status: 'error', code: 'Error al generar el control PDF'};
        }

    },



};

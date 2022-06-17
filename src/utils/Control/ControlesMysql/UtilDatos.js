const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');
const {translateText} = require(appRoot+'/utils/Traductor');
const {escapeDataSlashes, escapeData} = require(appRoot+'/utils/ParseData');

module.exports = {

    async getControlDatos(control_id, control_hash){

        try{
        //------DATOS DEL CONTROL
                let datos_control = await pool.query('SELECT control_valoracion_id, control_cliente_id, control_cliente_mod, control_tecnico_id, control_tecnico_mod, control_fecha, control_plataforma_id, control_plataforma_mod, control_referencia FROM control WHERE control_id = ?', [control_id]);
                
                let datos_control_valoracion_nombre = await pool.query('SELECT valoracion_nombre, valoracion_nombre_en FROM valoracion WHERE valoracion_id = ?', [datos_control[0].control_valoracion_id]);
                datos_control[0].control_valoracion_nombre = datos_control_valoracion_nombre[0].valoracion_nombre;
                datos_control[0].control_valoracion_nombre_en = datos_control_valoracion_nombre[0].valoracion_nombre_en;

                let datos_control_plataforma_nombre = await pool.query('SELECT plataforma_nombre FROM plataforma WHERE plataforma_id = ?', [datos_control[0].control_plataforma_id]);
                datos_control[0].control_plataforma_nombre = datos_control_plataforma_nombre[0].plataforma_nombre;

                let datos_control_cliente_nombre = await pool.query('SELECT cliente_nombre FROM cliente WHERE cliente_id = ?', [datos_control[0].control_cliente_id]);
                datos_control[0].control_cliente_nombre = datos_control_cliente_nombre[0].cliente_nombre;

                let datos_control_tecnico_nombre = await pool.query('SELECT usuario_nombre FROM usuario WHERE usuario_id = ?', [datos_control[0].control_tecnico_id]);
                datos_control[0].control_tecnico_nombre = datos_control_tecnico_nombre[0].usuario_nombre;

                let datos_control_cliente_id = await pool.query('SELECT cliente_id_hash FROM cliente WHERE cliente_id = ?', [datos_control[0].control_cliente_id]);
                datos_control[0].control_cliente_id = datos_control_cliente_id[0].cliente_id_hash;

        //------DATOS DE LA EXPEDICION
                let datos_expedicion = await pool.query('SELECT control_expedicion_fecha_llegada, control_expedicion_fecha_salida, control_expedicion_contenedor, control_expedicion_placa, control_expedicion_puc_proveedor, control_expedicion_pais_origen_id, control_expedicion_pais_origen_mod, control_expedicion_pais_destino_id, control_expedicion_pais_destino_mod FROM control WHERE control_id = ?', [control_id]);
        
                let datos_expedicion_pais_origen_nombre = await pool.query('SELECT pais_nombre, pais_nombre_en FROM pais WHERE pais_id = ?', [datos_expedicion[0].control_expedicion_pais_origen_id]);
                datos_expedicion[0].control_expedicion_pais_origen_nombre = datos_expedicion_pais_origen_nombre[0].pais_nombre;
                datos_expedicion[0].control_expedicion_pais_origen_nombre_en = datos_expedicion_pais_origen_nombre[0].pais_nombre_en;

                let datos_expedicion_pais_destino_nombre = await pool.query('SELECT pais_nombre, pais_nombre_en  FROM pais WHERE pais_id = ?', [datos_expedicion[0].control_expedicion_pais_destino_id]);
                datos_expedicion[0].control_expedicion_pais_destino_nombre = datos_expedicion_pais_destino_nombre[0].pais_nombre;
                datos_expedicion[0].control_expedicion_pais_destino_nombre_en = datos_expedicion_pais_destino_nombre[0].pais_nombre_en;

        //------DATOS DEL PRODUCTO
                let datos_producto = await pool.query('SELECT control_producto_familia_id, control_producto_familia_mod, control_producto_variedad_id, control_producto_variedad_mod, control_producto_calibre, control_producto_tipo_confeccion_id, control_producto_tipo_confeccion_mod, control_producto_confeccion, control_producto_fecha_confeccion, control_producto_marca, control_producto_lote FROM control WHERE control_id = ?', [control_id]);

                let datos_producto_familia_nombre = await pool.query('SELECT familia_nombre, familia_nombre_en FROM familia WHERE familia_id = ?', [datos_producto[0].control_producto_familia_id]);
                datos_producto[0].control_producto_familia_nombre = datos_producto_familia_nombre[0].familia_nombre;
                datos_producto[0].control_producto_familia_nombre_en = datos_producto_familia_nombre[0].familia_nombre_en;

                let datos_producto_variedad_nombre = await pool.query('SELECT familia_variedad_nombre FROM familia_variedad WHERE familia_variedad_id = ?', [datos_producto[0].control_producto_variedad_id]);
                datos_producto[0].control_producto_variedad_nombre = datos_producto_variedad_nombre[0].familia_variedad_nombre;


                let datos_producto_tipo_confeccion_nombre = await pool.query('SELECT familia_confeccion_tipo_nombre FROM familia_confeccion_tipo WHERE familia_confeccion_tipo_id = ?', [datos_producto[0].control_producto_tipo_confeccion_id]);
                datos_producto[0].control_producto_tipo_confeccion_nombre = datos_producto_tipo_confeccion_nombre[0].familia_confeccion_tipo_nombre;

        //------DATOS DEL EMBALAJE
                let datos_embalaje = await pool.query('SELECT control_packaging_cajas_pallet, control_packaging_pallets, control_packaging_peso, control_packaging_peso_bruto, control_packaging_peso_neto FROM control WHERE control_id = ?', [control_id]);

        //------NOTAS
                let data_notas = await pool.query('SELECT control_observaciones FROM control WHERE control_id = ?', [control_id]);


        //------INFORMACION DE LOS INFORMES




                let util_valoraciones = await pool.query('SELECT valoracion.valoracion_nombre, valoracion.valoracion_nombre_en, valoracion.valoracion_id_hash as valoracion_id, color.color_codigo FROM valoracion, color WHERE valoracion.valoracion_color_id = color.color_id');
                let util_plataformas = await pool.query('SELECT plataforma_id_hash as plataforma_id, plataforma_nombre FROM plataforma ORDER BY plataforma_nombre ASC');
                let util_paises = await pool.query('SELECT pais_id_hash as pais_id, pais_nombre, pais_nombre_en FROM pais ORDER BY pais_nombre ASC');
                let util_familias = await pool.query('SELECT familia_id_hash as familia_id, familia_nombre, familia_nombre_en FROM familia ORDER BY familia_nombre ASC');
                let util_variedades = await pool.query('SELECT familia_variedad_id_hash as familia_variedad_id, familia_variedad_nombre FROM familia_variedad WHERE familia_variedad_estado_id = 1 AND familia_variedad_familia_id = ? ORDER BY familia_variedad_nombre ASC', [datos_producto[0].control_producto_familia_id]);
                let util_confecciones = await pool.query('SELECT familia_confeccion_tipo_id_hash as familia_confeccion_tipo_id, familia_confeccion_tipo_nombre FROM familia_confeccion_tipo ORDER BY familia_confeccion_tipo_nombre ASC');
                let util_clientes = await pool.query('SELECT cliente_id_hash as cliente_id, cliente_nombre FROM cliente ORDER BY cliente_nombre ASC');

        
                let result = {status: "ok", datos: datos_control[0], expedicion: datos_expedicion[0], producto: datos_producto[0], embalaje: datos_embalaje[0], notas: data_notas[0], valoraciones: util_valoraciones, plataformas: util_plataformas, paises: util_paises, familias: util_familias, variedades: util_variedades, confecciones: util_confecciones, clientes: util_clientes};

                return result;
        }catch(error){
                return {status:'error', code: 'Error al obtener los datos'};
        }
    },

    async postControlDatos(VALUES){

        try {
                let name = await escapeDataSlashes(VALUES.data.name);
                let control_id = VALUES.control_id;
                let value = await escapeDataSlashes(VALUES.data.value);

                let type_mod = name.charAt(name.length-4) +name.charAt(name.length-3) + name.charAt(name.length-2) + name.charAt(name.length-1);
                if(type_mod === '_mod' && value.length === 0){
                        value = 'null';
                }

                if(name === 'control_observaciones'){

                        let traducido = await translateText(value,'es','en')
                        await pool.query('UPDATE control SET control_observaciones = ?, control_observaciones_en = ? WHERE control_id = ?', [value, traducido, control_id]);

                }else if(name === 'control_valoracion_id'){

                        let get_id = await pool.query('SELECT valoracion_id FROM valoracion WHERE valoracion_id_hash = ?',[value]);
                        await pool.query('UPDATE control SET control_valoracion_id = ? WHERE control_id = ?', [get_id[0].valoracion_id, control_id]);
                
                }else if(name === 'control_plataforma_id'){
                        
                        let get_id = await pool.query('SELECT plataforma_id FROM plataforma WHERE plataforma_id_hash = ?',[value]);
                        await pool.query('UPDATE control SET control_plataforma_id = ? WHERE control_id = ?', [get_id[0].plataforma_id, control_id]);
                
                }else if(name === 'control_expedicion_pais_origen_id'){

                        let get_id = await pool.query('SELECT pais_id FROM pais WHERE pais_id_hash = ?',[value]);
                        await pool.query('UPDATE control SET control_expedicion_pais_origen_id = ? WHERE control_id = ?', [get_id[0].pais_id, control_id]);
                
                }else if(name === 'control_expedicion_pais_destino_id'){

                        let get_id = await pool.query('SELECT pais_id FROM pais WHERE pais_id_hash = ?',[value]);
                        await pool.query('UPDATE control SET control_expedicion_pais_destino_id = ? WHERE control_id = ?', [get_id[0].pais_id, control_id]);
                
                }else if(name === 'control_producto_familia_id'){

                        let get_id = await pool.query('SELECT familia_id FROM familia WHERE familia_id_hash = ?',[value]);
                        await pool.query('UPDATE control SET control_producto_familia_id = ? WHERE control_id = ?', [get_id[0].familia_id, control_id]);
                
                }else if(name === 'control_producto_variedad_id'){

                        let get_id = await pool.query('SELECT familia_variedad_id FROM familia_variedad WHERE familia_variedad_id_hash = ?',[value]);
                        await pool.query('UPDATE control SET control_producto_variedad_id = ? WHERE control_id = ?', [get_id[0].familia_variedad_id, control_id]);
                
                }else if(name === 'control_producto_tipo_confeccion_id'){

                        let get_id = await pool.query('SELECT familia_confeccion_tipo_id FROM familia_confeccion_tipo WHERE familia_confeccion_tipo_id_hash = ?',[value]);
                        await pool.query('UPDATE control SET control_producto_tipo_confeccion_id = ? WHERE control_id = ?', [get_id[0].familia_confeccion_tipo_id, control_id]);
                
                }else if(name === 'control_cliente_id'){

                        let get_id = await pool.query('SELECT cliente_id FROM cliente WHERE cliente_id_hash = ?',[value]);
                        await pool.query('UPDATE control SET control_cliente_id = ? WHERE control_id = ?', [get_id[0].cliente_id, control_id]);

                }else if (name === 'control_expedicion_contenedor'){
                        let contenedor = await escapeData(value);
                        await pool.query('UPDATE control SET '+name+' = ? WHERE control_id = ?', [contenedor, control_id]);
                }else{
                        await pool.query('UPDATE control SET '+name+' = ? WHERE control_id = ?', [value, control_id]);
                }
                
                
                return {'status':'ok'};
        } catch (error) {
                return {'status':'error', 'code': 'Error al actualizar los datos'};
        }


    },


};
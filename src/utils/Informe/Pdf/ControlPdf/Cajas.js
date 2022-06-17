const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');

module.exports = {

    async getCajas(control, idioma){
        
        try{


            let DATA;


            if(idioma === 'es'){
                DATA = await pool.query('SELECT control_caja_id, control_caja_orden, control_caja_valoracion_id, control_caja_familia, control_caja_unidades, control_caja_peso, control_caja_notas FROM control_caja WHERE control_caja_control_id = ? ORDER BY control_caja_orden', [control]); 
            }else if(idioma === 'en'){
                DATA = await pool.query('SELECT control_caja_id, control_caja_orden, control_caja_valoracion_id, control_caja_familia, control_caja_unidades, control_caja_peso, control_caja_notas_en AS control_caja_notas FROM control_caja WHERE control_caja_control_id = ? ORDER BY control_caja_orden', [control]); 
            }

            if(DATA.length > 0){
                for(let i = 0; i< DATA.length; i++){
                    if(idioma === 'es'){
                        DATA[i].valoracion  = await pool.query('SELECT valoracion_nombre, color_codigo FROM valoracion, color WHERE valoracion_id = ? AND valoracion_color_id = color_id',[DATA[i].control_caja_valoracion_id]);
                    }else if(idioma === 'en'){
                        DATA[i].valoracion  = await pool.query('SELECT valoracion_nombre_en AS valoracion_nombre, color_codigo FROM valoracion, color WHERE valoracion_id = ? AND valoracion_color_id = color_id',[DATA[i].control_caja_valoracion_id]);
                    }
                }
            }


            DATA.fotos = await pool.query('SELECT foto_control_caja_id, foto_control_caja_foto_nombre, control_caja_orden FROM foto_control_caja, control_caja WHERE foto_control_caja_control_id = ? AND control_caja_id = foto_control_caja_control_caja_id AND foto_control_caja_tipo = ? ORDER BY control_caja_orden ASC',[control, 0]);
            DATA.fotos_principal = await pool.query('SELECT foto_control_caja_id, foto_control_caja_foto_nombre FROM foto_control_caja WHERE foto_control_caja_control_id = ? AND foto_control_caja_tipo = ?',[control, 1]);

            let mostrar_fotos = false;
            if(DATA.fotos_principal.length > 0 || DATA.fotos.length > 0){
                mostrar_fotos = true;
            }

            let mostrar = false;
            if(DATA.length > 0){
                mostrar = true;
            }

            let DATA_RETURN = {cajas: DATA, mostrar, mostrar_fotos};

            return {status: 'ok', content: DATA_RETURN};
        }catch(error){
            return {status: 'error', code: 'Error al generar el control PDF'};
        }

    },



};

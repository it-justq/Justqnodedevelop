const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');

module.exports = {

    async getPrecarga(control, idioma){
        
        try{

            let DATA;

            if(idioma === 'es'){
                DATA = await pool.query('SELECT control_grupo_control_grupo_control_id, grupo_control_nombre FROM control_grupo_control, grupo_control WHERE grupo_control_id = control_grupo_control_grupo_control_id AND control_grupo_control_tipo_control_id = ? AND control_grupo_control_control_id = ?', [1, control]);
            }else if(idioma === 'en'){
                DATA = await pool.query('SELECT control_grupo_control_grupo_control_id, grupo_control_nombre_en AS grupo_control_nombre FROM control_grupo_control, grupo_control WHERE grupo_control_id = control_grupo_control_grupo_control_id AND control_grupo_control_tipo_control_id = ? AND control_grupo_control_control_id = ?', [1, control]);
            }

            for(i=0; i<DATA.length; i++){
                if(idioma === 'es'){
                    DATA[i].puntos_control = await pool.query("SELECT punto_control_id, punto_control_nombre, punto_control_tipo_dato_id, control_punto_control_valor FROM punto_control, control_punto_control WHERE punto_control_id = control_punto_control_punto_control_id AND control_punto_control_control_id = ? AND punto_control_grupo_control_id = ?", [control, DATA[i].control_grupo_control_grupo_control_id]); 
                }else if(idioma === 'en'){
                    DATA[i].puntos_control = await pool.query("SELECT punto_control_id, punto_control_nombre_en AS punto_control_nombre, punto_control_tipo_dato_id, control_punto_control_valor_en AS control_punto_control_valor FROM punto_control, control_punto_control WHERE punto_control_id = control_punto_control_punto_control_id AND control_punto_control_control_id = ? AND punto_control_grupo_control_id = ?", [control, DATA[i].control_grupo_control_grupo_control_id]); 
                }
            }
            for(i=0; i<DATA.length; i++){
                for(x=0; x<DATA[i].puntos_control.length; x++){
                    if(DATA[i].puntos_control[x].punto_control_tipo_dato_id === 3){
                        if(idioma === 'es'){
                            DATA[i].puntos_control[x].agrupacion = await pool.query("SELECT punto_control_agrupacion_id, punto_control_agrupacion_nombre, control_punto_control_agrupacion_valor FROM punto_control_agrupacion, control_punto_control_agrupacion WHERE punto_control_agrupacion_punto_control_id = ? AND control_punto_control_agrupacion_control_id = ? AND control_punto_control_agrupacion_punto_control_id = punto_control_agrupacion_punto_control_id AND control_punto_control_agrupacion_agrupacion_id = punto_control_agrupacion_id", [DATA[i].puntos_control[x].punto_control_id, control]);    
                        }else if(idioma === 'en'){
                            DATA[i].puntos_control[x].agrupacion = await pool.query("SELECT punto_control_agrupacion_id, punto_control_agrupacion_nombre_en AS punto_control_agrupacion_nombre, control_punto_control_agrupacion_valor_en AS control_punto_control_agrupacion_valor FROM punto_control_agrupacion, control_punto_control_agrupacion WHERE punto_control_agrupacion_punto_control_id = ? AND control_punto_control_agrupacion_control_id = ? AND control_punto_control_agrupacion_punto_control_id = punto_control_agrupacion_punto_control_id AND control_punto_control_agrupacion_agrupacion_id = punto_control_agrupacion_id", [DATA[i].puntos_control[x].punto_control_id, control]);    
                        }
                    }
                }
            }

            return {status: 'ok', data: DATA};

        }catch(error){
            return {status: 'error', code: 'Error al generar el control PDF'};
        }

    },



};

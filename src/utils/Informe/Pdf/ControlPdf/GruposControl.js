const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');

module.exports = {

    async getGruposControl(control, idioma){
        
        try{

            let DATA;

            if(idioma === 'es'){
                DATA = await pool.query('SELECT control_grupo_control_grupo_control_id, control_grupo_control_valor, control_grupo_control_valoracion_id, grupo_control_nombre FROM control_grupo_control, grupo_control WHERE grupo_control_id = control_grupo_control_grupo_control_id AND control_grupo_control_tipo_control_id != 1 AND control_grupo_control_control_id = ?', [control]);
            }else if(idioma === 'en'){
                DATA = await pool.query('SELECT control_grupo_control_grupo_control_id, control_grupo_control_valor, control_grupo_control_valoracion_id, grupo_control_nombre_en AS grupo_control_nombre FROM control_grupo_control, grupo_control WHERE grupo_control_id = control_grupo_control_grupo_control_id AND control_grupo_control_tipo_control_id != 1 AND control_grupo_control_control_id = ?', [control]);
            }

            
            for(i=0; i<DATA.length; i++){
                if(idioma === 'es'){
                    DATA[i].valoracion = await pool.query('SELECT valoracion_nombre, color_codigo FROM valoracion, color WHERE valoracion_id = ? AND valoracion_color_id = color_id', [DATA[i].control_grupo_control_valoracion_id]);
                    DATA[i].puntos_control = await pool.query("SELECT punto_control_id, control_punto_control_punto_control_id, punto_control_nombre, punto_control_tipo_dato_id, control_punto_control_valor, control_punto_control_valoracion_id FROM punto_control, control_punto_control WHERE punto_control_id = control_punto_control_punto_control_id AND control_punto_control_control_id = ? AND punto_control_grupo_control_id = ?", [control, DATA[i].control_grupo_control_grupo_control_id]);
                }else if(idioma === 'en'){
                    DATA[i].valoracion = await pool.query('SELECT valoracion_nombre_en AS valoracion_nombre, valoracion_nombre_en, color_codigo FROM valoracion, color WHERE valoracion_id = ? AND valoracion_color_id = color_id', [DATA[i].control_grupo_control_valoracion_id]);
                    DATA[i].puntos_control = await pool.query("SELECT punto_control_id, control_punto_control_punto_control_id, punto_control_nombre_en AS punto_control_nombre, punto_control_tipo_dato_id, control_punto_control_valor_en AS control_punto_control_valor, control_punto_control_valoracion_id FROM punto_control, control_punto_control WHERE punto_control_id = control_punto_control_punto_control_id AND control_punto_control_control_id = ? AND punto_control_grupo_control_id = ?", [control, DATA[i].control_grupo_control_grupo_control_id]);
                }
                 
                
                if(DATA[i].grupo_control_nombre === null || DATA[i].grupo_control_nombre === 'null' || DATA[i].grupo_control_nombre === ""){
                    DATA[i].nombre_activo = false;
                }else{
                    DATA[i].nombre_activo = true;
                }

            }


            for(let i = 0; i< DATA.length; i ++){

                DATA[i].mostrar = DATA[i].control_grupo_control_valoracion_id;

                for(let x = 0; x < DATA[i].puntos_control.length; x ++){
                    if(DATA[i].puntos_control[x].control_punto_control_valor != 'null'){
                        DATA[i].mostrar ++;
                    }

                    if(DATA[i].puntos_control[x].control_punto_control_valoracion_id != 0){
                        DATA[i].mostrar ++;
                    }
                }

            }


            let pc_fotos_total = 0

            for(i=0; i<DATA.length; i++){
                for(x=0; x<DATA[i].puntos_control.length; x++){

                    if(idioma === 'es'){
                        DATA[i].puntos_control[x].valoracion = await pool.query('SELECT valoracion_nombre, color_codigo FROM valoracion, color WHERE valoracion_id = ? AND valoracion_color_id = color_id',[DATA[i].puntos_control[x].control_punto_control_valoracion_id]);
                        DATA[i].puntos_control[x].fotos = await pool.query('SELECT foto_punto_control_foto, punto_control_nombre FROM foto_punto_control, punto_control WHERE foto_punto_control_punto_control_id = ? AND foto_punto_control_control_id = ? AND foto_punto_control_punto_control_id = punto_control_id',[DATA[i].puntos_control[x].control_punto_control_punto_control_id, control]);
                    }else if(idioma === 'en'){
                        DATA[i].puntos_control[x].valoracion = await pool.query('SELECT valoracion_nombre_en AS valoracion_nombre, color_codigo FROM valoracion, color WHERE valoracion_id = ? AND valoracion_color_id = color_id',[DATA[i].puntos_control[x].control_punto_control_valoracion_id]);
                        DATA[i].puntos_control[x].fotos = await pool.query('SELECT foto_punto_control_foto, punto_control_nombre_en AS punto_control_nombre FROM foto_punto_control, punto_control WHERE foto_punto_control_punto_control_id = ? AND foto_punto_control_control_id = ? AND foto_punto_control_punto_control_id = punto_control_id',[DATA[i].puntos_control[x].control_punto_control_punto_control_id, control]);
                    }

                    DATA[i].puntos_control[x].fotos_total = await pool.query('SELECT COUNT(*) AS total FROM foto_punto_control WHERE foto_punto_control_punto_control_id = ? AND foto_punto_control_control_id = ?',[DATA[i].puntos_control[x].control_punto_control_punto_control_id, control]);
                    pc_fotos_total = pc_fotos_total + DATA[i].puntos_control[x].fotos_total[0].total;

                }

                DATA[i].puntos_control_añadidos = await pool.query('SELECT * FROM control_punto_control_añadidos WHERE control_punto_control_añadidos_control_id = ? AND control_punto_control_añadidos_grupo_control_id = ?', [control, DATA[i].control_grupo_control_grupo_control_id]);
                for(z=0; z<DATA[i].puntos_control_añadidos.length; z++){
                    if(idioma === 'es'){
                        DATA[i].puntos_control_añadidos[z].valoracion = await pool.query('SELECT valoracion_nombre, color_codigo FROM valoracion, color WHERE valoracion_id = ? AND valoracion_color_id = color_id',[DATA[i].puntos_control_añadidos[z].control_punto_control_añadidos_valoracion_id]);
                        DATA[i].puntos_control_añadidos[z].fotos = await pool.query('SELECT foto_punto_control_añadido_foto, control_punto_control_añadidos_nombre FROM foto_punto_control_añadido, control_punto_control_añadidos WHERE foto_punto_control_añadido_punto_control_id = ? AND foto_punto_control_añadido_control_id = ? AND control_punto_control_añadidos_id = foto_punto_control_añadido_punto_control_id',[DATA[i].puntos_control_añadidos[z].control_punto_control_añadidos_id, control]);
                    }else if(idioma === 'en'){
                        DATA[i].puntos_control_añadidos[z].valoracion = await pool.query('SELECT valoracion_nombre_en AS valoracion_nombre, color_codigo FROM valoracion, color WHERE valoracion_id = ? AND valoracion_color_id = color_id',[DATA[i].puntos_control_añadidos[z].control_punto_control_añadidos_valoracion_id]);
                        DATA[i].puntos_control_añadidos[z].fotos = await pool.query('SELECT foto_punto_control_añadido_foto, control_punto_control_añadidos_nombre_en AS control_punto_control_añadidos_nombre FROM foto_punto_control_añadido, control_punto_control_añadidos WHERE foto_punto_control_añadido_punto_control_id = ? AND foto_punto_control_añadido_control_id = ? AND control_punto_control_añadidos_id = foto_punto_control_añadido_punto_control_id',[DATA[i].puntos_control_añadidos[z].control_punto_control_añadidos_id, control]);

                    }

                    DATA[i].puntos_control_añadidos[z].fotos_total = await pool.query('SELECT COUNT(*) AS total FROM foto_punto_control_añadido WHERE foto_punto_control_añadido_punto_control_id = ? AND foto_punto_control_añadido_control_id = ?',[DATA[i].puntos_control_añadidos[z].control_punto_control_añadidos_id, control]);
                    pc_fotos_total = pc_fotos_total + DATA[i].puntos_control_añadidos[z].fotos_total[0].total;

                    DATA[i].mostrar = DATA[i].mostrar + DATA[i].puntos_control_añadidos.length;
                }

            }

            let mostrar_fotos = false;

            if(pc_fotos_total > 0){
                mostrar_fotos = true;
            }

            let mostrar = false;

            for(let i = 0; i< DATA.length; i ++){
                if(DATA[i].mostrar > 0){
                    DATA[i].mostrar = true;
                    mostrar = true;
                }else{
                    DATA[i].mostrar = false;
                }
            }

            let DATA_RETURN = {grupos_control: DATA, mostrar, mostrar_fotos};
            
            return {status: 'ok', content: DATA_RETURN};

        }catch(error){
            return {status: 'error', code: 'Error al generar el control PDF'};
        }

    },



};

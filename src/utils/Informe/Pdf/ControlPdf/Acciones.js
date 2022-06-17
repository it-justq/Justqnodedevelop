const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');

module.exports = {

    async getAcciones(control, idioma){
        
        try{

            let DATA;
            let mostrar_acciones = 0;
            let mostrar = false;

            if(idioma === 'es'){
                DATA = await pool.query('SELECT control_accion_id, control_accion_orden, control_accion_nombre FROM control_accion WHERE control_accion.control_accion_control_id = ?', [control]);
            }else if(idioma === 'en'){
                DATA = await pool.query('SELECT control_accion_id, control_accion_orden, control_accion_nombre_en AS control_accion_nombre FROM control_accion WHERE control_accion.control_accion_control_id = ?', [control]);
            }


            for(i=0; i<DATA.length; i++){
                DATA[i].imagenes = await pool.query('SELECT foto_control_accion_id, foto_control_accion_foto, foto_control_accion_ref FROM foto_control_accion WHERE foto_control_accion_control_id = ? AND foto_control_accion_ref = ?', [control, parseInt(DATA[i].control_accion_orden, 10)]);
                mostrar_acciones = mostrar_acciones + 1;

                let acciones_imagenes_length = DATA[i].imagenes.length;
                for(let i = 0; i<acciones_imagenes_length; i++){
                    mostrar_acciones = mostrar_acciones + 1;
                }

            }

            DATA.imagenesRef0 = await pool.query('SELECT foto_control_accion_id, foto_control_accion_foto, foto_control_accion_ref FROM foto_control_accion WHERE foto_control_accion_control_id = ? AND foto_control_accion_ref = ?', [control, 0]);

            for(let i = 0; i<DATA.imagenesRef0.length; i++){
                mostrar_acciones = mostrar_acciones + 1;
            }

            if(mostrar_acciones != 0){
                mostrar = true;
            }

            
            let DATA_RETURN = {acciones: DATA, mostrar};

            return {status: 'ok', content: DATA_RETURN};

        }catch(error){
            return {status: 'error', code: 'Error al generar el control PDF'};
        }

    },



};

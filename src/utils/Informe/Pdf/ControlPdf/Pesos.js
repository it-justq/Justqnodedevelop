const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');

module.exports = {

    async getPesos(control, idioma){
        
        try{

            let DATA = await pool.query('SELECT control_peso_id, control_peso_valor, control_peso_tipo_unidad_id FROM control_peso WHERE control_peso_control_id = ?', [control]);

            let peso_total = 0;
            let numero_pesos = 0;

            if(DATA.length > 0){
                for(i=0; i<DATA.length; i++){
                    let tipo_unidad_nombre = await pool.query('SELECT tipo_unidad_nombre, tipo_unidad_nombre_en FROM tipo_unidad WHERE tipo_unidad_id = ?',[DATA[i].control_peso_tipo_unidad_id]);

                    if(idioma === 'es'){
                        DATA[i].control_peso_tipo_unidad_nombre = tipo_unidad_nombre[0].tipo_unidad_nombre;
                    }else if(idioma === 'en'){
                        DATA[i].control_peso_tipo_unidad_nombre = tipo_unidad_nombre[0].tipo_unidad_nombre_en;
                    }


                    if(DATA[i].control_peso_valor === 'null'){
                        DATA[i].control_peso_valor = 0;
                    }

                    peso_total = peso_total + parseFloat(DATA[i].control_peso_valor);
                    numero_pesos = numero_pesos + 1;

                }    
            }
            
            peso_total = peso_total / numero_pesos;
            peso_total = peso_total.toFixed(2);
            DATA.peso_total = peso_total;

            DATA.fotos = await pool.query('SELECT foto_control_peso_id, foto_control_peso_foto_nombre FROM foto_control_peso WHERE foto_control_peso_control_id = ?',[control]);


            let mostrar_fotos = false;
            if(DATA.fotos.length > 0){
                mostrar_fotos = true;
            }

            let mostrar = false;
            if(DATA.length > 0){
                mostrar = true;
            }

            let DATA_RETURN = {pesos: DATA, mostrar, mostrar_fotos};


            return {status: 'ok', content: DATA_RETURN};

        }catch(error){
            return {status: 'error', code: 'Error al generar el control PDF'};
        }

    },



};

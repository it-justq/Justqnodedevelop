const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');


module.exports = {

    async getControlInformacion(control_id, control_hash){

        try{          
            let informacion = await pool.query('SELECT control_estado, control_finalizado, control_plantilla, control_enviado_correo FROM control WHERE control_id = ?', [control_id])
            
            if(informacion[0].control_estado === 1){
                informacion[0].control_estado_nombre = "Visible por el cliente";
                informacion[0].control_estado_nombre_en = "Visible to the client";
            }else if(informacion[0].control_estado === 0){
                informacion[0].control_estado_nombre = "No visible por el cliente";
                informacion[0].control_estado_nombre_en = "Not visible to the client";
            }

            if(informacion[0].control_finalizado === 1){
                informacion[0].control_finalizado_nombre = "Control terminado";
                informacion[0].control_finalizado_nombre_en = "Control finished";
            }else if(informacion[0].control_finalizado === 0){
                informacion[0].control_finalizado_nombre = "Control editable";
                informacion[0].control_finalizado_nombreen = "Editable control";
            }

            informacion[0].plantillas = await pool.query('SELECT plantilla_id_hash, plantilla_nombre FROM plantilla WHERE plantilla_control_id = ? ORDER BY plantilla_fecha_alta', [control_id]);
            if(informacion[0].plantillas.length != 0){
                for(let i = 0; i<informacion[0].plantillas.length; i++){
                    informacion[0].plantillas[i].control_id = control_hash;
                }
            }

            let result = {status: "ok", informacion: informacion[0]};
            return result;

        }catch(error){
            return {status:'error', code: 'Error al obtener los datos'};
        }

    },

    async postControlInformacion(VALUES){

        try{
            
            let control_id = VALUES.control_id;
            let value = VALUES.data.value;
            let type = VALUES.data.type;
            
            switch(type){
                case 'estado':
                    await pool.query('UPDATE control SET control_estado = ? WHERE control_id = ?', [value, control_id]);
                break;
                case 'finalizado':
                    await pool.query('UPDATE control SET control_finalizado = ? WHERE control_id = ?', [value, control_id]);
                break;
            }
          
            return {status: 'ok'}
        
		} catch (error) {
			return {'status':'error', 'code': 'Error al actualizar los datos'};
		}

    },

};
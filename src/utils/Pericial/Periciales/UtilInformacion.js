const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');


module.exports = {

    async getPericialInformacion(informe_id, informe_hash){

        try{          
            let informacion = await pool.query('SELECT informe_estado, informe_enviado_correo FROM informe WHERE informe_id = ?', [informe_id])
            
            if(informacion[0].informe_estado === 1){
                informacion[0].informe_estado_nombre = "Visible por el cliente";
            }else if(informacion[0].informe_estado === 0){
                informacion[0].informe_estado_nombre = "No visible por el cliente";
            }


            let result = {status: "ok", informacion: informacion[0]};
            return result;

        }catch(error){
            return {status:'error', code: 'Error al obtener los datos'};
        }

    },

    async postPericialInformacion(VALUES){

        try{
            
            let informe_id = VALUES.informe_id;
            let value = VALUES.data.value;
            let type = VALUES.data.type;
            
            switch(type){
                case 'estado':
                    await pool.query('UPDATE informe SET informe_estado = ? WHERE informe_id = ?', [value, informe_id]);
                break;
            }
          
            return {status: 'ok'}
        
		} catch (error) {
			return {'status':'error', 'code': 'Error al actualizar los datos'};
		}

    },

};
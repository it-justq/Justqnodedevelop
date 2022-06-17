const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');
const {translateText} = require(appRoot+'/utils/Traductor');
const {escapeDataSlashes} = require(appRoot+'/utils/ParseData');

module.exports = {

    async getPrecargaDatos(control_id, control_hash){

		try{
			let gc_precarga = await pool.query('SELECT control_grupo_control_grupo_control_id, grupo_control_nombre, grupo_control_nombre_en FROM control_grupo_control, grupo_control WHERE grupo_control_id = control_grupo_control_grupo_control_id AND control_grupo_control_tipo_control_id = ? AND control_grupo_control_control_id = ?', [1, control_id]);
			for(i=0; i<gc_precarga.length; i++){
				gc_precarga[i].puntos_control = await pool.query("SELECT punto_control_id_hash as punto_control_id, punto_control_id as pcid, punto_control_nombre, punto_control_nombre_en, punto_control_tipo_dato_id, control_punto_control_id_hash as control_punto_control_id, control_punto_control_control_id, control_punto_control_valor FROM punto_control, control_punto_control WHERE punto_control_id = control_punto_control_punto_control_id AND control_punto_control_control_id = ? AND punto_control_grupo_control_id = ?", [control_id, gc_precarga[i].control_grupo_control_grupo_control_id]); 
			}
			for(i=0; i<gc_precarga.length; i++){
				for(x=0; x<gc_precarga[i].puntos_control.length; x++){

					gc_precarga[i].puntos_control[x].control_punto_control_control_id = control_hash;

					if(gc_precarga[i].puntos_control[x].punto_control_tipo_dato_id === 3){
						gc_precarga[i].puntos_control[x].agrupacion = await pool.query("SELECT punto_control_agrupacion_id_hash as punto_control_agrupacion_id, punto_control_agrupacion_nombre, punto_control_agrupacion_nombre_en, control_punto_control_agrupacion_control_id, control_punto_control_agrupacion_id_hash as control_punto_control_agrupacion_id, control_punto_control_agrupacion_valor FROM punto_control_agrupacion, control_punto_control_agrupacion WHERE punto_control_agrupacion_punto_control_id = ? AND control_punto_control_agrupacion_control_id = ? AND control_punto_control_agrupacion_punto_control_id = punto_control_agrupacion_punto_control_id AND control_punto_control_agrupacion_agrupacion_id = punto_control_agrupacion_id", [gc_precarga[i].puntos_control[x].pcid, control_id]);    
						
						for(let z=0; z<gc_precarga[i].puntos_control[x].agrupacion.length; z++){
							gc_precarga[i].puntos_control[x].agrupacion[z].control_punto_control_agrupacion_control_id = control_hash;
						}
						
					}
				}
			}

			gc_precarga.status = "ok";

			return gc_precarga;
			
		}catch(error){
			return {status:'error', code: 'Error al obtener los datos'};
		}



    },

    async postPrecargaDatos(VALUES){

		try {

			let id = VALUES.id;
			let control_id = VALUES.control_id;
			let value = await escapeDataSlashes(VALUES.data.value);
			let type = await escapeDataSlashes(VALUES.data.type);
	
			let traduccion;

			if(value === 'SI'){
				traduccion = 'YES'
			}else{
				traduccion = await translateText(value,'es','en');
			}
			
			switch(type){
				case '1':
					await pool.query('UPDATE control_punto_control SET control_punto_control_valor = ?, control_punto_control_valor_en = ? WHERE control_punto_control_control_id = ? AND control_punto_control_id_hash = ?', [value, traduccion, control_id, id]);
					return {'status':'ok'};
					break;
				case '2':
					await pool.query('UPDATE control_punto_control SET control_punto_control_valor = ?, control_punto_control_valor_en = ? WHERE control_punto_control_control_id = ? AND control_punto_control_id_hash = ?', [value, traduccion, control_id, id]);
					return {'status':'ok'};
					break;
				case '3':
					await pool.query('UPDATE control_punto_control_agrupacion SET control_punto_control_agrupacion_valor = ?, control_punto_control_agrupacion_valor_en = ? WHERE control_punto_control_agrupacion_control_id = ? AND control_punto_control_agrupacion_id_hash = ?', [value, traduccion, control_id, id]);
					return {'status':'ok'};
					break;
			}

		} catch (error) {
			return {'status':'error', 'code': 'Error al actualizar los datos'};
		}


    },

};




















 
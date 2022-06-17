const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');
const {numControl} = require('./UtilCommon');
const sharp = require('sharp');
const fs = require('fs');
const { Console } = require('console');
const {translateText} = require(appRoot+'/utils/Traductor');
const {escapeData, escapeDataAcciones} = require(appRoot+'/utils/ParseData');
const {genHash} = require(appRoot+'/utils/Crypto'); // let hash = await genHash('control', set[i].control_id);

sharp.cache(false);

module.exports = {

    async getAccionesDatos(control_id, control_hash){

		try{
			
			let acciones = await pool.query('SELECT control_accion_id_hash as control_accion_id, control_accion_control_id, control_accion_orden, control_accion_nombre, control_accion_nombre_en FROM control_accion WHERE control_accion.control_accion_control_id = ?', [control_id]);
			for(i=0; i<acciones.length; i++){
				acciones[i].control_accion_control_id = control_hash;

				if(acciones[i].control_accion_nombre === 'null'){
					acciones[i].control_accion_nombre = '';
				}
				if(acciones[i].control_accion_nombre_en === 'null'){
					acciones[i].control_accion_nombre_en = '';
				}

				acciones[i].imagenes = await pool.query('SELECT foto_control_accion_id_hash as foto_control_accion_id, foto_control_accion_control_id, foto_control_accion_foto, foto_control_accion_ref FROM foto_control_accion WHERE foto_control_accion_control_id = ? AND foto_control_accion_ref = ? AND foto_control_accion_ref != 0', [control_id, parseInt(acciones[i].control_accion_orden, 10)]);
				for(let x=0; x<acciones[i].imagenes.length; x++){
					acciones[i].imagenes[x].foto_control_accion_control_id = control_hash;
				}
			}
	
			acciones.imagenesRef0 = await pool.query('SELECT foto_control_accion_id_hash as foto_control_accion_id, foto_control_accion_control_id, foto_control_accion_foto, foto_control_accion_ref FROM foto_control_accion WHERE foto_control_accion_control_id = ? AND foto_control_accion_ref = ?', [control_id, 0]);
			for(i=0; i<acciones.imagenesRef0.length; i++){
				acciones.imagenesRef0[i].foto_control_accion_control_id = control_hash;
			}
			return {status: 'ok', acciones};

		}catch(error){
            return {status:'error', code: 'Error al obtener las acciones'};
		}


    },

    async modAccionesDatos(VALUES){
		try {
			let id = VALUES.id;
			let control_id = VALUES.control_id;
			
			let value = await escapeDataAcciones(VALUES.data.value);			
			let traduccion = await translateText(value, 'es', 'en');	

			await pool.query('UPDATE control_accion SET control_accion_nombre = ? , control_accion_nombre_en = ? WHERE control_accion_control_id = ? AND control_accion_id_hash = ?', [value, traduccion, control_id, id]);
			return {'status':'ok'};
				
		} catch (error) {
			console.log(error)
			return {'status':'error', 'code': 'Error en la modificacion'};
		}

    },

	async addAccionesDatos(VALUES){
		
        let type = VALUES.type;

		switch(type){
			case 'txt':

				try {
					let control_id = VALUES.control_id;

					let orden = await pool.query('SELECT MAX(control_accion_orden) AS max FROM control_accion WHERE control_accion_control_id = ? AND control_accion_tipo_id = 2', [control_id]);
					let max = orden[0].max;

					if(max === null){
						max = 1;
					}else{
						max = parseInt(orden[0].max) + 1;
					}

					let inserted = await pool.query('INSERT INTO control_accion (control_accion_control_id, control_accion_tipo_id, control_accion_orden) VALUES (?,?,?)', [control_id, 2, max]);
					let hash = await genHash('control_acccion', inserted.insertId);
					await pool.query('UPDATE control_accion SET control_accion_id_hash = ? WHERE control_accion_id = ?',[hash, inserted.insertId]);
					
					return {'status':'ok'};
					
					
				} catch (error) {
					return {'status':'error', 'code': 'Error en la subida de la accion'};
				}
			
				break;
			case 'img':

				try{
					let control_id = VALUES.control_id;
					let control_codigo = await numControl(control_id);
					let FILES = VALUES.files.file;  

					if(!FILES){

						return {'status':'error', 'code': 'Ninguna foto seleccionada'};
				
					}else{

						let contador_num_img = await pool.query('SELECT COUNT(*) AS contador_num_img FROM foto_control_accion WHERE foto_control_accion_control_id = ?', [control_id]);
						contador_num_img = contador_num_img[0].contador_num_img;

						let num_ult_acc = await pool.query('SELECT MAX(control_accion_orden) AS max FROM control_accion WHERE control_accion_control_id = ?', [control_id]);
						num_ult_acc = num_ult_acc[0].max;

						if(num_ult_acc === null){
							num_ult_acc = 0;
						}

						if(contador_num_img === 0){
							contador_num_img = 1;
						}else{
							contador_num_img += 1;
						}

						const nombre_img = control_codigo + "-ACCCION-" + contador_num_img + "_" + num_ult_acc + ".jpeg";
							   
						try{
							await FILES.mv(`E:/fotos_subidas/tmp/${nombre_img}`,async err => {
								try{
									await sharp('E:/fotos_subidas/tmp/'+nombre_img)
									.jpeg({ quality: 50 })
									.toFile('E:/fotos_subidas/'+nombre_img);

									await fs.unlinkSync('E:/fotos_subidas/tmp/'+nombre_img);

									let inserted = await pool.query('INSERT INTO foto_control_accion (foto_control_accion_foto, foto_control_accion_control_id, foto_control_accion_ref) VALUES (?,?,?)', [nombre_img, control_id, num_ult_acc]);

									let hash = await genHash('foto_control_accion', inserted.insertId);
									await pool.query('UPDATE foto_control_accion SET foto_control_accion_id_hash = ? WHERE foto_control_accion_id = ?',[hash, inserted.insertId]);
									
									return {'status':'ok'};

								}catch(error){
									return {'status':'error', 'code': 'Error al subir la imagen'};
								}
							});
						}catch(error){
							return {'status':'error', 'code': 'Error al subir la imagen'};
						}
						
					}

				}catch(error){
					return {'status':'error', 'code': 'Error al subir la imagen'};
				}
				
				break;
		}

			
    },

	async deleteAccionesDatos(VALUES){
		
        let control_id = VALUES.control_id;
        let id = VALUES.id;
        let type = await escapeData(VALUES.data.type);

		switch(type){
			case 'txt':
			
				try {
					let orden = await pool.query("SELECT control_accion_orden FROM control_accion WHERE control_accion_id_hash = ? AND control_accion_control_id = ?", [id, control_id]);
					orden = orden[0].control_accion_orden;

					let orden_nuevo = orden - 1;
					orden_nuevo = orden_nuevo.toString();

					await pool.query("UPDATE foto_control_accion SET foto_control_accion_ref = ? WHERE foto_control_accion_ref = ? AND foto_control_accion_control_id = ?", [orden_nuevo, orden, control_id]);
					
					await pool.query('DELETE FROM control_accion WHERE control_accion_control_id = ? AND control_accion_id_hash = ?', [control_id, id]);

					return {'status':'ok'};
				} catch (error) {
					console.log(error)
					return {'status':'error', 'code': 'Error al eliminar la accion'};
				}
			
				break;
			case 'img':
	
				try{
					const imagen = await pool.query('SELECT foto_control_accion_foto FROM foto_control_accion WHERE foto_control_accion_id_hash = ? AND foto_control_accion_control_id = ?', [id, control_id]);
					if(imagen.length > 0){
						try{
							fs.unlinkSync('E:/fotos_subidas/'+imagen[0].foto_control_accion_foto);
							await pool.query('DELETE FROM foto_control_accion WHERE foto_control_accion_control_id = ? AND foto_control_accion_id_hash = ?', [control_id, id]);
							return {'status':'ok'};
						}catch(error){R
							return {status: 'error', code: "Error al eliminar la imagen"}
						}
					}else{
						return {'status':'error', 'code': 'Error al eliminar la imagen'};
					}
				}catch(error){
					return {status: 'error', code: "Error al eliminar la imagen"}
				}
		
				break;
		}

			
    },

};



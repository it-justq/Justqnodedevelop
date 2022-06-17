const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');
const {numControl} = require('./UtilCommon');
const sharp = require('sharp');
const fs = require('fs');
const {escapeDataSlashes} = require(appRoot+'/utils/ParseData');
const {genHash} = require(appRoot+'/utils/Crypto');

sharp.cache(false);

module.exports = {

    async getPesosDatos(control_id, control_hash){

        try{
            let pesos = await pool.query('SELECT control_peso_id_hash as control_peso_id, control_peso_id as pesoid, control_peso_control_id, control_peso_valor, control_peso_tipo_unidad_id FROM control_peso WHERE control_peso_control_id = ?', [control_id]);
            let tipo_unidad = await pool.query('SELECT tipo_unidad_id, tipo_unidad_nombre, tipo_unidad_nombre_en FROM tipo_unidad');
    
            for(let i = 0; i < pesos.length; i ++){
                pesos[i].control_peso_control_id = control_hash;
                
                let unidad_nombre = await pool.query('SELECT tipo_unidad_nombre, tipo_unidad_nombre_en FROM tipo_unidad WHERE tipo_unidad_id = ?', [pesos[i].control_peso_tipo_unidad_id]);
                pesos[i].control_peso_tipo_unidad_nombre = unidad_nombre[0].tipo_unidad_nombre;
                pesos[i].control_peso_tipo_unidad_nombre_en = unidad_nombre[0].tipo_unidad_nombre_en;
                pesos[i].tipo_unidad = tipo_unidad;

                let total_fotos = await pool.query('SELECT count(*) AS total FROM foto_control_peso WHERE foto_control_peso_control_peso_id = ? AND foto_control_peso_control_id = ?', [pesos[i].pesoid, control_id]);
                total_fotos = total_fotos[0].total;
                pesos[i].total_fotos = total_fotos;
            }

            return {status: 'ok', pesos};
            
        }catch(error){
            return {status:'error', code: 'Error al obtener los datos'};
        }

    },

    async modPesosDatos(VALUES){

        let control_id = VALUES.control_id;
        let id = VALUES.id;
        let value = await escapeDataSlashes(VALUES.data.value);
        let type = await escapeDataSlashes(VALUES.data.type);

        try{

            switch(type){
                case 'valor':
                    await pool.query('UPDATE control_peso SET control_peso_valor = ? WHERE control_peso_control_id = ? AND control_peso_id_hash = ?', [value, control_id, id]);
                    return {'status':'ok'};
                    break;
                case 'unidad':
                    await pool.query('UPDATE control_peso SET control_peso_tipo_unidad_id = ? WHERE control_peso_control_id = ? AND control_peso_id_hash = ?', [value, control_id, id]);
                    return {'status':'ok'};
                    break;
            }
        
		} catch (error) {
			return {'status':'error', 'code': 'Error al actualizar los datos'};
		}

    },

    async addPesosDatos(VALUES){

        try{
            let control_id = VALUES.control_id;
            let value = await escapeDataSlashes(VALUES.data.value);
            value = parseInt(value);

            if(value > 20){
                value = 20;
            }
            
            for(let i=0; i < value; i++){
                let inserted = await pool.query('INSERT INTO control_peso (control_peso_control_id) VALUES (?)', [control_id]);
                let hash = await genHash('control_peso', inserted.insertId);
                await pool.query('UPDATE control_peso SET control_peso_id_hash = ? WHERE control_peso_id = ?',[hash, inserted.insertId]);
            }
            
            
            return {'status':'ok'};
        
		} catch (error) {
			return {'status':'error', 'code': 'Error al añadir el peso'};
		}

    },

    async delPesoDatos(VALUES){

        try{
            let control_id = VALUES.control_id;
            let id = VALUES.id;

            let peso_id = await pool.query('SELECT control_peso_id from control_peso WHERE control_peso_id_hash = ?',[id]);
            peso_id = peso_id[0].control_peso_id;

            let imagenes = await pool.query('SELECT foto_control_peso_id, foto_control_peso_foto_nombre from foto_control_peso WHERE foto_control_peso_control_peso_id = ? AND foto_control_peso_control_id = ?',[peso_id, control_id]);

            for(let i = 0; i < imagenes.length; i++){
                fs.unlinkSync('E:/fotos_subidas/'+imagenes[i].foto_control_peso_foto_nombre); 
                await pool.query('DELETE FROM foto_control_peso WHERE foto_control_peso_control_id = ? AND foto_control_peso_control_peso_id = ? AND foto_control_peso_id = ?', [control_id, peso_id, imagenes[i].foto_control_peso_id]);
            }
                
            await pool.query('DELETE FROM control_peso WHERE control_peso_id_hash = ? AND control_peso_control_id = ?', [id, control_id])
            
            return {'status':'ok'};
        
		} catch (error) {
			return {'status':'error', 'code': 'Error al eliminar el peso'};
		}

    },

    
    //FOTOS

    async getPesoFotosDatos(VALUES){

        try{            
            let peso_id = VALUES.id;
            let control_id = VALUES.control_id;
            let control_hash = VALUES.control_hash;

            let idpeso = await pool.query('SELECT control_peso_id FROM control_peso WHERE control_peso_id_hash = ?',[peso_id]);
            idpeso = idpeso[0].control_peso_id;

            let fotos = await pool.query('SELECT foto_control_peso_foto_nombre AS foto, foto_control_peso_id_hash as foto_control_peso_id FROM foto_control_peso WHERE foto_control_peso_control_peso_id = ? AND foto_control_peso_control_id = ?', [idpeso, control_id]);
            for(let i=0; i<fotos.length; i++){
                fotos[i].foto_control_peso_control_peso_id = peso_id;
                fotos[i].foto_control_peso_control_id = control_hash;
            }

            return {status: 'ok', fotos};
            
        }catch(error){
            return {status:'error', code: 'Error al obtener las fotos'};
        }

    },

    async postDatosPesoFotos(VALUES){
       
        try{
            let control_id = VALUES.control_id;
            let control_codigo = await numControl(control_id);
            let FILES = VALUES.files.file;  
            let peso_id = VALUES.id;   

            if(!FILES){
        
                return {'status':'error', 'code': 'Ninguna foto seleccionada'};

            }else{

                let pesoid = await pool.query('SELECT control_peso_id FROM control_peso WHERE control_peso_id_hash = ?',[peso_id]);
                pesoid = pesoid[0].control_peso_id;

                let imagenes = FILES;

                let contador_num_img = await pool.query('SELECT COUNT(*) AS contador_num_img FROM foto_control_peso WHERE foto_control_peso_control_id = ? AND foto_control_peso_control_peso_id = ?', [control_id, pesoid]);
                contador_num_img = contador_num_img[0].contador_num_img;
        
                if(contador_num_img === null){
                    contador_num_img = 0;
                }

                if(imagenes.length != undefined){
        
                    for (i=0; i<imagenes.length; i++) {
                        const nombre_cont = contador_num_img + i;
                        const nombre_img =  control_codigo + "-PESO-"+ pesoid + "-" + nombre_cont + ".jpeg"; 

                        try{
                            await imagenes[i].mv(`E:/fotos_subidas/tmp/${nombre_img}`,async err => {
                                if(err){
                                    return {status:'error', code: 'Error al añadir la foto'};
                                }else{
                                    try{
                                        let image = await sharp('E:/fotos_subidas/tmp/'+nombre_img).metadata();
                                        let orientation = image.orientation;
                                    
                                        if(orientation == 3 || orientation == 4){
                                            orientation = 180;
                                        }else if (orientation == 5 || orientation == 6){
                                            orientation = 90;
                                        }else if(orientation == 7 || orientation == 8){
                                            orientation = 270;
                                        }else{
                                            orientation = 0;
                                        }
                                        await sharp('E:/fotos_subidas/tmp/'+nombre_img)
                                        .resize(450, 450, {fit: sharp.fit.outside, withoutReduction: true})
                                        .rotate(orientation)
                                        .jpeg({ quality: 50 })
                                        .toFile('E:/fotos_subidas/'+nombre_img)
                                        .then(async function(){
                                            try{
                                                await fs.unlinkSync('E:/fotos_subidas/tmp/'+nombre_img);
    
                                                await pool.query('INSERT INTO foto_control_peso (foto_control_peso_foto_nombre, foto_control_peso_control_id, foto_control_peso_control_peso_id) VALUES (?,?,?)', [nombre_img, control_id, pesoid]).then(async function(row){
                                                    let hash = await genHash('foto_control_peso', row.insertId);
                                                    await pool.query('UPDATE foto_control_peso SET foto_control_peso_id_hash = ? WHERE foto_control_peso_id = ?', [hash, row.insertId]);
                                                }).catch(async function(){
                                                    let fileExistsLocal = await fs.existsSync('E:/fotos_subidas/'+nombre_img);
                                                    if(fileExistsLocal){
                                                        await fs.unlinkSync('E:/fotos_subidas/'+nombre_img);
                                                    }
                                                    return {'status':'error', 'code': 'Error al subir las fotos'};
                                                });
                                            }catch(error){
                                                return {'status':'error', 'code': 'Error al subir las fotos'};
                                            }                                            
                                        }).catch(async function(){
                                            let fileExistsTemp = await fs.existsSync('E:/fotos_subidas/tmp/'+nombre_img);
                                            if(fileExistsTemp){
                                                await fs.unlinkSync('E:/fotos_subidas/tmp/'+nombre_img);
                                            }
                                            let fileExistsLocal = await fs.existsSync('E:/fotos_subidas/'+nombre_img);
                                            if(fileExistsLocal){
                                                await fs.unlinkSync('E:/fotos_subidas/'+nombre_img);
                                            }
                                            return {'status':'error', 'code': 'Error al subir las fotos'};
                                        });
                                    }catch(error){
                                        return {'status':'error', 'code': 'Error al subir las fotos'};
                                    }
                                }
                            });

                        }catch(error){
                            return {'status':'error', 'code': 'Error al subir las fotos'};
                        }
                    }
        
                }else{
        
                    let i;
                      if(contador_num_img === 0){
                        i = 0;
                     }else{
                        i = 1;
                    }
        
                    let nombre_cont = contador_num_img + i;
                    let nombre_img = control_codigo + "-PESO-"+ pesoid + "-" + nombre_cont + ".jpeg"; 
                           
                    try{

                        await imagenes.mv(`E:/fotos_subidas/tmp/${nombre_img}`,async err => {
                            if(err){
                                return {status:'error', code: 'Error al añadir la foto'};
                            }else{
                                try{
                                    let image = await sharp('E:/fotos_subidas/tmp/'+nombre_img).metadata();
                                    let orientation = image.orientation;
                                
                                    if(orientation == 3 || orientation == 4){
                                        orientation = 180;
                                    }else if (orientation == 5 || orientation == 6){
                                        orientation = 90;
                                    }else if(orientation == 7 || orientation == 8){
                                        orientation = 270;
                                    }else{
                                        orientation = 0;
                                    }
                                    await sharp('E:/fotos_subidas/tmp/'+nombre_img)
                                    .resize(450, 450, {fit: sharp.fit.outside, withoutReduction: true})
                                    .rotate(orientation)
                                    .jpeg({ quality: 50 })
                                    .toFile('E:/fotos_subidas/'+nombre_img)
                                    .then(async function(){
                                        try{
                                            await fs.unlinkSync('E:/fotos_subidas/tmp/'+nombre_img);
                                            
                                            await pool.query('INSERT INTO foto_control_peso (foto_control_peso_foto_nombre, foto_control_peso_control_id, foto_control_peso_control_peso_id) VALUES (?,?,?)', [nombre_img, control_id, pesoid]).then(async function(row){
                                                let hash = await genHash('foto_control_peso', row.insertId);
                                                await pool.query('UPDATE foto_control_peso SET foto_control_peso_id_hash = ? WHERE foto_control_peso_id = ?', [hash, row.insertId]);
                                            }).catch(async function(){
                                                let fileExistsLocal = await fs.existsSync('E:/fotos_subidas/'+nombre_img);
                                                if(fileExistsLocal){
                                                    await fs.unlinkSync('E:/fotos_subidas/'+nombre_img);
                                                }
                                                return {'status':'error', 'code': 'Error al subir las fotos'};
                                            });

                                        }catch(error){
                                            return {'status':'error', 'code': 'Error al subir las fotos'};
                                        }
                                        
                                    }).catch(async function(){
                                        let fileExistsTemp = await fs.existsSync('E:/fotos_subidas/tmp/'+nombre_img);
                                        if(fileExistsTemp){
                                            await fs.unlinkSync('E:/fotos_subidas/tmp/'+nombre_img);
                                        }
                                        let fileExistsLocal = await fs.existsSync('E:/fotos_subidas/'+nombre_img);
                                        if(fileExistsLocal){
                                            await fs.unlinkSync('E:/fotos_subidas/'+nombre_img);
                                        }
                                        return {'status':'error', 'code': 'Error al subir las fotos'};
                                    });
        
                                }catch(error){
                                    return {'status':'error', 'code': 'Error al subir las fotos'};
                                }
                            }
                        });

                    }catch(error){
                        return {'status':'error', 'code': 'Error al subir las fotos'};
                    }
                }
                        
                return {'status': 'ok'};
            }

        }catch(error){
            return {'status':'error', 'code': 'Error al subir las fotos'};
        }

    },

    async deleteDatosPesoFotos(VALUES){
        try{
            let control_id = VALUES.control_id;
            let peso_id = VALUES.id;

            let idpeso = await pool.query('SELECT control_peso_id FROM control_peso WHERE control_peso_id_hash = ?',[peso_id]);
            idpeso = idpeso[0].control_peso_id;

            return await pool.query('SELECT foto_control_peso_foto_nombre as foto, foto_control_peso_id FROM foto_control_peso WHERE foto_control_peso_control_id = ? AND foto_control_peso_control_peso_id = ?', [control_id, idpeso]).then(async function(rows){
                if(rows.length != 0){
                    for(let i = 0; i < rows.length; i++){
                        let fileExists = await fs.existsSync('E:/fotos_subidas/'+rows[i].foto);
                        await pool.query('DELETE FROM foto_control_peso WHERE foto_control_peso_control_id = ? AND foto_control_peso_control_peso_id = ? AND foto_control_peso_id = ?', [control_id, idpeso, rows[i].foto_control_peso_id]).then(async function(){
                            if(fileExists){
                                try{
                                    await fs.unlinkSync('E:/fotos_subidas/'+rows[i].foto);
                                }catch(error){
                                    return {status:'error', code: 'Error al eliminar la foto del almacenamiento local'};
                                }
                            }else{
                                return {'status': 'ok'}; 
                            }
                        }).catch(async function(error){
                            return {status:'error', code: 'Error al eliminar la foto de la base de datos'};
                        })
                    }
                    return {'status': 'ok'}; 
                }else{
                    return {status:'error', code: 'No existen fotos'};
                }
            }).catch(async function(error){
                return {status:'error', code: 'Error al obtener las foto de la base de datos'};
            });


        }catch(error){
            return {status:'error', code: "Error al eliminar las fotos"};
        }
    },

    async deleteDatosPesoFoto(VALUES){
        try{
            let control_id = VALUES.control_id;
            let peso_id = VALUES.id;
            let foto_id = VALUES.subId;

            let idpeso = await pool.query('SELECT control_peso_id FROM control_peso WHERE control_peso_id_hash = ?',[peso_id]);
            idpeso = idpeso[0].control_peso_id;

            return await pool.query('SELECT foto_control_peso_foto_nombre as foto FROM foto_control_peso WHERE foto_control_peso_control_id = ? AND foto_control_peso_control_peso_id = ? AND foto_control_peso_id_hash = ?', [control_id, idpeso, foto_id]).then(async function (row){
                
                if(row.length != 0){
                    let imagen = row[0].foto;
                    let fileExists = await fs.existsSync('E:/fotos_subidas/'+imagen);

                    return await pool.query('DELETE FROM foto_control_peso WHERE foto_control_peso_control_id = ? AND foto_control_peso_control_peso_id = ? AND foto_control_peso_id_hash = ?', [control_id, idpeso, foto_id]).then(async function(row) {
                        if(fileExists){
                            try{
                                await fs.unlinkSync('E:/fotos_subidas/'+imagen);
                                return {'status': 'ok'}; 
                            }catch(error){
                                return {status:'error', code: 'Error al eliminar la foto del almacenamiento local'};
                            }
                        }else{
                            return {'status': 'ok'}; 
                        }
                    }).catch(function(error){
                        return {status:'error', code: 'Error al eliminar la foto de la base de datos'};
                    });

                }else{
                    return {status:'error', code: 'La foto no existe'};
                }
            }).catch(function (error){
                return {status:'error', code: 'Error al obtener la foto de la base de datos'};
            })  

        }catch(error){
            return {status:'error', code: 'Error al obtener la foto'};
        }
    },

};
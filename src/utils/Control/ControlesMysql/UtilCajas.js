const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');
const {translateText} = require(appRoot+'/utils/Traductor');
const {numControl} = require('./UtilCommon');
const sharp = require('sharp');
const fs = require('fs');
const {escapeDataSlashes} = require(appRoot+'/utils/ParseData');
const {genHash} = require(appRoot+'/utils/Crypto');

sharp.cache(false);

module.exports = {

    async getCajasDatos(control_id, control_hash){

        try{
            let cajas = await pool.query('SELECT control_caja_id_hash as control_caja_id, control_caja_id as cajaid, control_caja_control_id, control_caja_orden, control_caja_valoracion_id, control_caja_unidades, control_caja_peso, control_caja_notas FROM control_caja WHERE control_caja_control_id = ? ORDER BY control_caja_orden', [control_id])
            let valoraciones = await pool.query('SELECT valoracion_id, valoracion_nombre, valoracion_nombre_en FROM valoracion');
    
            for(let i = 0; i < cajas.length; i ++){
                cajas[i].control_caja_control_id = control_hash;

                let valoracion = await pool.query('SELECT valoracion_nombre, valoracion_nombre_en FROM valoracion WHERE valoracion_id = ?', [cajas[i].control_caja_valoracion_id]);
                cajas[i].control_caja_valoracion_nombre = valoracion[0].valoracion_nombre;
                cajas[i].control_caja_valoracion_nombre_en = valoracion[0].valoracion_nombre_en;
                cajas[i].valoraciones = valoraciones;

                let total_fotos = await pool.query('SELECT count(*) AS total FROM foto_control_caja WHERE foto_control_caja_control_caja_id = ? AND foto_control_caja_control_id = ?', [cajas[i].cajaid, control_id]);
                total_fotos = total_fotos[0].total;
                cajas[i].total_fotos = total_fotos;
            }

            return {status: 'ok', cajas};

        }catch(error){
            return {status:'error', code: 'Error al obtener los datos'};
        }

    },

    async postCajasDatos(VALUES){

        try{
            let control_id = VALUES.control_id;
            let id = VALUES.data.id;
            let value = await escapeDataSlashes(VALUES.data.value);
            let name = await escapeDataSlashes(VALUES.data.name);

            if(name === 'control_caja_notas'){
                let traduccion = await translateText(value,'es','en')

                await pool.query('UPDATE control_caja SET control_caja_notas = ?, control_caja_notas_en = ? WHERE control_caja_control_id = ? AND control_caja_id_hash = ?', [value, traduccion, control_id, id]);
            }else{
                await pool.query('UPDATE control_caja SET '+name+' = ? WHERE control_caja_control_id = ? AND control_caja_id_hash = ?', [value, control_id, id]);

            }

            return {'status':'ok'};
        
		} catch (error) {
			return {'status':'error', 'code': 'Error al modificar los datos'};
		}
    },

    async addCajasDatos(VALUES){

        try{
            let control_id = VALUES.control_id;
            let value = await escapeDataSlashes(VALUES.data.value);
            value = parseInt(value);

            if(value > 20){
                value = 20;
            }

            let orden = await pool.query('SELECT COUNT(*) as total FROM control_caja WHERE control_caja_control_id = ?',[control_id]);
            orden = parseInt(orden[0].total);
            if(orden === 0){
                orden = 1;
            }

            
            for(let i=0; i < value; i++){
                let inserted = await pool.query('INSERT INTO control_caja (control_caja_control_id, control_caja_orden) VALUES (?,?)', [control_id, orden]);
                let hash = await genHash('control_caja', inserted.insertId);
                await pool.query('UPDATE control_caja SET control_caja_id_hash = ? WHERE control_caja_id = ?',[hash, inserted.insertId]);

                orden ++;
            }
            
            return {'status':'ok'};
        
		} catch (error) {
			return {'status':'error', 'code': 'Error al añadir los datos'};
		}

    },

    async delCajasDatos(VALUES){

        try{
            
            let control_id = VALUES.control_id;
            let id = VALUES.id;

            let caja_id = await pool.query('SELECT control_caja_id from control_caja WHERE control_caja_id_hash = ?',[id]);
            caja_id = caja_id[0].control_caja_id;

            let imagenes = await pool.query('SELECT foto_control_caja_id, foto_control_caja_foto_nombre from foto_control_caja WHERE foto_control_caja_control_caja_id = ? AND foto_control_caja_control_id = ?',[caja_id, control_id]);

            for(let i = 0; i < imagenes.length; i++){
                await fs.unlinkSync('E:/fotos_subidas/'+imagenes[i].foto_control_caja_foto_nombre);
                await pool.query('DELETE FROM foto_control_caja WHERE foto_control_caja_control_id = ? AND foto_control_caja_control_caja_id = ? AND foto_control_caja_id = ?', [control_id, caja_id, imagenes[i].foto_control_caja_id]);
            }
            
            await pool.query('DELETE FROM control_caja WHERE control_caja_id_hash = ? AND control_caja_control_id = ?', [id, control_id])

            return {'status':'ok'};
            
        }catch(error){
            return {status:'error', code: 'Error al eliminar los datos'};
        }

    },



    //FOTOS

    async getCajaFotosDatos(VALUES){

        try{
            let caja_id = VALUES.id;
            let control_id = VALUES.control_id;
            let control_hash = VALUES.control_hash;

            let idcaja = await pool.query('SELECT control_caja_id FROM control_caja WHERE control_caja_id_hash = ?',[caja_id]);
            idcaja = idcaja[0].control_caja_id;

            let fotos = await pool.query('SELECT foto_control_caja_foto_nombre AS foto, foto_control_caja_id_hash as foto_control_caja_id FROM foto_control_caja WHERE foto_control_caja_control_caja_id = ? AND foto_control_caja_control_id = ?', [idcaja, control_id]);
            for(let i=0; i<fotos.length; i++){
                fotos[i].foto_control_caja_control_caja_id = caja_id;
                fotos[i].foto_control_caja_control_id = control_hash;
            }
    
            return {status: 'ok', fotos};
            
        }catch(error){
            return {status:'error', code: 'Error al obtener los datos'};
        }

    },

    async postDatosCajaFotos(VALUES){
       
        try{
            let control_id = VALUES.control_id;
            let control_codigo = await numControl(control_id);
            let FILES = VALUES.files.file;  
            let caja_id = VALUES.id;   
            if(!FILES){
        
                return {'status':'error', 'code': 'Ninguna foto seleccionada'};

            }else{

                let cajaid = await pool.query('SELECT control_caja_id FROM control_caja WHERE control_caja_id_hash = ?',[caja_id]);
                cajaid = parseInt(cajaid[0].control_caja_id);


                let imagenes = FILES;

                let contador_num_img = await pool.query('SELECT COUNT(*) AS contador_num_img FROM foto_control_caja WHERE foto_control_caja_control_id = ? AND foto_control_caja_control_caja_id = ?', [control_id, cajaid]);
                contador_num_img = contador_num_img[0].contador_num_img;
        
                if(contador_num_img === null){
                    contador_num_img = 0;
                }

                if(imagenes.length != undefined){
        
                    for (i=0; i<imagenes.length; i++) {
                        const nombre_cont = contador_num_img + i;
                        const nombre_img =  control_codigo + "-CAJA-"+ cajaid + "-" + nombre_cont + ".jpeg"; 

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
    
                                                await pool.query('INSERT INTO foto_control_caja (foto_control_caja_foto_nombre, foto_control_caja_control_id, foto_control_caja_control_caja_id) VALUES (?,?,?)', [nombre_img, control_id, cajaid]).then(async function(row){
                                                    let hash = await genHash('foto_control_caja', row.insertId);
                                                    await pool.query('UPDATE foto_control_caja SET foto_control_caja_id_hash = ? WHERE foto_control_caja_id = ?', [hash, row.insertId]);
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
                    let nombre_img = control_codigo + "-CAJA-"+ cajaid + "-" + nombre_cont + ".jpeg"; 
                           

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
                                            
                                            await pool.query('INSERT INTO foto_control_caja (foto_control_caja_foto_nombre, foto_control_caja_control_id, foto_control_caja_control_caja_id) VALUES (?,?,?)', [nombre_img, control_id, cajaid]).then(async function(row){
                                                let hash = await genHash('foto_control_caja', row.insertId);
                                                await pool.query('UPDATE foto_control_caja SET foto_control_caja_id_hash = ? WHERE foto_control_caja_id = ?', [hash, row.insertId]);
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

            }
            return {'status': 'ok'};

        }catch(error){
            return {'status':'error', 'code': 'Error al subir las fotos'};
        }

    },

    async deleteDatosCajaFotos(VALUES){
        try{
            let control_id = VALUES.control_id;
            let caja_id = VALUES.id;

            let idcaja = await pool.query('SELECT control_caja_id FROM control_caja WHERE control_caja_id_hash = ?',[caja_id]);
            idcaja = idcaja[0].control_caja_id;


            return await pool.query('SELECT foto_control_caja_foto_nombre as foto, foto_control_caja_id FROM foto_control_caja WHERE foto_control_caja_control_id = ? AND foto_control_caja_control_caja_id = ?', [control_id, idcaja]).then(async function(rows){
                if(rows.length != 0){
                    for(let i = 0; i < rows.length; i++){
                        let fileExists = await fs.existsSync('E:/fotos_subidas/'+rows[i].foto);
                        await pool.query('DELETE FROM foto_control_caja WHERE foto_control_caja_control_id = ? AND foto_control_caja_control_caja_id = ? AND foto_control_caja_id = ?', [control_id, idcaja, rows[i].foto_control_caja_id]).then(async function(){
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

    async deleteDatosCajaFoto(VALUES){
        try{
            let control_id = VALUES.control_id;
            let caja_id = VALUES.id;
            let foto_id = VALUES.subId;

            let idcaja = await pool.query('SELECT control_caja_id FROM control_caja WHERE control_caja_id_hash = ?',[caja_id]);
            idcaja = idcaja[0].control_caja_id;

            return await pool.query('SELECT foto_control_caja_foto_nombre as foto FROM foto_control_caja WHERE foto_control_caja_control_id = ? AND foto_control_caja_control_caja_id = ? AND foto_control_caja_id_hash = ?', [control_id, idcaja, foto_id]).then(async function (row){
                
                if(row.length != 0){
                    let imagen = row[0].foto;
                    let fileExists = await fs.existsSync('E:/fotos_subidas/'+imagen);

                    return await pool.query('DELETE FROM foto_control_caja WHERE foto_control_caja_control_id = ? AND foto_control_caja_control_caja_id = ? AND foto_control_caja_id_hash = ?', [control_id, idcaja, foto_id]).then(async function(row) {
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
            return {status:'error', code: 'Error al eliminar la foto'};
        }
    },

};
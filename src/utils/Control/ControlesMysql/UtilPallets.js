const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');
const {numControl} = require('./UtilCommon');
const sharp = require('sharp');
const fs = require('fs');
const {escapeDataSlashesDot, escapeDataSlashes, escapeData} = require(appRoot+'/utils/ParseData');
const {genHash} = require(appRoot+'/utils/Crypto');

sharp.cache(false);

module.exports = {

    async getPalletsDatos(control_id, control_hash){

        try{
            let pallets = await pool.query('SELECT control_pallet_id_hash as control_pallet_id, control_pallet_id as palletid, control_pallet_control_id, control_pallet_sscc_proveedor, control_pallet_sscc_plataforma, control_pallet_fecha, control_pallet_lote, control_pallet_confeccion, control_pallet_marca from control_pallet WHERE control_pallet_control_id = ?', [control_id]);

            for(let i = 0; i < pallets.length; i ++){
                pallets[i].control_pallet_control_id = control_hash;

                let total_fotos = await pool.query('SELECT count(*) AS total FROM foto_control_pallet WHERE foto_control_pallet_control_pallet_id = ? AND foto_control_pallet_control_id = ?', [pallets[i].palletid, control_id]);
                total_fotos = total_fotos[0].total;
                pallets[i].total_fotos = total_fotos;
            }

            return {status: 'ok', pallets};
            
        }catch(error){
            return {status:'error', code: 'Error al obtener los datos'};
        }

    },

    async postPalletsDatos(VALUES){
        
        let control_id = VALUES.control_id;
        let id = VALUES.id;
        let value = await escapeDataSlashesDot(VALUES.data.value);
        let name = await escapeDataSlashes(VALUES.data.name);
        
        try{
            await pool.query('UPDATE control_pallet SET '+name+' = ? WHERE control_pallet_control_id = ? AND control_pallet_id_hash = ?', [value, control_id, id]);
            return {'status':'ok'};
        
		} catch (error) {
			return {'status':'error', 'code': 'Error al actualizar los datos'};
		}
    },

    async addPalletsDatos(VALUES){

        try{
            let control_id = VALUES.control_id;
            let value = await escapeData(VALUES.data.value);
            value = parseInt(value);

            if(value > 20){
                value = 20;
            }

            for(let i=0; i < value; i++){
                let inserted = await pool.query('INSERT INTO control_pallet (control_pallet_control_id) VALUES (?)', [control_id]);
                let hash = await genHash('control_pallet', inserted.insertId);
                await pool.query('UPDATE control_pallet SET control_pallet_id_hash = ? WHERE control_pallet_id = ?',[hash, inserted.insertId]);
            }
            
            return {'status':'ok'};
        
		} catch (error) {
			return {'status':'error', 'code': 'Error al anadir el pallet'};
		}

    },

    async delPalletsDatos(VALUES){

        try{
            let control_id = VALUES.control_id;
            let id = VALUES.id;

            let pallet_id = await pool.query('SELECT control_pallet_id from control_pallet WHERE control_pallet_id_hash = ?',[id]);
            pallet_id = pallet_id[0].control_pallet_id;

            let imagenes = await pool.query('SELECT foto_control_pallet_id, foto_control_pallet_foto_nombre from foto_control_pallet WHERE foto_control_pallet_control_pallet_id = ? AND foto_control_pallet_control_id = ?',[pallet_id, control_id]);

            for(let i = 0; i < imagenes.length; i++){
                await fs.unlinkSync('E:/fotos_subidas/'+imagenes[i].foto_control_pallet_foto_nombre);
                await pool.query('DELETE FROM foto_control_pallet WHERE foto_control_pallet_control_id = ? AND foto_control_pallet_control_pallet_id = ? AND foto_control_pallet_id = ?', [control_id, pallet_id, imagenes[i].foto_control_pallet_id]);
            }
                
            await pool.query('DELETE FROM control_pallet WHERE control_pallet_id_hash = ? AND control_pallet_control_id = ?', [id, control_id])
                        
            return {'status':'ok'};
        
		} catch (error) {
			return {'status':'error', 'code': 'Error al eliminar el pallet'};
		}

    },
    


    
    //FOTOS

    async getPalletFotosDatos(VALUES){

        try{
            let pallet_id = VALUES.id;
            let control_id = VALUES.control_id;
            let control_hash = VALUES.control_hash;

            let idpallet = await pool.query('SELECT control_pallet_id FROM control_pallet WHERE control_pallet_id_hash = ?',[pallet_id]);
            idpallet = idpallet[0].control_pallet_id;

            let fotos = await pool.query('SELECT foto_control_pallet_foto_nombre AS foto, foto_control_pallet_id_hash as foto_control_pallet_id FROM foto_control_pallet WHERE foto_control_pallet_control_pallet_id = ? AND foto_control_pallet_control_id = ?', [idpallet, control_id]);
            for(let i=0; i<fotos.length; i++){
                fotos[i].foto_control_pallet_control_pallet_id = pallet_id;
                fotos[i].foto_control_pallet_control_id = control_hash;
            }
    
            return {status: 'ok', fotos};
            
        }catch(error){
            return {status:'error', code: 'Error al obtener las fotos'};
        }

    },

    async postDatosPalletFotos(VALUES){
       
        try{
            let control_id = VALUES.control_id;
            let control_codigo = await numControl(control_id);
            let FILES = VALUES.files.file;  
            let pallet_id = VALUES.id;   

            if(!FILES){
        
                return {'status':'error', 'code': 'Ninguna foto seleccionada'};

            }else{

                let palletid = await pool.query('SELECT control_pallet_id FROM control_pallet WHERE control_pallet_id_hash = ?',[pallet_id]);
                palletid = palletid[0].control_pallet_id;

                let imagenes = FILES;

                let contador_num_img = await pool.query('SELECT COUNT(*) AS contador_num_img FROM foto_control_pallet WHERE foto_control_pallet_control_id = ? AND foto_control_pallet_control_pallet_id = ?', [control_id, palletid]);
                contador_num_img = contador_num_img[0].contador_num_img;
        
                if(contador_num_img === null){
                    contador_num_img = 0;
                }

                if(imagenes.length != undefined){
        
                    for (i=0; i<imagenes.length; i++) {
                        const nombre_cont = contador_num_img + i;
                        const nombre_img =  control_codigo + "-PALLET-"+ palletid + "-" + nombre_cont + ".jpeg"; 

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
    
                                                await pool.query('INSERT INTO foto_control_pallet (foto_control_pallet_foto_nombre, foto_control_pallet_control_id, foto_control_pallet_control_pallet_id) VALUES (?,?,?)', [nombre_img, control_id, palletid]).then(async function(row){
                                                    let hash = await genHash('foto_control_pallet', row.insertId);
                                                    await pool.query('UPDATE foto_control_pallet SET foto_control_pallet_id_hash = ? WHERE foto_control_pallet_id = ?', [hash, row.insertId]);
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
                    let nombre_img = control_codigo + "-PALLET-"+ palletid + "-" + nombre_cont + ".jpeg"; 
                           
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
                                            
                                            await pool.query('INSERT INTO foto_control_pallet (foto_control_pallet_foto_nombre, foto_control_pallet_control_id, foto_control_pallet_control_pallet_id) VALUES (?,?,?)', [nombre_img, control_id, palletid]).then(async function(row){
                                                let hash = await genHash('foto_control_pallet', row.insertId);
                                                await pool.query('UPDATE foto_control_pallet SET foto_control_pallet_id_hash = ? WHERE foto_control_pallet_id = ?', [hash, row.insertId]);
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

    async deleteDatosPalletFotos(VALUES){
        try{
            let control_id = VALUES.control_id;
            let pallet_id = VALUES.id;

            let idpallet = await pool.query('SELECT control_pallet_id FROM control_pallet WHERE control_pallet_id_hash = ?',[pallet_id]);
            idpallet = idpallet[0].control_pallet_id;

            return await pool.query('SELECT foto_control_pallet_foto_nombre as foto, foto_control_pallet_id FROM foto_control_pallet WHERE foto_control_pallet_control_id = ? AND foto_control_pallet_control_pallet_id = ?', [control_id, idpallet]).then(async function(rows){
                if(rows.length != 0){
                    for(let i = 0; i < rows.length; i++){
                        let fileExists = await fs.existsSync('E:/fotos_subidas/'+rows[i].foto);
                        await pool.query('DELETE FROM foto_control_pallet WHERE foto_control_pallet_control_id = ? AND foto_control_pallet_control_pallet_id = ? AND foto_control_pallet_id = ?', [control_id, idpallet, rows[i].foto_control_pallet_id]).then(async function(){
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

    async deleteDatosPalletFoto(VALUES){
        try{
            let control_id = VALUES.control_id;
            let pallet_id = VALUES.id;
            let foto_id = VALUES.subId;

            let idpallet = await pool.query('SELECT control_pallet_id FROM control_pallet WHERE control_pallet_id_hash = ?',[pallet_id]);
            idpallet = idpallet[0].control_pallet_id;

            return await pool.query('SELECT foto_control_pallet_foto_nombre as foto FROM foto_control_pallet WHERE foto_control_pallet_control_id = ? AND foto_control_pallet_control_pallet_id = ? AND foto_control_pallet_id_hash = ?', [control_id, idpallet, foto_id]).then(async function (row){
                
                if(row.length != 0){
                    let imagen = row[0].foto;
                    let fileExists = await fs.existsSync('E:/fotos_subidas/'+imagen);

                    return await pool.query('DELETE FROM foto_control_pallet WHERE foto_control_pallet_control_id = ? AND foto_control_pallet_control_pallet_id = ? AND foto_control_pallet_id_hash = ?', [control_id, idpallet, foto_id]).then(async function(row) {
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
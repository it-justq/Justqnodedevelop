const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');
const {numControl} = require('./UtilCommon');
const sharp = require('sharp');
const fs = require('fs');
const {genHash} = require(appRoot+'/utils/Crypto');

sharp.cache(false);

module.exports = {

    async getDocumentacionDatos(control_id, control_hash){

        try{

            let documentacion = await pool.query('SELECT foto_control_documentacion_id_hash as foto_control_documentacion_id, foto_control_documentacion_foto, foto_control_documentacion_control_id FROM foto_control_documentacion WHERE foto_control_documentacion_control_id = ?', [control_id]);
            for(let i=0; i<documentacion.length; i++){
                documentacion[i].foto_control_documentacion_control_id = control_hash;
            }
            return {status: 'ok', documentacion};

        }catch(error){
            return {status:'error', code: 'Error al obtener las fotos'};
        }

    },

    async postDocumentacionDatos(VALUES){

        try{
            let control_id = VALUES.control_id;
            let control_codigo = await numControl(control_id);
            let FILES = VALUES.files.file;     

            if(!FILES){
        
                return {'status':'error', 'code': 'Ninguna foto seleccionada'};

            }else{

                let imagenes = FILES;

                let contador_num_img = await pool.query('SELECT COUNT(*) AS contador_num_img FROM foto_control_documentacion WHERE foto_control_documentacion_control_id = ?', [control_id]);
                contador_num_img = contador_num_img[0].contador_num_img;
        
                if(contador_num_img === null){
                    contador_num_img = 0;
                }
        
                if(imagenes.length != undefined){
        
                    for (i=0; i<imagenes.length; i++) {
                        const nombre_cont = contador_num_img + i;
                        const nombre_img = control_codigo + "-DOC-" + nombre_cont + ".jpeg"; 

                        try{
                            await imagenes[i].mv(`E:/fotos_subidas/tmp/${nombre_img}`,async err => {
                                if(err){
                                    return {status:'error', code: 'Error al añadir la foto'};
                                }else{
                                    try{
                                        await sharp('E:/fotos_subidas/tmp/'+nombre_img)
                                        .jpeg({ quality: 100 })
                                        .toFile('E:/fotos_subidas/'+nombre_img)
                                        .then(async function(){
                                            try{
                                                await fs.unlinkSync('E:/fotos_subidas/tmp/'+nombre_img);
    
                                                await pool.query('INSERT INTO foto_control_documentacion (foto_control_documentacion_foto, foto_control_documentacion_control_id) VALUES (?,?)', [nombre_img, control_id]).then(async function(row){
                                                    let hash = await genHash('foto_control_documentacion', row.insertId);
                                                    await pool.query('UPDATE foto_control_documentacion SET foto_control_documentacion_id_hash = ? WHERE foto_control_documentacion_id = ?', [hash, row.insertId]);
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
                    let nombre_img = control_codigo + "-DOC-" + nombre_cont + ".jpeg"; 

                    try{

                        await imagenes.mv(`E:/fotos_subidas/tmp/${nombre_img}`,async err => {
                            if(err){
                                return {status:'error', code: 'Error al añadir la foto'};
                            }else{
                                try{
                                    await sharp('E:/fotos_subidas/tmp/'+nombre_img)
                                    .jpeg({ quality: 100 })
                                    .toFile('E:/fotos_subidas/'+nombre_img)
                                    .then(async function(){
                                        try{
                                            await fs.unlinkSync('E:/fotos_subidas/tmp/'+nombre_img);
                                            
                                            await pool.query('INSERT INTO foto_control_documentacion (foto_control_documentacion_foto, foto_control_documentacion_control_id) VALUES (?,?)', [nombre_img, control_id]).then(async function(row){
                                                let hash = await genHash('foto_control_documentacion', row.insertId);
                                                await pool.query('UPDATE foto_control_documentacion SET foto_control_documentacion_id_hash = ? WHERE foto_control_documentacion_id = ?', [hash, row.insertId]);
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

    async deleteDocumentacionAllDatos(VALUES){
        try{
            let control_id = VALUES.control_id;

            return await pool.query('SELECT foto_control_documentacion_foto as foto, foto_control_documentacion_id FROM foto_control_documentacion WHERE foto_control_documentacion_control_id = ?', [control_id]).then(async function(rows){
                if(rows.length != 0){
                    for(let i = 0; i < rows.length; i++){
                        let fileExists = await fs.existsSync('E:/fotos_subidas/'+rows[i].foto);
                        await pool.query('DELETE FROM foto_control_documentacion WHERE foto_control_documentacion_control_id = ? AND foto_control_documentacion_id = ?', [control_id, rows[i].foto_control_documentacion_id]).then(async function(){
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

    async deleteDocumentacionDatos(VALUES){
        try{
            let control_id = VALUES.control_id;
            let id = VALUES.id;

            return await pool.query('SELECT foto_control_documentacion_foto as foto FROM foto_control_documentacion WHERE foto_control_documentacion_control_id = ? AND foto_control_documentacion_id_hash = ?', [control_id, id]).then(async function (row){
                
                if(row.length != 0){
                    let imagen = row[0].foto;
                    let fileExists = await fs.existsSync('E:/fotos_subidas/'+imagen);

                    return await pool.query('DELETE FROM foto_control_documentacion WHERE foto_control_documentacion_control_id = ? AND foto_control_documentacion_id_hash = ?', [control_id, id]).then(async function(row) {
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
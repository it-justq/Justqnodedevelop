const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');
const {numControl} = require('./UtilCommon');
const sharp = require('sharp');
const fs = require('fs');
const {genHash} = require(appRoot+'/utils/Crypto');

sharp.cache(false);

module.exports = {

    async getDatosPuntoControlFotos(VALUES){
        try{            
            let pc_id = VALUES.id;
            let control_id = VALUES.control_id;
            let control_hash = VALUES.control_hash;

            let pcaddid = await pool.query('SELECT control_punto_control_añadidos_id FROM control_punto_control_añadidos WHERE control_punto_control_añadidos_id_hash = ? AND control_punto_control_añadidos_control_id = ?', [pc_id, control_id]);
            pcaddid = pcaddid[0].control_punto_control_añadidos_id;

            let fotos = await pool.query('SELECT foto_punto_control_añadido_foto AS foto, foto_punto_control_añadido_id_hash as foto_punto_control_id FROM foto_punto_control_añadido WHERE foto_punto_control_añadido_punto_control_id = ? AND foto_punto_control_añadido_control_id = ?', [pcaddid, control_id]);

            for(let i=0; i<fotos.length; i++){
                fotos[i].foto_punto_control_control_id = control_hash;
                fotos[i].control_punto_control_id = pc_id;
            }

            let pc_nombre = await pool.query('SELECT control_punto_control_añadidos_nombre, control_punto_control_añadidos_nombre_en FROM control_punto_control_añadidos WHERE control_punto_control_añadidos_id = ?', [pcaddid]);
            let pc_nombre_en = ''
            if(pc_nombre.length != 0){
                pc_nombre_en = pc_nombre[0].control_punto_control_añadidos_nombre_en;
                pc_nombre = pc_nombre[0].control_punto_control_añadidos_nombre;
            }else{
                pc_nombre = '';
            }

            return {status: 'ok', fotos, pc_nombre, pc_nombre_en};
        }catch(error){
            return {status:'error', code: 'Error al obtener las fotos'};
        }
    },

    async postDatosPuntoControlFotos(VALUES){
       
        try{
            let control_id = VALUES.control_id;
            let control_codigo = await numControl(control_id);
            let FILES = VALUES.files.file;
            let pc_id = VALUES.id;   

            if(!FILES){
        
                return {'status':'error', 'code': 'Ninguna foto seleccionada'};

            }else{

                let imagenes = FILES;

                let pcaddid = await pool.query('SELECT control_punto_control_añadidos_id FROM control_punto_control_añadidos WHERE control_punto_control_añadidos_id_hash = ? AND control_punto_control_añadidos_control_id = ?', [pc_id, control_id]);
                pcaddid = pcaddid[0].control_punto_control_añadidos_id;

                let contador_num_img = await pool.query('SELECT COUNT(*) AS contador_num_img FROM foto_punto_control_añadido WHERE foto_punto_control_añadido_control_id = ? AND foto_punto_control_añadido_punto_control_id = ?', [control_id, pcaddid]);
                contador_num_img = contador_num_img[0].contador_num_img;
        
                if(contador_num_img === null){
                    contador_num_img = 0;
                }


                if(imagenes.length != undefined){
        
                    for (i=0; i<imagenes.length; i++) {
                        const nombre_cont = contador_num_img + i;
                        const nombre_img =  control_codigo + "-PC-ADD-"+ pcaddid + "-" + nombre_cont + ".jpeg"; 

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
    
                                                await pool.query('INSERT INTO foto_punto_control_añadido (foto_punto_control_añadido_foto, foto_punto_control_añadido_control_id, foto_punto_control_añadido_punto_control_id) VALUES (?,?,?)', [nombre_img, control_id, pcaddid]).then(async function(row){
                                                    let hash = await genHash('foto_punto_control_añadido', row.insertId);
                                                    await pool.query('UPDATE foto_punto_control_añadido SET foto_punto_control_añadido_id_hash = ? WHERE foto_punto_control_añadido_id = ?', [hash, row.insertId]);
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
                    let nombre_img = control_codigo + "-PC-ADD-"+ pcaddid + "-" + nombre_cont + ".jpeg"; 
                           
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
                                            
                                            await pool.query('INSERT INTO foto_punto_control_añadido (foto_punto_control_añadido_foto, foto_punto_control_añadido_control_id, foto_punto_control_añadido_punto_control_id) VALUES (?,?,?)', [nombre_img, control_id, pcaddid]).then(async function(row){
                                                let hash = await genHash('foto_punto_control_añadido', row.insertId);
                                                await pool.query('UPDATE foto_punto_control_añadido SET foto_punto_control_añadido_id_hash = ? WHERE foto_punto_control_añadido_id = ?', [hash, row.insertId]);
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

    async deleteDatosPuntoControlFotos(VALUES){
        try{
            let control_id = VALUES.control_id;
            let pc_id = VALUES.id;
            
            let pcaddid = await pool.query('SELECT control_punto_control_añadidos_id FROM control_punto_control_añadidos WHERE control_punto_control_añadidos_id_hash = ? AND control_punto_control_añadidos_control_id = ?', [pc_id, control_id]);
            pcaddid = pcaddid[0].control_punto_control_añadidos_id;

            return await pool.query('SELECT foto_punto_control_añadido_foto as foto, foto_punto_control_añadido_id FROM foto_punto_control_añadido WHERE foto_punto_control_añadido_control_id = ? AND foto_punto_control_añadido_punto_control_id = ?', [control_id, pcaddid]).then(async function(rows){
                if(rows.length != 0){
                    for(let i = 0; i < rows.length; i++){
                        let fileExists = await fs.existsSync('E:/fotos_subidas/'+rows[i].foto);
                        await pool.query('DELETE FROM foto_punto_control_añadido WHERE foto_punto_control_añadido_control_id = ? AND foto_punto_control_añadido_punto_control_id = ? AND foto_punto_control_añadido_id = ?', [control_id, pcaddid, rows[i].foto_punto_control_añadido_id]).then(async function(){
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

    async deleteDatosPuntoControlFoto(VALUES){
        try{
            let control_id = VALUES.control_id;
            let pc_id = VALUES.id;
            let foto_id = VALUES.subId;

            let pcaddid = await pool.query('SELECT control_punto_control_añadidos_id FROM control_punto_control_añadidos WHERE control_punto_control_añadidos_id_hash = ? AND control_punto_control_añadidos_control_id = ?', [pc_id, control_id]);
            pcaddid = pcaddid[0].control_punto_control_añadidos_id;

            return await pool.query('SELECT foto_punto_control_añadido_foto as foto FROM foto_punto_control_añadido WHERE foto_punto_control_añadido_control_id = ? AND foto_punto_control_añadido_punto_control_id = ? AND foto_punto_control_añadido_id_hash = ?', [control_id, pcaddid, foto_id]).then(async function (row){
                
                if(row.length != 0){
                    let imagen = row[0].foto;
                    let fileExists = await fs.existsSync('E:/fotos_subidas/'+imagen);

                    return await pool.query('DELETE FROM foto_punto_control_añadido WHERE foto_punto_control_añadido_control_id = ? AND foto_punto_control_añadido_punto_control_id = ? AND foto_punto_control_añadido_id_hash = ?', [control_id, pcaddid, foto_id]).then(async function(row) {
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
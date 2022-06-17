const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');
const {numInforme} = require('../UtilCommon');
const sharp = require('sharp');
const fs = require('fs');
const {translateText} = require(appRoot+'/utils/Traductor');
const {escapeDataSlashesDot, escapeData} = require(appRoot+'/utils/ParseData');
const {genHash} = require(appRoot+'/utils/Crypto');

sharp.cache(false);

module.exports = {

    async getGruposControlDatos(informe_id, informe_hash){

        try{

            let gc = await pool.query('SELECT informe_grupo_control_id, informe_grupo_control_nombre, informe_grupo_control_nombre_en FROM informe_grupo_control WHERE informe_grupo_control_tipo_id = 1 AND informe_grupo_control_id != 0  ORDER BY informe_grupo_control_orden ASC');

            for(let i = 0; i < gc.length; i ++){

                gc[i].puntos_control = await pool.query('SELECT informe_punto_control_id, informe_punto_control_nombre, informe_punto_control_nombre_en FROM informe_punto_control WHERE informe_punto_control_grupo_control_id = ? AND informe_punto_control_tipo_id = 1', [gc[i].informe_grupo_control_id])
                
                for(let x = 0; x < gc[i].puntos_control.length; x++){
                    let values_pc = await pool.query('SELECT informe_data_id, informe_data_id_hash, informe_data_informe_id, informe_data_valor, informe_data_valor_en FROM informe_data WHERE informe_data_informe_id = ? AND informe_data_punto_control_id = ? AND informe_data_grupo_control_id = ?', [informe_id, gc[i].puntos_control[x].informe_punto_control_id, gc[i].informe_grupo_control_id])
                    gc[i].puntos_control[x].value = values_pc[0].informe_data_valor;
                    gc[i].puntos_control[x].informe_data_id_hash = values_pc[0].informe_data_id_hash;
                    gc[i].puntos_control[x].infrome_id = informe_hash;

                    //let total_fotos = await pool.query('SELECT count(*) AS total FROM informe_foto WHERE informe_foto_data_id = ? AND informe_foto_informe_id', [gc[i].puntos_control[x].informe_punto_control_id, informe_id]);
                    //total_fotos = total_fotos[0].total;

                    //gc[i].puntos_control[x].total_fotos = total_fotos;
                }

            }

            
            
            return {status: 'ok', gc};

        }catch(error){
            console.log(error)
            return {status:'error', code: 'Error al obtener los datos'};
        }

        
    },

    async postGruposControlDatos(VALUES){

        let informe_id = VALUES.informe_id;
        let id = await escapeData(VALUES.data.id);
        let value = await escapeDataSlashesDot(VALUES.data.value);
            try {

                let traduccion = await translateText(value,'es','en');
    
                await pool.query('UPDATE informe_data SET informe_data_valor = ?, informe_data_valor_en = ? WHERE informe_data_id_hash = ? AND informe_data_informe_id = ?', [value, traduccion, id, informe_id]);
                return {'status':'ok'};    
                
            } catch (error) {
                return {'status':'error', 'code': 'Error al actualizar los datos'};
            }
       
    },


    //FOTOS

    async getDatosPuntoControlFotos(VALUES){
        try{            
            let pc_id = VALUES.id;
            let informe_id = VALUES.informe_id;
            let informe_hash = VALUES.informe_hash;

            let fotos = await pool.query('SELECT informe_foto_foto AS foto, informe_foto_punto_control_id FROM informe_foto WHERE informe_foto_punto_control_id = ? AND informe_foto_informe_id = ?', [pc_id, informe_id]);

            let pc_nombre = await pool.query('SELECT informe_punto_control_nombre FROM informe_punto_control, informe_data WHERE informe_data_id_hash = ? AND informe_data_punto_control_id = informe_punto_control_id', [pc_id]);
            pc_nombre = pc_nombre[0].punto_control_nombre;

            return {status: 'ok', fotos, pc_nombre};
        }catch(error){
            console.log(error)
            return {status:'error', code: 'Error al obtener las fotos'};
        }
    },

    async postDatosPuntoControlFotos(VALUES){
       
        try{
            let informe_id = VALUES.informe_id;
            let informe_codigo = await numInforme(informe_id);
            let FILES = VALUES.files.file;
            let pc_id = VALUES.id;   
        
            if(!FILES){
        
                return {'status':'error', 'code': 'Ninguna foto seleccionada'};
        
            }else{
        
                let imagenes = FILES;
                
                let cpcid = await pool.query('SELECT informe_punto_control_id FROM informe_data WHERE informe_data_id_hash = ?', [pc_id]);
        
                let contador_num_img = await pool.query('SELECT COUNT(*) AS contador_num_img FROM informe_foto WHERE informe_foto_control_id = ? AND informe_punto_control_id = ?', [informe_id, cpcid[0].informe_punto_control_id]);
                contador_num_img = contador_num_img[0].contador_num_img;
        
                if(contador_num_img === null){
                    contador_num_img = 0;
                }
        
        
                if(imagenes.length != undefined){
        
                    for (i=0; i<imagenes.length; i++) {
                        const nombre_cont = contador_num_img + i;
                        const nombre_img =  informe_codigo + "-PC-"+ cpcid[0].informe_punto_control_id + "-" + nombre_cont + ".jpeg"; 
        
                        try{

                            await imagenes[i].mv(`E:/fotos_subidas/tmp/${nombre_img}`,async err => {
                                if(err){
                                    return {status:'error', code: 'Error al añadir la foto'};
                                }else{
                                    try{
                                        await sharp('E:/fotos_subidas/tmp/'+nombre_img)
                                        .resize(450, 450)
                                        .jpeg({ quality: 100 })
                                        .toFile('E:/fotos_subidas/'+nombre_img)
                                        .then(async function(){
                                            try{
                                                await fs.unlinkSync('E:/fotos_subidas/tmp/'+nombre_img);
    
                                                await pool.query('INSERT INTO informe_foto (informe_foto_foto, informe_foto_informe_id, informe_foto_punto_control_id) VALUES (?,?,?)', [nombre_img, control_id, cpcid[0].informe_punto_control_id]).then(async function(row){
                                                    let hash = await genHash('informe_foto', row.insertId);
                                                    await pool.query('UPDATE informe_foto SET informe_foto_id_hash = ? WHERE informe_foto_id = ?', [hash, row.insertId]);
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
        
                    const nombre_cont = contador_num_img + i;
                    const nombre_img =  informe_codigo + "-PC-"+ cpcid[0].informe_punto_control_id + "-" + nombre_cont + ".jpeg";  
                           
                    try{
                        await imagenes.mv(`E:/fotos_subidas/tmp/${nombre_img}`,async err => {
                            if(err){
                                return {status:'error', code: 'Error al añadir la foto'};
                            }else{
                                try{
                                    await sharp('E:/fotos_subidas/tmp/'+nombre_img)
                                    .resize(450, 450)
                                    .jpeg({ quality: 50 })
                                    .toFile('E:/fotos_subidas/'+nombre_img)
                                    .then(async function(){
                                        try{
                                            await fs.unlinkSync('E:/fotos_subidas/tmp/'+nombre_img);

                                            await pool.query('INSERT INTO informe_foto (informe_foto_foto, informe_foto_informe_id, informe_foto_punto_control_id) VALUES (?,?,?)', [nombre_img, control_id, cpcid[0].informe_punto_control_id]).then(async function(row){
                                                let hash = await genHash('informe_foto', row.insertId);
                                                await pool.query('UPDATE informe_foto SET informe_foto_id_hash = ? WHERE informe_foto_id = ?', [hash, row.insertId]);
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
            
            let cpcid = await pool.query('SELECT control_punto_control_punto_control_id FROM control_punto_control WHERE control_punto_control_id_hash = ? AND control_punto_control_control_id = ?', [pc_id, control_id]);


            return await pool.query('SELECT foto_punto_control_foto as foto, foto_punto_control_id FROM foto_punto_control WHERE foto_punto_control_control_id = ? AND foto_punto_control_punto_control_id = ?', [control_id, cpcid[0].control_punto_control_punto_control_id]).then(async function(rows){
                if(rows.length != 0){
                    for(let i = 0; i < rows.length; i++){
                        let fileExists = await fs.existsSync('E:/fotos_subidas/'+rows[i].foto);
                        await pool.query('DELETE FROM foto_punto_control WHERE foto_punto_control_control_id = ? AND foto_punto_control_punto_control_id = ? AND foto_punto_control_id = ?', [control_id, cpcid[0].control_punto_control_punto_control_id, rows[i].foto_punto_control_id]).then(async function(){
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

            let cpcid = await pool.query('SELECT control_punto_control_punto_control_id FROM control_punto_control WHERE control_punto_control_id_hash = ? AND control_punto_control_control_id = ?', [pc_id, control_id]);

            return await pool.query('SELECT foto_punto_control_foto as foto FROM foto_punto_control WHERE foto_punto_control_control_id = ? AND foto_punto_control_punto_control_id = ? AND foto_punto_control_id_hash = ?', [control_id, cpcid[0].control_punto_control_punto_control_id, foto_id]).then(async function (row){
                
                if(row.length != 0){
                    let imagen = row[0].foto;
                    let fileExists = await fs.existsSync('E:/fotos_subidas/'+imagen);

                    return await pool.query('DELETE FROM foto_punto_control WHERE foto_punto_control_control_id = ? AND foto_punto_control_punto_control_id = ? AND foto_punto_control_id_hash = ?', [control_id, cpcid[0].control_punto_control_punto_control_id, foto_id]).then(async function(row) {
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
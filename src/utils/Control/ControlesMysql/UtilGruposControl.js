const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');
const {numControl} = require('./UtilCommon');
const sharp = require('sharp');
const fs = require('fs');
const {translateText} = require(appRoot+'/utils/Traductor');
const {escapeDataSlashes} = require(appRoot+'/utils/ParseData');
const {genHash} = require(appRoot+'/utils/Crypto');

sharp.cache(false);

module.exports = {

    async getGruposControlDatos(control_id, control_hash){

        try{

            let gc = await pool.query('SELECT control_grupo_control_id_hash as control_grupo_control_id, control_grupo_control_grupo_control_id, control_grupo_control_control_id, control_grupo_control_valor, control_grupo_control_valoracion_id, valoracion_nombre, valoracion_nombre_en FROM control_grupo_control, valoracion WHERE control_grupo_control_control_id = ? AND control_grupo_control_tipo_control_id != 1 AND control_grupo_control_valoracion_id = valoracion_id',[control_id]);

            for(let i = 0; i < gc.length; i ++){

                gc[i].control_grupo_control_control_id = control_hash;
    
                let gc_nombre = await pool.query('SELECT grupo_control_nombre, grupo_control_nombre_en FROM grupo_control WHERE grupo_control_id = ?', [gc[i].control_grupo_control_grupo_control_id]);
                gc[i].control_grupo_control_nombre = gc_nombre[0].grupo_control_nombre;
                gc[i].control_grupo_control_nombre_en = gc_nombre[0].grupo_control_nombre_en;
                gc[i].valoracion = await pool.query('SELECT valoracion.valoracion_nombre, valoracion.valoracion_nombre_en, valoracion.valoracion_id, color.color_codigo FROM valoracion, color WHERE valoracion.valoracion_color_id = color.color_id');
                gc[i].puntos_control = await pool.query('SELECT control_punto_control_id_hash as control_punto_control_id, control_punto_control_control_id, control_punto_control_punto_control_id, control_punto_control_valor, control_punto_control_valoracion_id, valoracion_nombre, valoracion_nombre_en FROM control_punto_control, valoracion WHERE control_punto_control_grupo_control_id = ? AND control_punto_control_control_id = ? AND valoracion_id = control_punto_control_valoracion_id', [gc[i].control_grupo_control_grupo_control_id, control_id]);

                for(let x = 0; x < gc[i].puntos_control.length; x ++){

                    gc[i].puntos_control[x].control_punto_control_control_id = control_hash;

                    let pc_nombre = await pool.query('SELECT punto_control_nombre, punto_control_nombre_en,punto_control_id_hash FROM punto_control WHERE punto_control_id = ?', [gc[i].puntos_control[x].control_punto_control_punto_control_id]);
                    gc[i].puntos_control[x].control_punto_control_punto_control_nombre = pc_nombre[0].punto_control_nombre;
                    gc[i].puntos_control[x].control_punto_control_punto_control_nombre_en = pc_nombre[0].punto_control_nombre_en;
                    gc[i].puntos_control[x].valoracion = await pool.query('SELECT valoracion.valoracion_nombre, valoracion.valoracion_nombre_en,valoracion.valoracion_id, color.color_codigo FROM valoracion, color WHERE valoracion.valoracion_color_id = color.color_id');

                    let total_fotos = await pool.query('SELECT count(*) AS total FROM foto_punto_control WHERE foto_punto_control_control_id = ? AND foto_punto_control_punto_control_id = ?', [control_id,  gc[i].puntos_control[x].control_punto_control_punto_control_id]);
                    total_fotos = total_fotos[0].total;

                    gc[i].puntos_control[x].total_fotos = total_fotos;

                }

                gc[i].puntos_control_adds = await pool.query('SELECT control_punto_control_añadidos_id_hash as control_punto_control_añadidos_id, control_punto_control_añadidos_id as pcaddid, control_punto_control_añadidos_control_id, control_punto_control_añadidos_valoracion_id, control_punto_control_añadidos_nombre, control_punto_control_añadidos_nombre_en, control_punto_control_añadidos_valor FROM control_punto_control_añadidos WHERE control_punto_control_añadidos_control_id = ? AND control_punto_control_añadidos_grupo_control_id = ?', [control_id, gc[i].control_grupo_control_grupo_control_id]);
                
                for(let x = 0; x < gc[i].puntos_control_adds.length; x ++){

                    gc[i].puntos_control_adds[x].control_punto_control_añadidos_control_id = control_hash;

                    gc[i].puntos_control_adds[x].valoracion = await pool.query('SELECT valoracion.valoracion_nombre, valoracion.valoracion_nombre_en, valoracion.valoracion_id, color.color_codigo FROM valoracion, color WHERE valoracion.valoracion_color_id = color.color_id');
                    if(gc[i].puntos_control_adds[x].control_punto_control_añadidos_valoracion_id != null){
                        let valoracion_nombre = await pool.query('SELECT valoracion_nombre, valoracion_nombre_en FROM valoracion WHERE valoracion_id = ?', [gc[i].puntos_control_adds[x].control_punto_control_añadidos_valoracion_id]);
                        gc[i].puntos_control_adds[x].control_punto_control_añadidos_valoracion_nombre = valoracion_nombre[0].valoracion_nombre;
                        gc[i].puntos_control_adds[x].control_punto_control_añadidos_valoracion_nombre_en = valoracion_nombre[0].valoracion_nombre_en;
                    }

                    let total_fotos = await pool.query('SELECT count(*) AS total FROM foto_punto_control_añadido WHERE foto_punto_control_añadido_control_id = ? AND foto_punto_control_añadido_punto_control_id = ?', [control_id,  gc[i].puntos_control_adds[x].pcaddid]);
                    total_fotos = total_fotos[0].total;

                    gc[i].puntos_control_adds[x].total_fotos = total_fotos;

                }

            }
            
            return {status: 'ok', gc};

        }catch(error){
            return {status:'error', code: 'Error al obtener los datos'};
        }

        
    },

    async postGruposControlDatos(VALUES){

        let control_id = VALUES.control_id;
        let id = await escapeDataSlashes(VALUES.data.id);
        let value = await escapeDataSlashes(VALUES.data.value);
        let type = await escapeDataSlashes(VALUES.data.type);
        let subtype = await escapeDataSlashes(VALUES.data.subtype);

        if(value===''){value = 'null'}
        if(subtype === 'pc'){
            try {

                switch(type){
                    case 'value':
                        let traduccion = await translateText(value,'es','en');
                        await pool.query('UPDATE control_punto_control SET control_punto_control_valor = ?, control_punto_control_valor_en = ? WHERE control_punto_control_control_id = ? AND control_punto_control_id_hash = ?', [value, traduccion, control_id, id]);
                        return {'status':'ok'};
                        break;
                    case 'valoration':
                        await pool.query('UPDATE control_punto_control SET control_punto_control_valoracion_id = ? WHERE control_punto_control_control_id = ? AND control_punto_control_id_hash = ?', [value, control_id, id]);
                        return {'status':'ok'};
                        break;
                }
                } catch (error) {

                return {'status':'error', 'code': 'Error al actualizar los datos'};
            }
        }else if(subtype === 'gc'){
            try {
		
                await pool.query('UPDATE control_grupo_control SET control_grupo_control_valoracion_id = ? WHERE control_grupo_control_control_id = ? AND control_grupo_control_id_hash = ?', [value, control_id, id]);
                return {'status':'ok'};
                      
            } catch (error) {
                return {'status':'error', 'code': 'Error al actualizar los datos'};
            }
        }else{
            return {'status':'error', 'code': 'Error con el subtype de grupos de control'}; 
        }
    },

    async postAddedGruposControlDatos(VALUES){

        let control_id = VALUES.control_id;
        let id = VALUES.id;
        let value = await escapeDataSlashes(VALUES.data.value);
        let type = await escapeDataSlashes(VALUES.data.type);
        let subtype = await escapeDataSlashes(VALUES.data.subtype);

        if(subtype === 'addedpc'){
            try {

                switch(type){
                    case 'name':
                        let traduccion = await translateText(value,'es','en');
                        await pool.query('UPDATE control_punto_control_añadidos SET control_punto_control_añadidos_nombre = ?, control_punto_control_añadidos_nombre_en = ? WHERE control_punto_control_añadidos_control_id = ? AND control_punto_control_añadidos_id_hash = ?', [value, traduccion, control_id, id]);
                        return {'status':'ok'};
                        break;
                    case 'value':
                        await pool.query('UPDATE control_punto_control_añadidos SET control_punto_control_añadidos_valor = ? WHERE control_punto_control_añadidos_control_id = ? AND control_punto_control_añadidos_id_hash = ?', [value, control_id, id]);
                        return {'status':'ok'};
                        break;
                    case 'valoration':
                        await pool.query('UPDATE control_punto_control_añadidos SET control_punto_control_añadidos_valoracion_id = ? WHERE control_punto_control_añadidos_control_id = ? AND control_punto_control_añadidos_id_hash = ?', [parseInt(value), control_id, id]);
                        return {'status':'ok'};
                        break;
                }
            } catch (error) {

                return {'status':'error', 'code': 'Error al actualizar los datos'};
            }
        }else{
            return {'status':'error', 'code': 'Error con el subtype de grupos de control'}; 
        }
    },

    async addPuntoControlDatos(VALUES){

        let control_id = VALUES.control_id;
        let id = VALUES.id;

        try{
            let contador = await pool.query('SELECT MAX(control_punto_control_añadidos_orden) AS contador FROM control_punto_control_añadidos WHERE control_punto_control_añadidos_control_id = ? AND control_punto_control_añadidos_grupo_control_id = ?', [control_id, id]);
            contador = contador[0].contador;
            
            if(contador !== 0){
                contador += 1;
            }

            let inserted = await pool.query('INSERT INTO control_punto_control_añadidos (control_punto_control_añadidos_control_id, control_punto_control_añadidos_grupo_control_id, control_punto_control_añadidos_orden) VALUES (?,?,?)', [control_id, id, contador]);
            let hash = await genHash('control_punto_control_añadidos', inserted.insertId);
            
            await pool.query('UPDATE control_punto_control_añadidos SET control_punto_control_añadidos_id_hash = ? WHERE control_punto_control_añadidos_id = ?',[hash, inserted.insertId]);

            return {'status':'ok'};
        }catch(error){
            return {status:'error', code: 'Error al añadir el punto de control'};
        }

    },

    async deleteAddedPuntoControlDatos(VALUES){
        try{
            let control_id = VALUES.control_id;
            let id = VALUES.id;

            let pcadd_id = await pool.query('SELECT control_punto_control_añadidos_id from control_punto_control_añadidos WHERE control_punto_control_añadidos_id_hash = ?',[id]);
            pcadd_id = pcadd_id[0].control_punto_control_añadidos_id;

            let imagenes = await pool.query('SELECT foto_punto_control_añadido_id, foto_punto_control_añadido_foto from foto_punto_control_añadido WHERE foto_punto_control_añadido_punto_control_id = ? AND foto_punto_control_añadido_control_id = ?',[pcadd_id, control_id]);
            for(let i = 0; i < imagenes.length; i++){
                try {
                    fs.unlinkSync('E:/fotos_subidas/'+imagenes[i].foto_punto_control_añadido_foto);
                    await pool.query('DELETE FROM foto_punto_control_añadido WHERE foto_punto_control_añadido_control_id = ? AND foto_punto_control_añadido_punto_control_id = ? AND foto_punto_control_añadido_id = ?', [control_id, pcadd_id, imagenes[i].foto_punto_control_añadido_id]);
                } catch (error) {
                }
            } 

            await pool.query('DELETE FROM control_punto_control_añadidos WHERE control_punto_control_añadidos_id_hash = ? AND control_punto_control_añadidos_control_id = ?', [id, control_id])

            
            return {'status':'ok'};

        }catch(error){
            return {status:'error', code: 'Error al eliminar el punto de control'};
        }

    },

    //FOTOS

    async getDatosPuntoControlFotos(VALUES){
        try{            
            let pc_id = VALUES.id;
            let control_id = VALUES.control_id;
            let control_hash = VALUES.control_hash;

            let idpc = await pool.query('SELECT control_punto_control_id, control_punto_control_punto_control_id FROM control_punto_control WHERE control_punto_control_id_hash = ?',[pc_id]);

            let fotos = await pool.query('SELECT foto_punto_control_foto AS foto, foto_punto_control_id_hash as foto_punto_control_id FROM foto_punto_control WHERE foto_punto_control_punto_control_id = ? AND foto_punto_control_control_id = ?', [idpc[0].control_punto_control_punto_control_id, control_id]);

            for(let i=0; i<fotos.length; i++){
                fotos[i].foto_punto_control_control_id = control_hash;
                fotos[i].control_punto_control_id = pc_id;
            }

            let pc_nombre = await pool.query('SELECT punto_control_nombre, punto_control_nombre_en FROM punto_control WHERE punto_control_id = ?', [idpc[0].control_punto_control_punto_control_id]);
            let pc_nombre_en = pc_nombre[0].punto_control_nombre_en;
            pc_nombre = pc_nombre[0].punto_control_nombre;

            return {status: 'ok', fotos, pc_nombre_en, pc_nombre};
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

                let cpcid = await pool.query('SELECT control_punto_control_id, control_punto_control_punto_control_id, control_punto_control_grupo_control_id FROM control_punto_control WHERE control_punto_control_id_hash = ?', [pc_id]);


                let contador_num_img = await pool.query('SELECT COUNT(*) AS contador_num_img FROM foto_punto_control WHERE foto_punto_control_control_id = ? AND foto_punto_control_punto_control_id = ?', [control_id, cpcid[0].control_punto_control_punto_control_id]);
                contador_num_img = contador_num_img[0].contador_num_img;
        
                if(contador_num_img === null){
                    contador_num_img = 0;
                }


                if(imagenes.length != undefined){
        
                    for (i=0; i<imagenes.length; i++) {
                        const nombre_cont = contador_num_img + i;
                        const nombre_img =  control_codigo + "-PC-"+ cpcid[0].control_punto_control_punto_control_id + "-" + nombre_cont + ".jpeg"; 

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
    
                                                await pool.query('INSERT INTO foto_punto_control (foto_punto_control_foto, foto_punto_control_control_id, foto_punto_control_punto_control_id) VALUES (?,?,?)', [nombre_img, control_id, cpcid[0].control_punto_control_punto_control_id]).then(async function(row){
                                                    let hash = await genHash('foto_punto_control', row.insertId);
                                                    await pool.query('UPDATE foto_punto_control SET foto_punto_control_id_hash = ? WHERE foto_punto_control_id = ?', [hash, row.insertId]);
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
                    let nombre_img = control_codigo + "-PC-"+ cpcid[0].control_punto_control_punto_control_id + "-" + nombre_cont + ".jpeg"; 
                           
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
                                            
                                            await pool.query('INSERT INTO foto_punto_control (foto_punto_control_foto, foto_punto_control_control_id, foto_punto_control_punto_control_id) VALUES (?,?,?)', [nombre_img, control_id, cpcid[0].control_punto_control_punto_control_id]).then(async function(row){
                                                let hash = await genHash('foto_punto_control', row.insertId);
                                                await pool.query('UPDATE foto_punto_control SET foto_punto_control_id_hash = ? WHERE foto_punto_control_id = ?', [hash, row.insertId]);
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
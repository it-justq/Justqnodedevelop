const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');
const {numInforme} = require('../UtilCommon');
const fs = require('fs');
const {escapeDataSlashes} = require(appRoot+'/utils/ParseData');
const {genHash} = require(appRoot+'/utils/Crypto');

module.exports = {

    async deletePericialTotal(VALUES){
        try{          
            
            if(VALUES.control_hash === VALUES.data.controlId){
                
                const control_id = VALUES.control_id;
                let control_codigo = await numControl(VALUES.control_id);
                const path_img_control = "E:/fotos_subidas/";


                const fotos_control = await pool.query("SELECT foto_control_foto as foto FROM foto_control WHERE foto_control_control_id = ?", [control_id]);
                const fotos_acciones =  pool.query("SELECT foto_control_accion_foto AS foto FROM foto_control_accion WHERE foto_control_accion_control_id = ?", [control_id]);
                const fotos_cajas = await pool.query("SELECT foto_control_caja_foto_nombre AS foto FROM foto_control_caja WHERE foto_control_caja_control_id = ?", [control_id]);
                const fotos_documentacion = await pool.query("SELECT foto_control_documentacion_foto AS foto FROM foto_control_documentacion WHERE foto_control_documentacion_control_id = ?", [control_id]);
                const fotos_pallets = await pool.query("SELECT foto_control_pallet_foto_nombre AS foto FROM foto_control_pallet WHERE foto_control_pallet_control_id = ?", [control_id]);
                const fotos_pesos = await pool.query("SELECT foto_control_peso_foto_nombre AS foto FROM foto_control_peso WHERE foto_control_peso_control_id = ?", [control_id]);
                const fotos_pc = await pool.query("SELECT foto_punto_control_foto AS foto FROM foto_punto_control WHERE foto_punto_control_control_id = ?", [control_id]);
                const fotos_pc_add = await pool.query("SELECT foto_punto_control_añadido_foto AS foto FROM foto_punto_control_añadido WHERE foto_punto_control_añadido_control_id = ?", [control_id]);



                //FOTOS CONTROL
                if(fotos_control.length > 0){
                    for(let i = 0; i < fotos_control.length; i ++){
                        try {
                            fs.unlinkSync(path_img_control+fotos_control[i].foto);
                            
                        } catch(err) {
                            console.error('Error al eliminar la foto' + fotos_control[i].foto, err);
                        }
                    }
                    await pool.query("DELETE FROM foto_control WHERE foto_control_control_id = ?", [control_id]);

                }

                //FOTOS ACCIONES
                if(fotos_acciones.length > 0){
                    for(let i = 0; i < fotos_acciones.length; i ++){
                        try {
                            fs.unlinkSync(path_img_control+fotos_acciones[i].foto);
                            
                        } catch(err) {
                            console.error('Error al eliminar la foto' + fotos_acciones[i].foto, err);
                        }
                    }
                    await pool.query("DELETE FROM foto_control_accion WHERE foto_control_accion_control_id = ?", [control_id]);

                }

                //FOTOS CAJAS
                if(fotos_cajas.length > 0){
                    for(let i = 0; i < fotos_cajas.length; i ++){
                        try {
                            fs.unlinkSync(path_img_control+fotos_cajas[i].foto);
                            
                        } catch(err) {
                            console.error('Error al eliminar la foto' + fotos_cajas[i].foto, err);
                        }
                    }
                    await pool.query("DELETE FROM foto_control_caja WHERE foto_control_caja_control_id = ?", [control_id]);

                }

                //FOTOS DOCUMENTACION
                if(fotos_documentacion.length > 0){
                    for(let i = 0; i < fotos_documentacion.length; i ++){
                        try {
                            fs.unlinkSync(path_img_control+fotos_documentacion[i].foto);
                            
                        } catch(err) {
                            console.error('Error al eliminar la foto' + fotos_documentacion[i].foto, err);
                        }
                    }
                    await pool.query("DELETE FROM foto_control_documentacion WHERE foto_control_documentacion_control_id = ?", [control_id]);

                }

                //FOTOS PALLETS
                if(fotos_pallets.length > 0){
                    for(let i = 0; i < fotos_pallets.length; i ++){
                        try {
                            fs.unlinkSync(path_img_control+fotos_pallets[i].foto);
                            
                        } catch(err) {
                            console.error('Error al eliminar la foto' + fotos_pallets[i].foto, err);
                        }
                    }
                    await pool.query("DELETE FROM foto_control_pallet WHERE foto_control_pallet_control_id = ?", [control_id]);

                }

                //FOTOS PESOS
                if(fotos_pesos.length > 0){
                    for(let i = 0; i < fotos_pesos.length; i ++){
                        try {
                            fs.unlinkSync(path_img_control+fotos_pesos[i].foto);
                            
                        } catch(err) {
                            console.error('Error al eliminar la foto' + fotos_pesos[i].foto, err);
                        }
                    }
                    await pool.query("DELETE FROM foto_control_peso WHERE foto_control_peso_control_id = ?", [control_id]);

                }

                //FOTOS PC
                if(fotos_pc.length > 0){
                    for(let i = 0; i < fotos_pc.length; i ++){
                        try {
                            fs.unlinkSync(path_img_control+fotos_pc[i].foto);
                            
                        } catch(err) {
                            console.error('Error al eliminar la foto' + fotos_pc[i].foto, err);
                        }
                    }
                    await pool.query("DELETE FROM foto_punto_control WHERE foto_punto_control_control_id = ?", [control_id]);

                }

                //FOTOS PC ADD
                if(fotos_pc_add.length > 0){
                    for(let i = 0; i < fotos_pc_add.length; i ++){
                        try {
                            fs.unlinkSync(path_img_control+fotos_pc_add[i].foto);
                            
                        } catch(err) {
                            console.error('Error al eliminar la foto' + fotos_pc_add[i].foto, err);
                        }
                    }
                    await pool.query("DELETE FROM foto_punto_control_añadido WHERE foto_punto_control_añadido_control_id = ?", [control_id]);

                }






                await pool.query("DELETE FROM control_punto_control WHERE control_punto_control_control_id = ?", [control_id]);
                await pool.query("DELETE FROM control_punto_control_agrupacion WHERE control_punto_control_agrupacion_control_id = ?", [control_id]);
                await pool.query("DELETE FROM control_punto_control_añadidos WHERE control_punto_control_añadidos_control_id = ?", [control_id]);
                await pool.query("DELETE FROM control_grupo_control WHERE control_grupo_control_control_id = ?", [control_id]);

                await pool.query("DELETE FROM control_accion WHERE control_accion_control_id = ?", [control_id]);

                await pool.query("DELETE FROM control_caja WHERE control_caja_control_id = ?", [control_id]);

                await pool.query("DELETE FROM control_pallet WHERE control_pallet_control_id = ?", [control_id]);

                await pool.query("DELETE FROM control_peso WHERE control_peso_control_id = ?", [control_id]);

                await pool.query("DELETE FROM foto_control WHERE foto_control_control_id = ?", [control_id]);

                await pool.query("DELETE FROM foto_control_accion WHERE foto_control_accion_control_id = ?", [control_id]);

                await pool.query("DELETE FROM foto_control_caja WHERE foto_control_caja_control_id = ?", [control_id]);

                await pool.query("DELETE FROM foto_control_documentacion WHERE foto_control_documentacion_control_id = ?", [control_id]);

                await pool.query("DELETE FROM foto_control_pallet WHERE foto_control_pallet_control_id = ?", [control_id]);

                await pool.query("DELETE FROM foto_control_peso WHERE foto_control_peso_control_id = ?", [control_id]);

                await pool.query("DELETE FROM foto_punto_control WHERE foto_punto_control_control_id = ?", [control_id]);

                await pool.query("DELETE FROM foto_punto_control_añadido WHERE foto_punto_control_añadido_control_id = ?", [control_id]);


                await pool.query("DELETE FROM control_tabla WHERE control_tabla_control_id = ?", [control_id]);
                await pool.query("DELETE FROM control_tabla_data WHERE control_tabla_data_control_id = ?", [control_id]);



                await pool.query("DELETE FROM control WHERE control_id = ? AND control_codigo = ?", [control_id, control_codigo]);

            }
            

            return {status: "ok"};

        }catch(error){
            return {status:'error', code: 'Error al eliminar el control'};
        }

    },


   

};
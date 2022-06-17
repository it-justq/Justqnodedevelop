const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');
const {getDate} = require(appRoot+'/utils/Date');

module.exports = {

    async getControlesListMysql(PARAMS, inicio_pagina){
        try{
            let usuario_id = PARAMS.usuario_id;
            let rol_id = PARAMS.rol_id;
            let fecha = getDate();
            let controles;
            let return_controles = [];
            

            if(rol_id === 1){
                controles = await pool.query('SELECT control_id_hash as control_id, control_codigo, control_estado, control_valoracion_id, control_cliente_id, control_cliente_mod, control_referencia, control_fecha, control_producto_familia_id, control_producto_marca, control_plataforma_id, control_plataforma_mod FROM control ORDER BY control_fecha DESC LIMIT 15 OFFSET ?', [inicio_pagina]);
            }else if(rol_id === 2){
                controles = await pool.query('SELECT control_id_hash as control_id, control_codigo, control_estado, control_valoracion_id, control_cliente_id, control_cliente_mod, control_referencia, control_fecha, control_producto_familia_id, control_producto_marca, control_plataforma_id, control_plataforma_mod FROM control WHERE control_tecnico_id = ? ORDER BY control_fecha DESC LIMIT 15 OFFSET ?', [usuario_id, inicio_pagina]);
            }else if(rol_id === 3){
                let cliente_id = await pool.query('SELECT cliente_id FROM cliente WHERE cliente_usuario_id = ?', [usuario_id]);
                cliente_id = cliente_id[0].cliente_id;
                //controles = await pool.query('SELECT control_id_hash as control_id, control_codigo, control_valoracion_id, control_cliente_id, control_referencia, control_fecha, control_producto_familia_id, control_producto_marca, control_plataforma_id FROM control WHERE control_fecha = ? AND control_cliente_id = ? AND control_estado = 1 ORDER BY control_fecha', [fecha, cliente_id]);
                controles = await pool.query('SELECT control_id_hash as control_id, control_codigo, control_valoracion_id, control_cliente_id, control_referencia, control_fecha, control_producto_familia_id, control_producto_marca, control_plataforma_id, control_plataforma_mod FROM control WHERE control_cliente_id = ? AND control_estado = 1 ORDER BY control_fecha DESC LIMIT 15 OFFSET ?', [cliente_id, inicio_pagina]);
             }else{
                controles = [];
            }
            
            let total_controles = controles.length;

            if(total_controles != 0){
                for(let i = 0; i < total_controles; i ++){

                    switch(controles[i].control_estado){
                        case 0:
                            controles[i].control_estado_nombre = "No activo";
                            break;
                        case 1:
                            controles[i].control_estado_nombre = "Activo";
                            break;
                    }
    
                    let plataforma_nombre = await pool.query('SELECT plataforma_nombre FROM plataforma WHERE plataforma_id = ?', [controles[i].control_plataforma_id]);
                    let familia_nombre = await pool.query('SELECT familia_nombre FROM familia WHERE familia_id = ?', [controles[i].control_producto_familia_id]);
                    let familia_nombre_en = await pool.query('SELECT familia_nombre_en FROM familia WHERE familia_id = ?', [controles[i].control_producto_familia_id]);
                    let cliente_nombre = await pool.query('SELECT cliente_nombre FROM cliente WHERE cliente_id = ?', [controles[i].control_cliente_id]);
                    let valoracion = await pool.query('SELECT valoracion_nombre, valoracion_color_id FROM valoracion WHERE valoracion_id = ?', [controles[i].control_valoracion_id]);
                    let color = await pool.query('SELECT color_codigo FROM color WHERE color_id = ?', [valoracion[0].valoracion_color_id]);
    
                    controles[i].plataforma_nombre = (controles[i].control_plataforma_mod != 'null') ? controles[i].control_plataforma_mod : plataforma_nombre[0].plataforma_nombre;
                    controles[i].familia_nombre = familia_nombre[0].familia_nombre;
                    controles[i].familia_nombre_en = familia_nombre_en[0].familia_nombre_en;
                    controles[i].cliente_nombre = (controles[i].control_cliente_mod != 'null') ? controles[i].control_cliente_mod : cliente_nombre[0].cliente_nombre;
                    controles[i].valoracion_nombre = valoracion[0].valoracion_nombre;
    
                    if(color[0].color_codigo === 'FFFFFF'){
                        controles[i].valoracion_color = 'd9d9d9';
                    }else{
                        controles[i].valoracion_color = color[0].color_codigo;
                    }

                    controles[i].tipo_mysql = true;
                }
                return_controles.controles = controles;
                return_controles.status = true;
            }else{
                return_controles.status = false;
            }
            
            
            return return_controles;
        
        }catch(error){
            return {status:'error', code: 'Error al obtener los controles'};
        }

    }

};
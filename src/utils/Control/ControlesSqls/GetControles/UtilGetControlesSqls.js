const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');
const config = require(appRoot+'/utils/Conexion/UtilDatabase_sqls');
const sql = require('mssql');
const dayjs = require ('dayjs');
const {getDate, redateSqls} = require(appRoot+'/utils/Date');
//let controles = await mssql.query("SELECT Familia_idGuid, Variedad_idGuid, Control_idGuid FROM control WHERE Familia_idGuid=NULL order by Fecha_Control desc");
//controles = controles.recordset;


module.exports = {

    async getControlesListSqls(PARAMS, inicio_pagina){
        try{
            const mssql = await sql.connect(config);

            let usuario_id = PARAMS.usuario_id;
            let rol_id = PARAMS.rol_id;
            let fecha = getDate()+' 00:00:00.000';
            let usuario_nombre = PARAMS.user;

            let controles;
            let return_controles = [];
            let total_controles = 0;

            let usuario_user = null;
            if(rol_id != 1){
                let userDB = await pool.query('SELECT usuario_user FROM usuario WHERE usuario_id = ?', [usuario_id]);

                if(userDB.length != 0){
                    usuario_user = userDB[0].usuario_user;
                }
            }
           
            if(rol_id === 1){//admin
                controles = await mssql.query(`SELECT Control_idGuid AS control_id, 
                                                        codigo AS control_codigo, 
                                                        Tecnico_idGuid, 
                                                        Cliente_idGuid, 
                                                        Fecha_Control AS control_fecha, 
                                                        Referencia_Cliente AS control_referencia, 
                                                        Valoracion_idGuid, 
                                                        Plataforma_idGuid, 
                                                        Familia_idGuid,
                                                        Marca AS control_producto_marca
                                                        FROM control WHERE finalizado = 1 ORDER BY Fecha_Control DESC OFFSET `+ inicio_pagina +` ROWS FETCH NEXT 15 ROWS ONLY`);
                controles = controles.recordset;

            }else if(rol_id === 2){//tecnico

                let usuario_idSQLS = await mssql.query(`SELECT Usuario_idGuid FROM USUARIOS WHERE Usuario = '`+usuario_user+`'`);
                usuario_idSQLS = usuario_idSQLS.recordset[0].Usuario_idGuid;

                controles = await mssql.query(`SELECT Control_idGuid AS control_id, 
                                            codigo AS control_codigo, 
                                            Tecnico_idGuid, 
                                            Cliente_idGuid, 
                                            Fecha_Control AS control_fecha, 
                                            Referencia_Cliente AS control_referencia, 
                                            Valoracion_idGuid, 
                                            Plataforma_idGuid, 
                                            Familia_idGuid,
                                            Marca AS control_producto_marca
                                            FROM control WHERE Tecnico_idGuid = '`+usuario_idSQLS+`' finalizado = 1 ORDER BY Fecha_Control DESC OFFSET `+ inicio_pagina +` ROWS FETCH NEXT 15 ROWS ONLY`);
                controles = controles.recordset;

            }else if(rol_id === 3){//cliente

                let cliente_idSQLS = await mssql.query(`SELECT Cliente_idGuid FROM CLIENTES WHERE Nombre = '`+usuario_nombre+`'`);
                cliente_idSQLS = cliente_idSQLS.recordset[0].Cliente_idGuid;

                controles = await mssql.query(`SELECT Control_idGuid AS control_id, 
                                                        codigo AS control_codigo, 
                                                        Tecnico_idGuid, 
                                                        Cliente_idGuid, 
                                                        Fecha_Control AS control_fecha, 
                                                        Referencia_Cliente AS control_referencia, 
                                                        Valoracion_idGuid, 
                                                        Plataforma_idGuid, 
                                                        Familia_idGuid,
                                                        Marca AS control_producto_marca
                                                        FROM control WHERE Cliente_idGuid = '`+cliente_idSQLS+`' AND finalizado = 1 ORDER BY Fecha_Control DESC OFFSET `+ inicio_pagina +` ROWS FETCH NEXT 15 ROWS ONLY`);
                controles = controles.recordset;



            }else{
                controles = [];
            }


            
            total_controles = controles.length;

            if(total_controles != 0){
                for(let i = 0; i < total_controles; i ++){

                    controles[i].estado = 1;
                    
                    if(controles[i].Familia_idGuid != null){
                        let familia_nombre = await mssql.query("SELECT Nombre FROM FAMILIA WHERE Familia_idGuid = '"+controles[i].Familia_idGuid+"'");
                        controles[i].familia_nombre = familia_nombre.recordset[0].Nombre;
                    }else{
                        controles[i].familia_nombre = 'null';
                    }


                    if(controles[i].Plataforma_idGuid != null){
                        let plataforma_nombre = await mssql.query("SELECT Nombre FROM PLATAFORMAS WHERE Plataforma_idGuid = '"+controles[i].Plataforma_idGuid+"'");
                        controles[i].plataforma_nombre = plataforma_nombre.recordset[0].Nombre;
                    }else{
                        controles[i].plataforma_nombre = 'null';
                    }


                    if(controles[i].Cliente_idGuid != null){
                        let cliente_nombre = await mssql.query("SELECT Nombre FROM CLIENTES WHERE Cliente_idGuid = '"+controles[i].Cliente_idGuid+"'");
                        controles[i].cliente_nombre = cliente_nombre.recordset[0].Nombre;
                    }else{
                        controles[i].cliente_nombre = 'null';
                    }



                    if(controles[i].Valoracion_idGuid != null){
                        let valoracion = await mssql.query("SELECT VALORACION.Nombre AS ValoracionNombre, COLOR.Color AS ColorNombre FROM VALORACION, COLOR WHERE VALORACION.Valoracion_idGuid = '"+controles[i].Valoracion_idGuid+"' AND VALORACION.Color_idGuid = COLOR.Color_idGuid");
                        controles[i].valoracion_nombre = valoracion.recordset[0].ValoracionNombre;
                        controles[i].valoracion_color =  valoracion.recordset[0].ColorNombre.replace(/#/g,'');
                        
                    }else{
                        controles[i].valoracion_nombre = 'Sin valorar';
                        controles[i].valoracion_color = 'd9d9d9';
                    }


                    
                    if(controles[i].control_fecha != null){
                        let redateFecha = await redateSqls(controles[i].control_fecha);
                        controles[i].control_fecha = redateFecha;
                    
                    }

                    controles[i].tipo_sqls = true;
                    controles[i].control_estado = 1;

                }

                return_controles.controles = controles;
                return_controles.status = true;
            }else{
                return_controles.status = false;
            }

            return return_controles;

        }catch(error){
            return {status:'error', code: error};
        }

    }

};
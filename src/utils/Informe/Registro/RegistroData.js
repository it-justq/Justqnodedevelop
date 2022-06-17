const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');
const config = require(appRoot+'/utils/Conexion/UtilDatabase_sqls');
const sql = require('mssql');
const dayjs = require ('dayjs');
const {escapeDataSearchControles} = require(appRoot+'/utils/ParseData');
const {redateSqls} = require(appRoot+'/utils/Date');



module.exports = {
    async getRegistro(){
        try{
            let data = {};
            data.clientes = await pool.query("SELECT cliente_nombre, cliente_id_hash FROM cliente order by cliente_nombre ASC");
            data.tecnicos = await pool.query('SELECT usuario_id_hash as usuario_id, usuario_nombre FROM justquality_bd.usuario WHERE usuario_rol_id = 1 UNION SELECT usuario_id_hash as usuario_id, usuario_nombre FROM justquality_bd.usuario WHERE usuario_rol_id = 2 ORDER BY usuario_nombre');
            return data;
        }catch(e){
            return {status: "Error al obtener los datos"}
        }
    },
    async postRegistro(DATA, USER){

        try{
            const mssql = await sql.connect(config);

            let fecha = '';
            let fechaSQLS = '';
            let inicio = '';
            let inicioSQLS = '';
            let fin = '';
            let finSQLS = '';
            let cliente = '';
            let clienteSQLS ='';
            let tecnico = '';
            let tecnicoSQLS = '';
    
            let query_data_mysql = '';
            let query_data_sqls = '';
    
            let user_requested = '';
            let user_name = '';

            let controles, controlesSQLS = '';
            
            let tecnicoDB, clienteDB = '';    
    
            if(DATA.cliente !='' || DATA.fecha != '' || DATA.incio != '' || DATA.fin != '' || DATA.tecnico != ''){
                if(DATA.fecha != ''){
                    let fechaParse = await escapeDataSearchControles(DATA.fecha);
                    fecha = " control_fecha = '"+fechaParse+"' AND ";
                    fechaSQLS = " Fecha_Control = '"+fechaParse+"  00:00:00.000' AND ";
                }else if(DATA.incio != '' || DATA.fin != ''){
                    if(DATA.inicio != ''){
                        let inicioParse = await escapeDataSearchControles(DATA.inicio);
                        inicio = " control_fecha >= '"+inicioParse+"' AND ";
                        inicioSQLS = " Fecha_Control >= '"+inicioParse+"  00:00:00.000' AND ";
                    }
                    if(DATA.fin != ''){
                        let finParse = await escapeDataSearchControles(DATA.fin);
                        fin = " control_fecha <= '"+finParse+"' AND ";
                        finSQLS = " Fecha_Control <= '"+finParse+"  00:00:00.000' AND ";
                    }
                }
                
                if(DATA.cliente !='' && DATA.cliente != undefined){
                        let clienteParse = await escapeDataSearchControles(DATA.cliente);
                        let clienteId = await pool.query("SELECT cliente_id, cliente_nombre FROM cliente WHERE cliente_id_hash = ?", [clienteParse]);
                        cliente = " control_cliente_id = " +clienteId[0].cliente_id + " AND ";
                        let clienteIdSQLS = await mssql.query("SELECT Cliente_IdGuid FROM CLIENTES WHERE Nombre = '"+clienteId[0].cliente_nombre+"'");

                        if(clienteIdSQLS.rowsAffected[0] != 0){
                            clienteSQLS = " Cliente_IdGuid = '"+clienteIdSQLS.recordset[0].Cliente_IdGuid+ "' AND ";
                        }else{
                            clienteSQLS = 'null';
                        }

                }

                if(DATA.tecnico !='' && DATA.tecnico != undefined){
                    let tecnicoParse = await escapeDataSearchControles(DATA.tecnico);
                    let tecnicoId = await pool.query("SELECT usuario_id, usuario_nombre FROM usuario WHERE usuario_id_hash = ?", [tecnicoParse]);
                    tecnico = " control_tecnico_id = " +tecnicoId[0].usuario_id + " AND ";
                    let tecnicoIdSQLS = await mssql.query("SELECT Usuario_IdGuid FROM USUARIOS WHERE Nombre = '"+tecnicoId[0].usuario_nombre+"'");

                    if(tecnicoIdSQLS.rowsAffected[0] != 0){
                        tecnicoSQLS = " Usuario_IdGuid = '"+tecnicoIdSQLS.recordset[0].Usuario_IdGuid+ "' AND ";
                    }else{
                        tecnicoSQLS = 'null';
                    }

            }
            }
    
    
            let user_get = await pool.query('SELECT usuario_rol_id, usuario_nombre, usuario_user, usuario_idioma_id FROM usuario WHERE usuario_id = ?', [USER]);

            if(user_get.length != 1){
    
            }else{
                user_rol = user_get[0].usuario_rol_id;
                user_requested = user_get[0].usuario_nombre;
                user_name = user_get[0].usuario_user;
                user_language = user_get[0].usuario_idioma_id;
    
                if(user_rol === 1){
                    query_data_mysql = fecha+inicio+fin+cliente+tecnico;
                    query_data_sqls = fechaSQLS+inicioSQLS+finSQLS+clienteSQLS+tecnicoSQLS;

                }else if(user_rol === 2){
                    query_data_mysql = fecha+inicio+fin+cliente+' control_tecnico_id = ' +USER+ ' AND ';

                    tecnicoDB = await mssql.query(`SELECT Usuario_idGuid FROM USUARIOS WHERE Usuario = '`+user_name+`'`);
                    if(tecnicoDB.recordset.length != 0){
                        tecnicoDB = tecnicoDB.recordset[0].Usuario_idGuid;
                        tecnicoDB = " tecnico_idGuid = '"+tecnicoDB+"' AND ";
                        query_data_sqls = fechaSQLS+inicioSQLS+finSQLS+tecnicoDB+clienteSQLS;
                    }
    
                }else if(user_rol === 3){
                    let clienteSearch = await pool.query('SELECT cliente_id, cliente_nombre FROM cliente WHERE cliente_usuario_id = ?', [USER]);
                    query_data_mysql = fecha+inicio+fin+' control_cliente_id = ' +clienteSearch[0].cliente_id+' AND ';

                    clienteDB = await mssql.query(`SELECT Cliente_idGuid FROM CLIENTES WHERE Nombre = '`+clienteSearch[0].cliente_nombre+`'`);
                    if(clienteDB.recordset.length != 0){
                        clienteDB = clienteDB.recordset[0].Cliente_idGuid;
                        clienteDB = " cliente_idGuid = '"+clienteDB+"' AND ";
                        query_data_sqls = fechaSQLS+inicioSQLS+finSQLS+clienteDB;
                    }

                }else{
    
                }


                controles = await pool.query(`SELECT 
                                            control_codigo, 
                                            control_fecha, 
                                            control_referencia, 
                                            control_plataforma_id, 
                                            control_expedicion_pais_destino_id, 
                                            control_expedicion_pais_origen_id, 
                                            control_expedicion_contenedor,
                                            control_tecnico_id, 
                                            control_cliente_id, 
                                            control_producto_familia_id, 
                                            control_packaging_pallets,

                                            control_tecnico_mod,
                                            control_cliente_mod,
                                            control_plataforma_mod,
                                            control_expedicion_pais_origen_mod,
                                            control_expedicion_pais_destino_mod,
                                            control_producto_familia_mod,
    
                                            control_valoracion_id
    
                                            FROM control WHERE `+query_data_mysql+` control_borrado = 0 AND control_estado = 1 ORDER BY control_fecha DESC`);
        
                if (user_language == 2){
                    for(let i = 0; i < controles.length; i++){
                        let plataforma = await pool.query('SELECT plataforma_nombre FROM plataforma WHERE plataforma_id = ?', [controles[i].control_plataforma_id]);
                        let pais_origen = await pool.query('SELECT pais_nombre_en FROM pais WHERE pais_id = ?', [controles[i].control_expedicion_pais_origen_id]);
                        let pais_destino = await pool.query('SELECT pais_nombre_en FROM pais WHERE pais_id = ?', [controles[i].control_expedicion_pais_destino_id]);
                        let tecnico = await pool.query('SELECT usuario_nombre FROM usuario WHERE usuario_id = ?', [controles[i].control_tecnico_id]);
                        let cliente = await pool.query('SELECT cliente_nombre FROM cliente WHERE cliente_id = ?', [controles[i].control_cliente_id]);
                        let familia = await pool.query('SELECT familia_nombre_en FROM familia WHERE familia_id = ?', [controles[i].control_producto_familia_id]);
                        let valoracion = await pool.query('SELECT valoracion_nombre_en FROM valoracion WHERE valoracion_id = ?', [controles[i].control_valoracion_id]);
            
            
                        controles[i].control_plataforma_nombre = controles[i].control_plataforma_mod != 'null' ? controles[i].control_plataforma_mod : plataforma[0].plataforma_nombre;
                        controles[i].control_pais_origen_nombre = controles[i].control_expedicion_pais_destino_mod != 'null' ? controles[i].control_expedicion_pais_destino_mod : pais_origen[0].pais_nombre_en;
                        controles[i].control_pais_destino_nombre = controles[i].control_expedicion_pais_origen_mod != 'null' ? controles[i].control_expedicion_pais_origen_mod : pais_destino[0].pais_nombre_en;
                        controles[i].control_tecnico_nombre = controles[i].control_tecnico_mod != 'null' ? controles[i].control_tecnico_mod : tecnico[0].usuario_nombre;
                        controles[i].control_cliente_nombre = controles[i].control_cliente_mod != 'null' ? controles[i].control_cliente_mod : cliente[0].cliente_nombre;
                        controles[i].control_producto_familia_nombre = controles[i].control_producto_familia_mod != 'null' ? controles[i].control_producto_familia_mod : familia[0].familia_nombre_en;
            
                        controles[i].control_valoracion_nombre = valoracion[0].valoracion_nombre;
                    }
                }else{
                    for(let i = 0; i < controles.length; i++){
                        let plataforma = await pool.query('SELECT plataforma_nombre FROM plataforma WHERE plataforma_id = ?', [controles[i].control_plataforma_id]);
                        let pais_origen = await pool.query('SELECT pais_nombre FROM pais WHERE pais_id = ?', [controles[i].control_expedicion_pais_origen_id]);
                        let pais_destino = await pool.query('SELECT pais_nombre FROM pais WHERE pais_id = ?', [controles[i].control_expedicion_pais_destino_id]);
                        let tecnico = await pool.query('SELECT usuario_nombre FROM usuario WHERE usuario_id = ?', [controles[i].control_tecnico_id]);
                        let cliente = await pool.query('SELECT cliente_nombre FROM cliente WHERE cliente_id = ?', [controles[i].control_cliente_id]);
                        let familia = await pool.query('SELECT familia_nombre FROM familia WHERE familia_id = ?', [controles[i].control_producto_familia_id]);
                        let valoracion = await pool.query('SELECT valoracion_nombre FROM valoracion WHERE valoracion_id = ?', [controles[i].control_valoracion_id]);
            
            
                        controles[i].control_plataforma_nombre = controles[i].control_plataforma_mod != 'null' ? controles[i].control_plataforma_mod : plataforma[0].plataforma_nombre;
                        controles[i].control_pais_origen_nombre = controles[i].control_expedicion_pais_destino_mod != 'null' ? controles[i].control_expedicion_pais_destino_mod : pais_origen[0].pais_nombre;
                        controles[i].control_pais_destino_nombre = controles[i].control_expedicion_pais_origen_mod != 'null' ? controles[i].control_expedicion_pais_origen_mod : pais_destino[0].pais_nombre;
                        controles[i].control_tecnico_nombre = controles[i].control_tecnico_mod != 'null' ? controles[i].control_tecnico_mod : tecnico[0].usuario_nombre;
                        controles[i].control_cliente_nombre = controles[i].control_cliente_mod != 'null' ? controles[i].control_cliente_mod : cliente[0].cliente_nombre;
                        controles[i].control_producto_familia_nombre = controles[i].control_producto_familia_mod != 'null' ? controles[i].control_producto_familia_mod : familia[0].familia_nombre;
            
                        controles[i].control_valoracion_nombre = valoracion[0].valoracion_nombre;
            
                    }
                }       




                if(clienteSQLS!='null' && query_data_sqls!='' && tecnicoSQLS!='null'){
                    controlesSQLS = await mssql.query(`SELECT
                                                codigo AS control_codigo, 
                                                Fecha_Control AS control_fecha, 
                                                Referencia_Cliente AS control_referencia, 
                                                Plataforma_idGuid AS plataforma_id, 
                                                Pais_Destino_idGuid AS control_expedicion_pais_destino_id,
                                                Pais_Origen_idGuid AS control_expedicion_pais_origen_id,
                                                Numero_Contenedor AS control_expedicion_contenedor,
                                                Tecnico_idGuid AS tecnico_id, 
                                                Cliente_idGuid AS cliente_id, 
                                                Familia_idGuid AS control_producto_familia_id,
                                                Numero_Pallets AS control_packaging_pallets,
                                                
                                                Valoracion_idGuid AS valoracion_id
                                                FROM control WHERE `+query_data_sqls+` finalizado = 1 ORDER BY Fecha_Control DESC`);
                    controlesSQLS = controlesSQLS.recordset;
        
                    for(let i=0; i<controlesSQLS.length; i++){
        
                        if(controlesSQLS[i].plataforma_id){
                            let plataformaSQLS = await mssql.query(`SELECT Nombre FROM PLATAFORMAS WHERE Plataforma_idGuid = '`+controlesSQLS[i].plataforma_id+`'`);
                            controlesSQLS[i].control_plataforma_nombre = plataformaSQLS.rowsAffected[0] != 0 ? plataformaSQLS.recordset[0].Nombre : 'null';
                        }
                        
                        if(controlesSQLS[i].control_expedicion_pais_destino_id){
                            let pais_destinoSQLS = await mssql.query(`SELECT Nombre FROM PAISES WHERE Pais_idGuid = '`+controlesSQLS[i].control_expedicion_pais_destino_id+`'`);
                            controlesSQLS[i].control_pais_destino_nombre = pais_destinoSQLS.rowsAffected[0] != 0 ? pais_destinoSQLS.recordset[0].Nombre : 'null';
                        }
                        
                        if(controlesSQLS[i].control_expedicion_pais_origen_id){
                            let pais_origenSQLS = await mssql.query(`SELECT Nombre FROM PAISES WHERE Pais_idGuid = '`+controlesSQLS[i].control_expedicion_pais_origen_id+`'`);
                            controlesSQLS[i].control_pais_origen_nombre = pais_origenSQLS.rowsAffected[0] != 0 ? pais_origenSQLS.recordset[0].Nombre : 'null';    
                        }
        
                        
                        if(controlesSQLS[i].tecnico_id){
                            let tecnicoSQLS = await mssql.query(`SELECT Nombre FROM USUARIOS WHERE Usuario_idGuid = '`+controlesSQLS[i].tecnico_id+`'`);
                            controlesSQLS[i].control_tecnico_nombre = tecnicoSQLS.rowsAffected[0] != 0 ? tecnicoSQLS.recordset[0].Nombre : 'null';
                        }
        
                        if(controlesSQLS[i].cliente_id){
                            let clienteSQLS = await mssql.query(`SELECT Nombre FROM CLIENTES WHERE Cliente_idGuid = '`+controlesSQLS[i].cliente_id+`'`);
                            controlesSQLS[i].control_cliente_nombre = clienteSQLS.rowsAffected[0] != 0 ? clienteSQLS.recordset[0].Nombre : 'null';
                        }
        
                        if(controlesSQLS[i].control_producto_familia_id){
                            let familiaSQLS = await mssql.query(`SELECT Nombre FROM FAMILIA WHERE Familia_idGuid = '`+controlesSQLS[i].control_producto_familia_id+`'`);
                            controlesSQLS[i].control_producto_familia_nombre = familiaSQLS.rowsAffected[0] != 0 ? familiaSQLS.recordset[0].Nombre : 'null';
                        }
                        
                        
                        if(controlesSQLS[i].valoracion_id){
                            let valoracionSQLS = await mssql.query(`SELECT Nombre FROM VALORACION WHERE Valoracion_idGuid = '`+controlesSQLS[i].valoracion_id+`'`);
                            controlesSQLS[i].control_valoracion_nombre =  valoracionSQLS.rowsAffected[0] != 0 ?valoracionSQLS.recordset[0].Nombre : 'null';
                        }
        
                        if(controlesSQLS[i].control_fecha){
                            let fechaRedateSQLS = await redateSqls(controlesSQLS[i].control_fecha);
                            controlesSQLS[i].control_fecha = fechaRedateSQLS;
                        }
                        
                    }
                }
    
            }

    
            let controles_RETURN = controles.concat(controlesSQLS);
            return {controles: controles_RETURN, user_requested, user_language}
            
        }catch(e){
            console.log(e);
            return false;
        }

        
    },


};

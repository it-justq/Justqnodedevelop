const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');


const {getControlesListMysql} = require(appRoot+'/utils/Control/ControlesMysql/GetControles/UtilGetControlesMysql');
const {getControlesSearchListMysql} = require(appRoot+'/utils/Control/ControlesMysql/GetControles/UtilGetControlesSearchMysql');
const {getControlesFinalizadosListMysql} = require(appRoot+'/utils/Control/ControlesMysql/GetControles/UtilGetControlesFinalizadosMysql');
const {getControlesPendientesListMysql} = require(appRoot+'/utils/Control/ControlesMysql/GetControles/UtilGetControlesPendientesMysql');

const {getControlesListSqls} = require(appRoot+'/utils/Control/ControlesSqls/GetControles/UtilGetControlesSqls');
const {getControlesSearchListSqls} = require(appRoot+'/utils/Control/ControlesSqls/GetControles/UtilGetControlesSearchSqls');
const {getControlesFinalizadosListSqls} = require(appRoot+'/utils/Control/ControlesSqls/GetControles/UtilGetControlesFinalizadosSqls');
const {getControlesPendientesListSqls} = require(appRoot+'/utils/Control/ControlesSqls/GetControles/UtilGetControlesPendientesSqls');


module.exports = {

    async getControles(PARAMS, TYPE, pagina){

        try{

            let clientes = await pool.query('SELECT cliente_id_hash as cliente_id, cliente_nombre FROM cliente ORDER BY cliente_nombre');
            let familias = await pool.query('SELECT familia_id_hash as familia_id, familia_nombre, familia_nombre_en FROM familia ORDER BY familia_nombre');
            let tecnicos = await pool.query('SELECT usuario_id_hash as usuario_id, usuario_nombre FROM justquality_bd.usuario WHERE usuario_rol_id = 1 UNION SELECT usuario_id_hash as usuario_id, usuario_nombre FROM justquality_bd.usuario WHERE usuario_rol_id = 2 ORDER BY usuario_nombre');
            let plataformas = await pool.query('SELECT plataforma_id, plataforma_nombre FROM plataforma ORDER BY plataforma_nombre');
            let controles = [];

            let controles_mysql;
            let controles_sqls;

            if(pagina > 1){
                inicio_pagina = (pagina - 1) * 15;
            }else{
                    inicio_pagina = 0;
            }

            if(PARAMS.data && TYPE === 'search'){
                controles_mysql = await getControlesSearchListMysql(PARAMS);
                controles_sqls = await getControlesSearchListSqls(PARAMS);


            }else if(!PARAMS.data && TYPE === 'total'){
                controles_mysql = await getControlesListMysql(PARAMS, inicio_pagina);
                controles_sqls = await getControlesListSqls(PARAMS, inicio_pagina);

            }else if(!PARAMS.data && TYPE === 'finalizados'){
                controles_mysql = await getControlesFinalizadosListMysql(PARAMS, inicio_pagina);
                controles_sqls = {status:'error'};
                //controles_sqls = await getControlesFinalizadosListSqls(PARAMS, inicio_pagina);

            }else if(!PARAMS.data && TYPE === 'pendientes'){
                controles_mysql = await getControlesPendientesListMysql(PARAMS);
                controles_sqls = {status:'error'};
                //controles_sqls = await getControlesPendientesListSqls(PARAMS, inicio_pagina);

            }

            

                if(controles_mysql.status === 'error'){
                    controles_mysql.status = false;
                }
                if(controles_sqls.status === 'error'){
                    controles_sqls.status = false;
                }

                if(controles_mysql.length_limit || controles_sqls.length_limit){
                    controles.length_limit = true;
                    
                    return controles;
                    
                }else{
                    controles.length_limit = false;
                
                    if(controles_mysql.status === true && controles_sqls.status === true){

                        controles = [...controles_mysql.controles, ...controles_sqls.controles];
                        controles.status = true;

                    }else if(controles_mysql.status === true && controles_sqls.status === false){
                        
                        controles = controles_mysql.controles;
                        controles.status = controles_mysql.status;

                    }else if(controles_mysql.status === false && controles_sqls.status === true){

                        controles = controles_sqls.controles;
                        controles.status = controles_sqls.status;
                    }else{
                        controles.status = false;
                    }
                }


            controles.familias = familias;
            controles.clientes = clientes;
            controles.tecnicos = tecnicos;
            controles.plataformas = plataformas;

            return controles;


        }catch(error){
            return {status:'error', code: 'Error al obtener los controles'};
        }

    }

};
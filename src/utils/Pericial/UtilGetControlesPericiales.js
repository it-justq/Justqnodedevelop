const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');


const {getPericialesList} = require(appRoot+'/utils/Pericial/Periciales/GetPericiales/UtilGetPericialesList');
const {getPericialesSearchList} = require(appRoot+'/utils/Pericial/Periciales/GetPericiales/UtilGetPericialesSearchList');



module.exports = {

    async getPericiales(PARAMS, TYPE){

        try{

            let clientes = await pool.query('SELECT cliente_id_hash as cliente_id, cliente_nombre FROM cliente ORDER BY cliente_nombre');
            let tecnicos = await pool.query('SELECT usuario_id_hash as usuario_id, usuario_nombre FROM justquality_bd.usuario WHERE usuario_rol_id = 1 UNION SELECT usuario_id_hash as usuario_id, usuario_nombre FROM justquality_bd.usuario WHERE usuario_rol_id = 2 ORDER BY usuario_nombre');
            let informes = [];


            if(PARAMS.data && TYPE === 'search'){

                informes = await getPericialesSearchList(PARAMS);


            }else if(!PARAMS.data && TYPE === 'total'){

                informes = await getPericialesList(PARAMS);

            }

            informes.clientes = clientes;
            informes.tecnicos = tecnicos;

            return informes;

        }catch(e){

        }


    }

};
const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');
const {getDate} = require(appRoot+'/utils/Date'); 
const {genHash} = require(appRoot+'/utils/Crypto');
const {escapeData} = require(appRoot+'/utils/ParseData');

module.exports = {

    async getNuevoPericial(PARAMS){

        try{        

            let tipo_control = await pool.query('SELECT informe_tipo_id, informe_tipo_nombre FROM informe_tipo WHERE informe_tipo_estado_id = 1 ORDER BY informe_tipo_nombre ASC');
            let clientes = await pool.query('SELECT cliente_id, cliente_nombre FROM cliente ORDER BY cliente_nombre ASC');

            let data = {tipo_control, clientes};

            return({status: true, data})

        }catch(err){
            return({status: false, data: 'Error al obtener los datos'})
        }
        
    },


    async postNuevoPericial(PARAMS){

        try{

            let tipo_informe = PARAMS.data.tipo_informe;
            let cliente = PARAMS.data.cliente;
            let empresa = PARAMS.data.empresa;
            const tecnico_id = await escapeData(PARAMS.user_id);

            const actual_time = getDate();

            const informe_numeracion = await pool.query('SELECT MAX(informe_numeracion_numero) AS maximo FROM informe_numeracion WHERE informe_numeracion_tipo_informe_id = ?',[tipo_informe]);
            const numeracion = parseInt(informe_numeracion[0].maximo, 10) + 1;
        
            const informe_prefijo = await pool.query('SELECT informe_tipo_prefijo FROM informe_tipo WHERE informe_tipo_id = ?',[tipo_informe]);
        
            const informe_codigo = informe_prefijo[0].informe_tipo_prefijo+"-"+numeracion;


            if(empresa == ""){
                empresa = 'null';
            }

            //GENERA EL INFORME
            await pool.query('INSERT INTO informe_numeracion (informe_numeracion_tipo_informe_id, informe_numeracion_numero) VALUES (?,?)',[tipo_informe, numeracion]);
            let informeInsert = await pool.query('INSERT INTO informe (informe_codigo, informe_tecnico_id, informe_cliente_id, informe_empresa, informe_estado, informe_tipo_id, informe_fecha) VALUES (?,?,?,?,?,?,?)',[informe_codigo, tecnico_id, cliente, empresa, 0, tipo_informe, actual_time]);
            informe_id = informeInsert.insertId;

                //HASH
                let informe_hash = await genHash('informe', informe_id);
                await pool.query('UPDATE informe SET informe_id_hash = ? WHERE informe_id = ?', [informe_hash, informe_id]);


            //PUNTOS DE CONTROL
            const pc = await pool.query('SELECT informe_punto_control_id, informe_punto_control_grupo_control_id, informe_punto_control_tipo_id FROM informe_punto_control WHERE informe_punto_control_tipo_id = 1');

            for(let i = 0; i< pc.length; i++){
                let puntos_control_inserted = await pool.query('INSERT INTO informe_data (informe_data_informe_id, informe_data_punto_control_id, informe_data_grupo_control_id) VALUES (?,?,?)',[informe_id, pc[i].informe_punto_control_id, pc[i].informe_punto_control_grupo_control_id, pc[i].informe_punto_control_grupo_control_id]);      
            
                //HASH
                let punto_control_hash = await genHash('informe_data', puntos_control_inserted.insertId);
                await pool.query('UPDATE informe_data SET informe_data_id_hash = ? WHERE informe_data_id = ?', [punto_control_hash, puntos_control_inserted.insertId]);
            }

            return({status: true, informe_id: informe_hash})

        }catch(e){
            console.log(e)
            return({status: false, data: 'Error al generar el informe'})
        }
 
        
    },

  

};
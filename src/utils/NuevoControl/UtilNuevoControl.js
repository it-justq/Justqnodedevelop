const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');
const {getDate} = require(appRoot+'/utils/Date'); 
const {genHash} = require(appRoot+'/utils/Crypto');
const {escapeData} = require(appRoot+'/utils/ParseData');

module.exports = {

    async getNuevoControl(PARAMS){

        try{        

            let tipo_control = await pool.query('SELECT control_tipo_id, control_tipo_nombre, control_tipo_nombre_en FROM control_tipo WHERE control_tipo_principal = 1 AND control_tipo_estado_id = 1 ORDER BY control_tipo_nombre ASC');
            let subtipo_control = await pool.query('SELECT control_tipo_id, control_tipo_nombre, control_tipo_nombre_en FROM control_tipo WHERE control_tipo_principal != 1 AND control_tipo_estado_id = 1 ORDER BY control_tipo_nombre ASC');
            let clientes = await pool.query('SELECT cliente_id, cliente_nombre FROM cliente ORDER BY cliente_nombre ASC');
            let familias = await pool.query('SELECT familia_id, familia_nombre, familia_nombre_en FROM familia ORDER BY familia_nombre ASC');

            let data = {tipo_control, subtipo_control, clientes, familias};

            return({status: true, data})

        }catch(err){
            return({status: false, data: 'Error al obtener los datos'})
        }
        
    },


    async postNuevoControl(PARAMS){

        try{
            
            const tipo = await escapeData(PARAMS.data.tipo_control);
            const subtipo = await escapeData(PARAMS.data.subtipo_control);
            const cliente = await escapeData(PARAMS.data.cliente);
            const familia = await escapeData(PARAMS.data.familia);
            const tecnico_id = await escapeData(PARAMS.user_id);

            const actual_time = getDate();

            let control_insert_id, control_id;

            const control_numeracion = await pool.query('SELECT MAX(control_numeracion_numero) AS maximo FROM control_numeracion WHERE control_numeracion_tipo_control_id = ?',[tipo]);
            const numeracion = parseInt(control_numeracion[0].maximo, 10) + 1;
        
            const control_prefijo = await pool.query('SELECT control_tipo_prefijo FROM control_tipo WHERE control_tipo_id = ?',[tipo]);
        
            const control_codigo = control_prefijo[0].control_tipo_prefijo+"-"+numeracion;
        


            //GENERA EL CONTROL
            await pool.query('INSERT INTO control_numeracion (control_numeracion_tipo_control_id, control_numeracion_numero) VALUES (?,?)',[tipo, numeracion]);
            let controlInsert = await pool.query('INSERT INTO control (control_codigo, control_tecnico_id, control_cliente_id, control_estado, control_tipo_id, control_subtipo_id, control_producto_familia_id, control_fecha) VALUES (?,?,?,?,?,?,?,?)',[control_codigo, tecnico_id, cliente, 0, tipo, subtipo, familia, actual_time]);
            control_id = controlInsert.insertId;

                //HASH
                let control_hash = await genHash('control', control_id);
                await pool.query('UPDATE control SET control_id_hash = ? WHERE control_id = ?', [control_hash, control_id]);
           



            //PRECARGA
            if(tipo === '1'){
                //GRUPOS DE CONTROL PRECARGA
                const gc_precarga = await pool.query('SELECT grupo_control_id, grupo_control_tipo_id, grupo_control_nombre, grupo_control_nombre_en FROM grupo_control WHERE grupo_control_tipo_id = 1');
                
                for(let i = 0; i< gc_precarga.length; i++){
                    let control_grupo_control_inserted = await pool.query('INSERT INTO control_grupo_control (control_grupo_control_tipo_control_id, control_grupo_control_grupo_control_id, control_grupo_control_control_codigo, control_grupo_control_control_id) VALUES (?,?,?,?)',[gc_precarga[i].grupo_control_tipo_id, gc_precarga[i].grupo_control_id, control_codigo, control_id]);
                    
                    //HASH
                    let control_grupo_control_hash = await genHash('control_grupo_control', control_grupo_control_inserted.insertId);
                    await pool.query('UPDATE control_grupo_control SET control_grupo_control_id_hash = ? WHERE control_grupo_control_id = ?', [control_grupo_control_hash, control_grupo_control_inserted.insertId]);
                }
        

                //PUNTOS DE CONTROL PRECARGA
                const pc_precarga = await pool.query('SELECT punto_control_id, punto_control_grupo_control_id, punto_control_tipo_id, punto_control_nombre, punto_control_nombre_en FROM punto_control WHERE punto_control_tipo_id = 1');

                for(let i = 0; i< pc_precarga.length; i++){
                    let control_punto_control_inserted = await pool.query('INSERT INTO control_punto_control (control_punto_control_tipo_control_id, control_punto_control_punto_control_id, control_punto_control_grupo_control_id, control_punto_control_control_codigo, control_punto_control_control_id) VALUES (?,?,?,?,?)',[pc_precarga[i].punto_control_tipo_id, pc_precarga[i].punto_control_id, pc_precarga[i].punto_control_grupo_control_id, control_codigo, control_id]);
                    
                    //HASH
                    let control_punto_control_hash = await genHash('control_punto_control', control_punto_control_inserted.insertId);
                    await pool.query('UPDATE control_punto_control SET control_punto_control_id_hash = ? WHERE control_punto_control_id = ?', [control_punto_control_hash, control_punto_control_inserted.insertId]);


                    //AGRUPACIONES DE LOS PUNTOS DE CONTROL PRECARGA
                    let pc_agr_precarga = await pool.query('SELECT punto_control_agrupacion_id FROM punto_control_agrupacion WHERE punto_control_agrupacion_punto_control_id = ?',[pc_precarga[i].punto_control_id]);
                        for(x=0; x<pc_agr_precarga.length; x++){
                            let control_punto_control_agrupacion_inserted = await pool.query('INSERT INTO control_punto_control_agrupacion (control_punto_control_agrupacion_control_codigo, control_punto_control_agrupacion_control_id, control_punto_control_agrupacion_punto_control_id, control_punto_control_agrupacion_grupo_control_id, control_punto_control_agrupacion_agrupacion_id) VALUES (?,?,?,?,?) ',[control_codigo, control_id, pc_precarga[i].punto_control_id, pc_precarga[i].punto_control_grupo_control_id, pc_agr_precarga[x].punto_control_agrupacion_id ]);
                        
                            //HASH
                            let control_punto_control_agrupacion_hash = await genHash('control_punto_control_agrupacion', control_punto_control_agrupacion_inserted.insertId);
                            await pool.query('UPDATE control_punto_control_agrupacion SET control_punto_control_agrupacion_id_hash = ? WHERE control_punto_control_agrupacion_id = ?', [control_punto_control_agrupacion_hash, control_punto_control_agrupacion_inserted.insertId]);
                        }
                }
            }
            




            //GRUPOS DE CONTROL
            const gc = await pool.query('SELECT grupo_control_id, grupo_control_tipo_id, grupo_control_nombre, grupo_control_nombre_en FROM grupo_control WHERE grupo_control_tipo_id = ?',[subtipo]);
            for(let i = 0; i< gc.length; i++){
                let control_grupos_control_inserted = await pool.query('INSERT INTO control_grupo_control (control_grupo_control_tipo_control_id, control_grupo_control_grupo_control_id, control_grupo_control_control_codigo, control_grupo_control_control_id) VALUES (?,?,?,?)',[gc[i].grupo_control_tipo_id, gc[i].grupo_control_id, control_codigo, control_id]);
            
                //HASH
                let control_grupos_control_hash = await genHash('control_grupo_control', control_grupos_control_inserted.insertId);
                await pool.query('UPDATE control_grupo_control SET control_grupo_control_id_hash = ? WHERE control_grupo_control_id = ?', [control_grupos_control_hash, control_grupos_control_inserted.insertId]);
            }





            //PUNTOS DE CONTROL
            const pc = await pool.query('SELECT punto_control_id, punto_control_grupo_control_id, punto_control_tipo_id, punto_control_nombre, punto_control_nombre_en, punto_control_tipo_dato_id FROM punto_control WHERE punto_control_tipo_id = ?',[subtipo]);
            for(let i = 0; i< pc.length; i++){
                let control_puntos_control_inserted = await pool.query('INSERT INTO control_punto_control (control_punto_control_tipo_control_id, control_punto_control_punto_control_id, control_punto_control_grupo_control_id, control_punto_control_control_codigo, control_punto_control_control_id, control_punto_control_tipo_dato_id) VALUES (?,?,?,?,?,?)',[pc[i].punto_control_tipo_id, pc[i].punto_control_id, pc[i].punto_control_grupo_control_id, control_codigo, control_id, pc[i].punto_control_tipo_dato_id]);      
            
                //HASH
                let control_puntos_control_hash = await genHash('control_punto_control', control_puntos_control_inserted.insertId);
                await pool.query('UPDATE control_punto_control SET control_punto_control_id_hash = ? WHERE control_punto_control_id = ?', [control_puntos_control_hash, control_puntos_control_inserted.insertId]);
            }


            return({status: true, control_id: control_hash})

        }catch(err){
            console.log(err)
            return({status: false, data: 'Error al generar el control'})
        }
        
    },

  

};
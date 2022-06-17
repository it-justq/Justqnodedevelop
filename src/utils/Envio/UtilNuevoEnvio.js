const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');
//const {getDate} = require(appRoot+'/utils/Date'); 
const {genHash} = require(appRoot+'/utils/Crypto');
const {escapeData} = require(appRoot+'/utils/ParseData');


module.exports = {

    async postNuevoEnvio(PARAMS){

        try{
            const transporte_ref = await escapeData(PARAMS.data.transporte_referencia);
            const pedido_ref = await escapeData(PARAMS.data.pedido_referencia);
            const carga_fecha = PARAMS.data.carga_fecha;
            const carga_transporte_fecha = PARAMS.data.carga_transporte_fecha;
            const tipo_transporte = await escapeData(PARAMS.data.tipo_transporte);
            const almacen = await escapeData(PARAMS.data.carga_almacen);
            const proveedor = await escapeData(PARAMS.data.proveedor);
            const provincia = await escapeData(PARAMS.data.provincia);
            const producto_id = await escapeData(PARAMS.data.producto);
            const contacto_nombre = await escapeData(PARAMS.data.contacto_nombre);
            const contacto_tlf = await escapeData(PARAMS.data.contacto_telefono);
            const consignatario = await escapeData(PARAMS.data.consignatario);
            const termografo_id = await escapeData(PARAMS.data.termografo_id);
            const origen_id = await escapeData(PARAMS.data.origen_id);
            const destino_id = await escapeData(PARAMS.data.destino_id);
            const eta = PARAMS.data.eta;
            const pol = await escapeData(PARAMS.data.pol);
            const pod = await escapeData(PARAMS.data.pod);
            const etd = PARAMS.data.etd;
            const pallets = await escapeData(PARAMS.data.pallets);
            const contenedor = await escapeData(PARAMS.data.contenedor);
            const naviera = await escapeData(PARAMS.data.naviera);
            const vessel = await escapeData(PARAMS.data.vessel);
            const bl = await escapeData(PARAMS.data.bl);
            const matricula = await escapeData(PARAMS.data.matricula);
            const transportista = await escapeData(PARAMS.data.transportista);
            const vuelo = await escapeData(PARAMS.data.vuelo);
            const awb = await escapeData(PARAMS.data.awb);
            const precarga = await escapeData(PARAMS.data.precarga);
      
            const usuario_id = await escapeData(PARAMS.user_id);

            let cliente_id = await pool.query('SELECT cliente_id FROM cliente WHERE cliente_usuario_id = ?', usuario_id);
            cliente_id = cliente_id[0].cliente_id;
            let rows = await pool.query('SELECT envio_id FROM envio WHERE envio_cliente_id = ? AND envio_pedido_referencia = ?', [cliente_id, pedido_ref]);
            console.log("rows"+rows.length);
            if(rows.length<1){
                await pool.query(`INSERT INTO envio (
                                           envio_transporte_referencia,
                                           envio_pedido_referencia,
                                           envio_cliente_id,
                                           envio_tipo_transporte_id,
                                           envio_proveedor,
                                           envio_estado_id,
                                           envio_termografo_id,
                                           envio_carga_fecha,
                                           envio_carga_almacen,
                                           envio_carga_provincia,
                                           envio_pais_origen_id,
                                           envio_producto,
                                           envio_contacto_nombre,
                                           envio_contacto_telefono,      
                                           envio_carga_transporte_fecha,                                    
                                           envio_consignatario,
                                           envio_pais_destino_id,
                                           envio_eta,
                                           envio_etd,
                                           envio_pol,
                                           envio_pod,
                                           envio_pallets,
                                           envio_contenedor,
                                           envio_naviera,
                                           envio_vessel,
                                           envio_bl,
                                           envio_matricula,
                                           envio_transportista,
                                           envio_vuelo,
                                           envio_awb,
                                           envio_inspeccion_precarga
                                           ) 
                                           
                            VALUES(
                                           ? , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
                                           )`,
                                           [transporte_ref,
                                           pedido_ref,
                                           cliente_id,
                                           tipo_transporte,
                                           proveedor,
                                           '2',
                                           termografo_id,
                                           carga_fecha,
                                           almacen,
                                           provincia,
                                           origen_id,
                                           producto_id,
                                           contacto_nombre,
                                           contacto_tlf,
                                           carga_transporte_fecha,
                                           consignatario,
                                           destino_id,
                                           eta,
                                           etd,
                                           pol,
                                           pod,
                                           pallets,
                                           contenedor,
                                           naviera,
                                           vessel,
                                           bl,
                                           matricula,
                                           transportista,
                                           vuelo,
                                           awb,
                                           precarga]
                                           );
            
                let envio_id = await pool.query('SELECT envio_id FROM envio WHERE envio_cliente_id = ? AND envio_pedido_referencia = ?', [cliente_id, pedido_ref]);
                envio_id = envio_id[0].envio_id;
                let envio_id_hash = await genHash('envio', envio_id);
                
                await pool.query('UPDATE envio SET envio_id_hash = ? WHERE envio_id = ?', [envio_id_hash, envio_id]);

                if(precarga == 1){
                console.log("dentro de precarga=1");
                   const control_numeracion = await pool.query('SELECT MAX(control_numeracion_numero) AS maximo FROM control_numeracion WHERE control_numeracion_tipo_control_id = 1');
                   const numeracion = parseInt(control_numeracion[0].maximo, 10) + 1;
                   const control_codigo = "PRE-"+numeracion;
                   console.log("codigo: "+control_codigo);
                   
                   //GENERA EL CONTROL
                   await pool.query('INSERT INTO control_numeracion (control_numeracion_tipo_control_id, control_numeracion_numero) VALUES (?,?)',['1', numeracion]);


                    let controlInsert = await pool.query(`INSERT INTO control (
                        control_codigo,
                        control_envio_id,
                        control_tecnico_id,
                        control_cliente_id,
                        control_plataforma_mod,
                        control_expedicion_fecha_salida,
                        control_expedicion_contenedor,
                        control_expedicion_pais_origen_id,
                        control_expedicion_pais_destino_id,
                        control_producto_familia_id,
                        control_tipo_id
                        )
                VALUES
                        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        [control_codigo,
                        envio_id_hash,
                        112,
                        cliente_id,
                        almacen,
                        carga_fecha,
                        contenedor,
                        origen_id,
                        destino_id,
                        producto_id,
                        1]);

                    control_id = controlInsert.insertId;
                    let control_id_hash = await genHash('control', control_id);
                    
                    await pool.query('UPDATE control SET control_id_hash = ? WHERE control_id = ?', [control_id_hash, control_id]);

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

                    //GRUPOS DE CONTROL
                        const gc = await pool.query('SELECT grupo_control_id, grupo_control_tipo_id, grupo_control_nombre, grupo_control_nombre_en FROM grupo_control WHERE grupo_control_tipo_id = 5');
                        for(let i = 0; i< gc.length; i++){
                            let control_grupos_control_inserted = await pool.query('INSERT INTO control_grupo_control (control_grupo_control_tipo_control_id, control_grupo_control_grupo_control_id, control_grupo_control_control_codigo, control_grupo_control_control_id) VALUES (?,?,?,?)',[gc[i].grupo_control_tipo_id, gc[i].grupo_control_id, control_codigo, control_id]);
                        
                            //HASH
                            let control_grupos_control_hash = await genHash('control_grupo_control', control_grupos_control_inserted.insertId);
                            await pool.query('UPDATE control_grupo_control SET control_grupo_control_id_hash = ? WHERE control_grupo_control_id = ?', [control_grupos_control_hash, control_grupos_control_inserted.insertId]);
                        }

                    //PUNTOS DE CONTROL
                        const pc = await pool.query('SELECT punto_control_id, punto_control_grupo_control_id, punto_control_tipo_id, punto_control_nombre, punto_control_nombre_en, punto_control_tipo_dato_id FROM punto_control WHERE punto_control_tipo_id = 5');
                        for(let i = 0; i< pc.length; i++){
                            let control_puntos_control_inserted = await pool.query('INSERT INTO control_punto_control (control_punto_control_tipo_control_id, control_punto_control_punto_control_id, control_punto_control_grupo_control_id, control_punto_control_control_codigo, control_punto_control_control_id, control_punto_control_tipo_dato_id) VALUES (?,?,?,?,?,?)',[pc[i].punto_control_tipo_id, pc[i].punto_control_id, pc[i].punto_control_grupo_control_id, control_codigo, control_id, pc[i].punto_control_tipo_dato_id]);      
                        
                            //HASH
                            let control_puntos_control_hash = await genHash('control_punto_control', control_puntos_control_inserted.insertId);
                            await pool.query('UPDATE control_punto_control SET control_punto_control_id_hash = ? WHERE control_punto_control_id = ?', [control_puntos_control_hash, control_puntos_control_inserted.insertId]);
                        }

                        await pool.query('UPDATE envio SET envio_control_precarga_id = ? WHERE envio_id = ?', [control_id, envio_id]);

    
                }
                return({status: true});
            }else{
                return({status: false})
            }

        }catch(e){
            console.log("Error en util postNuevoEnvio"+e);
        }
    }

   
};
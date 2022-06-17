const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');
const {genHash} = require(appRoot+'/utils/Crypto');

module.exports = {

    async GenPrecarga(control_plantilla_id, control_id, precarga_activa){

        try{

            let pre_gc_plant_data = await pool.query("SELECT * FROM control_grupo_control WHERE control_grupo_control_control_id = ? AND control_grupo_control_tipo_control_id = ?", [control_plantilla_id, 1]);
            let pre_pc_plant_data = await pool.query("SELECT * FROM control_punto_control WHERE control_punto_control_control_id = ? AND control_punto_control_tipo_control_id = ?", [control_plantilla_id, 1]);
            let pre_pc_agr_plant_data = await pool.query("SELECT * FROM control_punto_control_agrupacion WHERE control_punto_control_agrupacion_control_id = ?", [control_plantilla_id]);

            if(precarga_activa == 1){

                //GC PRECARGA
                for(let i = 0; i < pre_gc_plant_data.length; i ++){
                    let gc = await pool.query(`INSERT INTO control_grupo_control (
                    control_grupo_control_tipo_control_id, 
                    control_grupo_control_grupo_control_id, 
                    control_grupo_control_control_id, 
                    control_grupo_control_valor, 
                    control_grupo_control_valoracion_id
                    ) VALUES (?,?,?,?,?)`, [
                    pre_gc_plant_data[i].control_grupo_control_tipo_control_id,
                    pre_gc_plant_data[i].control_grupo_control_grupo_control_id,
                    control_id,
                    pre_gc_plant_data[i].control_grupo_control_valor, 
                    pre_gc_plant_data[i].control_grupo_control_valoracion_id
                    ]);

                    let gc_hash = await genHash('control_grupo_control', gc.insertId);
                    await pool.query('UPDATE control_grupo_control SET control_grupo_control_id_hash = ? WHERE control_grupo_control_id = ? AND control_grupo_control_control_id = ?', [gc_hash, gc.insertId, control_id]);

                } 

                //PC
                for(let i = 0; i < pre_pc_plant_data.length; i ++){
                    let pc = await pool.query(`INSERT INTO control_punto_control (
                    control_punto_control_tipo_control_id,
                    control_punto_control_punto_control_id,
                    control_punto_control_grupo_control_id,
                    control_punto_control_control_id,
                    control_punto_control_valor,
                    control_punto_control_valor_en,
                    control_punto_control_tipo_dato_id,
                    control_punto_control_agrupacion_id,
                    control_punto_control_valoracion_id
                    ) VALUES (?,?,?,?,?,?,?,?,?)`, [
                    pre_pc_plant_data[i].control_punto_control_tipo_control_id,
                    pre_pc_plant_data[i].control_punto_control_punto_control_id,
                    pre_pc_plant_data[i].control_punto_control_grupo_control_id,
                    control_id,
                    pre_pc_plant_data[i].control_punto_control_valor,
                    pre_pc_plant_data[i].control_punto_control_valor_en,
                    pre_pc_plant_data[i].control_punto_control_tipo_dato_id,
                    pre_pc_plant_data[i].control_punto_control_agrupacion_id,
                    pre_pc_plant_data[i].control_punto_control_valoracion_id
                    ]);
                    
                    let pc_hash = await genHash('control_punto_control', pc.insertId);
                    await pool.query('UPDATE control_punto_control SET control_punto_control_id_hash = ? WHERE control_punto_control_id = ? AND control_punto_control_control_id = ?', [pc_hash, pc.insertId, control_id]);
                
                }

                //PC AGRUPACION
                for(let i = 0; i < pre_pc_agr_plant_data.length; i ++){
                    let pc_ag = await pool.query(`INSERT INTO control_punto_control_agrupacion (
                    control_punto_control_agrupacion_control_id,
                    control_punto_control_agrupacion_punto_control_id,
                    control_punto_control_agrupacion_grupo_control_id,
                    control_punto_control_agrupacion_agrupacion_id,
                    control_punto_control_agrupacion_valor,
                    control_punto_control_agrupacion_valor_en
                    ) VALUES (?,?,?,?,?,?)`, [
                    control_id,
                    pre_pc_agr_plant_data[i].control_punto_control_agrupacion_punto_control_id,
                    pre_pc_agr_plant_data[i].control_punto_control_agrupacion_grupo_control_id,
                    pre_pc_agr_plant_data[i].control_punto_control_agrupacion_agrupacion_id,
                    pre_pc_agr_plant_data[i].control_punto_control_agrupacion_valor,
                    pre_pc_agr_plant_data[i].control_punto_control_agrupacion_valor_en
                    ]);            
                    
                    let pc_ag_hash = await genHash('control_punto_control_agrupacion', pc_ag.insertId);
                    await pool.query('UPDATE control_punto_control_agrupacion SET control_punto_control_agrupacion_id_hash = ? WHERE control_punto_control_agrupacion_id = ? AND control_punto_control_agrupacion_control_id = ?', [pc_ag_hash, pc_ag.insertId, control_id]);
                
                }

            }else if(precarga_activa == 0){

                //GC PRECARGA
                for(let i = 0; i < pre_gc_plant_data.length; i ++){
                    let gc = await pool.query(`INSERT INTO control_grupo_control (
                    control_grupo_control_tipo_control_id, 
                    control_grupo_control_grupo_control_id, 
                    control_grupo_control_control_id
                    ) VALUES (?,?,?)`, [
                    pre_gc_plant_data[i].control_grupo_control_tipo_control_id,
                    pre_gc_plant_data[i].control_grupo_control_grupo_control_id,
                    control_id
                    ]);

                    let gc_hash = await genHash('control_grupo_control', gc.insertId);
                    await pool.query('UPDATE control_grupo_control SET control_grupo_control_id_hash = ? WHERE control_grupo_control_id = ? AND control_grupo_control_control_id = ?', [gc_hash, gc.insertId, control_id]);

                }

                //PC PRECARGA
                for(let i = 0; i < pre_pc_plant_data.length; i ++){
                    let pc = await pool.query(`INSERT INTO control_punto_control (
                    control_punto_control_tipo_control_id,
                    control_punto_control_punto_control_id,
                    control_punto_control_grupo_control_id,
                    control_punto_control_control_id,
                    control_punto_control_tipo_dato_id
                    ) VALUES (?,?,?,?,?)`, [
                    pre_pc_plant_data[i].control_punto_control_tipo_control_id,
                    pre_pc_plant_data[i].control_punto_control_punto_control_id,
                    pre_pc_plant_data[i].control_punto_control_grupo_control_id,
                    control_id,
                    pre_pc_plant_data[i].control_punto_control_tipo_dato_id
                    ]);

                    let pc_hash = await genHash('control_punto_control', pc.insertId);
                    await pool.query('UPDATE control_punto_control SET control_punto_control_id_hash = ? WHERE control_punto_control_id = ? AND control_punto_control_control_id = ?', [pc_hash, pc.insertId, control_id]);
                }

                //PC AGRUPACION
                for(let i = 0; i < pre_pc_agr_plant_data.length; i ++){
                    let pc_ag = await pool.query(`INSERT INTO control_punto_control_agrupacion (
                    control_punto_control_agrupacion_control_id,
                    control_punto_control_agrupacion_punto_control_id,
                    control_punto_control_agrupacion_grupo_control_id,
                    control_punto_control_agrupacion_agrupacion_id
                    ) VALUES (?,?,?,?)`, [
                    control_id,
                    pre_pc_agr_plant_data[i].control_punto_control_agrupacion_punto_control_id,
                    pre_pc_agr_plant_data[i].control_punto_control_agrupacion_grupo_control_id,
                    pre_pc_agr_plant_data[i].control_punto_control_agrupacion_agrupacion_id
                    ]); 
                    
                    let pc_ag_hash = await genHash('control_punto_control_agrupacion', pc_ag.insertId);
                    await pool.query('UPDATE control_punto_control_agrupacion SET control_punto_control_agrupacion_id_hash = ? WHERE control_punto_control_agrupacion_id = ? AND control_punto_control_agrupacion_control_id = ?', [pc_ag_hash, pc_ag.insertId, control_id]);
                
                }

            }


            return {status: 'ok'};

        }catch(error){
            console.log(error)
            return {status: 'error'};
        }
    },

    async DelPrecarga(control_id){

        try{


            return {status: 'ok'};

        }catch(error){
            return {status: 'error'};
        }
    },
}
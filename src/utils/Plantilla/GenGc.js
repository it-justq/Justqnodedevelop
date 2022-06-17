const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');
const {genHash} = require(appRoot+'/utils/Crypto');

module.exports = {

    async GenGc(control_plantilla_id, control_id, gc_activos){

        try{

            
            let gc_plant_data = await pool.query("SELECT * FROM control_grupo_control WHERE control_grupo_control_control_id = ? AND control_grupo_control_tipo_control_id != ?", [control_plantilla_id, 1]);
            let pc_plant_data = await pool.query("SELECT * FROM control_punto_control WHERE control_punto_control_control_id = ? AND control_punto_control_tipo_control_id != ?", [control_plantilla_id, 1]);
            let pc_add_plant_data = await pool.query("SELECT * FROM control_punto_control_añadidos WHERE control_punto_control_añadidos_control_id = ?", [control_plantilla_id]);
            let pc_img_plant_data = await pool.query("SELECT * FROM foto_punto_control WHERE foto_punto_control_control_id = ? AND foto_punto_control_punto_control_id = ?", [control_plantilla_id, control_plantilla_id]);
            let pc_img_add_plant_data = await pool.query("SELECT * FROM foto_punto_control_añadido WHERE foto_punto_control_añadido_control_id = ?", [control_plantilla_id]);

            if(gc_activos === 1){

                //GC
                for(let i = 0; i<gc_plant_data.length; i ++){
                    let gc = await pool.query(`INSERT INTO control_grupo_control (
                    control_grupo_control_tipo_control_id, 
                    control_grupo_control_grupo_control_id, 
                    control_grupo_control_control_id, 
                    control_grupo_control_valor, 
                    control_grupo_control_valoracion_id
                    ) VALUES (?,?,?,?,?)`, [
                    gc_plant_data[i].control_grupo_control_tipo_control_id,
                    gc_plant_data[i].control_grupo_control_grupo_control_id,
                    control_id,
                    gc_plant_data[i].control_grupo_control_valor, 
                    gc_plant_data[i].control_grupo_control_valoracion_id
                    ]);

                    let gc_hash = await genHash('control_grupo_control', gc.insertId);
                    await pool.query('UPDATE control_grupo_control SET control_grupo_control_id_hash = ? WHERE control_grupo_control_id = ? AND control_grupo_control_control_id = ?', [gc_hash, gc.insertId, control_id]);
                } 

                //PC
                for(let i = 0; i < pc_plant_data.length; i ++){
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
                    pc_plant_data[i].control_punto_control_tipo_control_id,
                    pc_plant_data[i].control_punto_control_punto_control_id,
                    pc_plant_data[i].control_punto_control_grupo_control_id,
                    control_id,
                    pc_plant_data[i].control_punto_control_valor,
                    pc_plant_data[i].control_punto_control_valor_en,
                    pc_plant_data[i].control_punto_control_tipo_dato_id,
                    pc_plant_data[i].control_punto_control_agrupacion_id,
                    pc_plant_data[i].control_punto_control_valoracion_id
                    ]); 
                    
                    let pc_hash = await genHash('control_punto_control', pc.insertId);
                    await pool.query('UPDATE control_punto_control SET control_punto_control_id_hash = ? WHERE control_punto_control_id = ? AND control_punto_control_control_id = ?', [pc_hash, pc.insertId, control_id]);
                }


                //PC ADD
                for(let i = 0; i < pc_add_plant_data.length; i ++){
                    let pc_add = await pool.query(`INSERT INTO control_punto_control_añadidos (
                    control_punto_control_añadidos_control_id,
                    control_punto_control_añadidos_grupo_control_id,
                    control_punto_control_añadidos_valoracion_id,
                    control_punto_control_añadidos_orden,
                    control_punto_control_añadidos_nombre,
                    control_punto_control_añadidos_nombre_en,
                    control_punto_control_añadidos_valor,
                    control_punto_control_añadidos_valor_en
                    ) VALUES (?,?,?,?,?,?,?,?)`, [
                    control_id,
                    pc_add_plant_data[i].control_punto_control_añadidos_grupo_control_id,
                    pc_add_plant_data[i].control_punto_control_añadidos_valoracion_id,
                    pc_add_plant_data[i].control_punto_control_añadidos_orden,
                    pc_add_plant_data[i].control_punto_control_añadidos_nombre,
                    pc_add_plant_data[i].control_punto_control_añadidos_nombre_en,
                    pc_add_plant_data[i].control_punto_control_añadidos_valor,
                    pc_add_plant_data[i].control_punto_control_añadidos_valor_en
                    ]);    
                    
                    let pc_add_hash = await genHash('control_punto_control_agrupacion', pc_add.insertId);
                    await pool.query('UPDATE control_punto_control_añadidos SET control_punto_control_añadidos_id_hash = ? WHERE control_punto_control_añadidos_id = ? AND control_punto_control_añadidos_control_id = ?', [pc_add_hash, pc_add.insertId, control_id]);
                }


            }else if(gc_activos === 0){

                //GC
                for(let i = 0; i < gc_plant_data.length; i ++){
                    let gc = await pool.query(`INSERT INTO control_grupo_control (
                    control_grupo_control_tipo_control_id, 
                    control_grupo_control_grupo_control_id, 
                    control_grupo_control_control_id
                    ) VALUES (?,?,?)`, [
                    gc_plant_data[i].control_grupo_control_tipo_control_id,
                    gc_plant_data[i].control_grupo_control_grupo_control_id,
                    control_id
                    ]);

                    let gc_hash = await genHash('control_grupo_control', gc.insertId);
                    await pool.query('UPDATE control_grupo_control SET control_grupo_control_id_hash = ? WHERE control_grupo_control_id = ? AND control_grupo_control_control_id = ?', [gc_hash, gc.insertId, control_id]);

                }


                //PC
                for(let i = 0; i < pc_plant_data.length; i ++){
                    let pc = await pool.query(`INSERT INTO control_punto_control (
                    control_punto_control_tipo_control_id,
                    control_punto_control_punto_control_id,
                    control_punto_control_grupo_control_id,
                    control_punto_control_control_id,
                    control_punto_control_tipo_dato_id
                    ) VALUES (?,?,?,?,?)`, [
                    pc_plant_data[i].control_punto_control_tipo_control_id,
                    pc_plant_data[i].control_punto_control_punto_control_id,
                    pc_plant_data[i].control_punto_control_grupo_control_id,
                    control_id,
                    pc_plant_data[i].control_punto_control_tipo_dato_id
                    ]);

                    let pc_hash = await genHash('control_punto_control', pc.insertId);
                    await pool.query('UPDATE control_punto_control SET control_punto_control_id_hash = ? WHERE control_punto_control_id = ? AND control_punto_control_control_id = ?', [pc_hash, pc.insertId, control_id]);
                }

            }


            return {status: 'ok'};

        }catch(error){
            console.log(error)
            return {status: 'error'};
        }
    },

    async DelGc(control_id){

        try{


            return {status: 'ok'};

        }catch(error){
            return {status: 'error'};
        }
    },

}
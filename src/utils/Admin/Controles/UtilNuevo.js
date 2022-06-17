const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');
const {genHash} = require(appRoot+'/utils/Crypto');

module.exports = {

    async postControlTipoNuevo(DATA){
        try{
            let tipo_control_nombre = DATA.data.tipo_control;
            let tipo_control_nombre_en = DATA.data.tipo_control_en;
            let tipo_control_prefijo = DATA.data.tipo_control_prefijo;

            /*console.log("---------------------");
            console.log("Nuevo tipo de control: (es) " + tipo_control_nombre + " (es) " + tipo_control_nombre_en);
            console.log("Prefijo: " + tipo_control_prefijo);
            console.log("---------------------");*/

            let tipo_control_valid = await pool.query('SELECT COUNT(*) AS total FROM control_tipo WHERE control_tipo_nombre = ?', [tipo_control_nombre]);
            tipo_control_valid = tipo_control_valid[0].total;
            if(!tipo_control_valid){
                let consulta_tipo_control = await pool.query(`INSERT INTO control_tipo (
                                                control_tipo_nombre, 
                                                control_tipo_nombre_en, 
                                                control_tipo_estado_id,
                                                control_tipo_prefijo
                                                ) 
                                                VALUES
                                                (?, ?, 1, ?)`, 
                                                [
                                                    tipo_control_nombre, 
                                                    tipo_control_nombre_en,
                                                    tipo_control_prefijo
                                                ]);
                let tipo_control_insertId = consulta_tipo_control.insertId;
                //let tipo_control_id_hash = await genHash('control_tipo', tipo_control_insertId);
                //await pool.query('UPDATE control_tipo SET control_tipo_id_hash = ? WHERE control_tipo_id = ? AND control_tipo_nombre = ? ', [tipo_control_id_hash, tipo_control_insertId, tipo_control_nombre]);

                return{status: 'ok', tipo_control_id: tipo_control_insertId};

            }else{
                console.log("------> ERROR: El tipo de control ya existe");
                return{status: 'error', code: 'El tipo de control ya existe'};
            }

        }catch(error){
            console.log("------> ERROR: " + error.code);
            return {status:'error', code: error.code};
        }
    },


};
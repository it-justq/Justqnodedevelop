const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');
const {genHash} = require(appRoot+'/utils/Crypto');
const {escapeDataSlashes} = require(appRoot+'/utils/ParseData');


module.exports = {

    async getControlData(id){

        try{

            let data = await pool.query('SELECT * FROM control_tipo WHERE control_tipo_id = ?', parseInt(id));
            data = data[0];
            data.grupos_control = await pool.query('SELECT grupo_control_id, grupo_control_nombre, grupo_control_nombre_en, grupo_control_tipo_id FROM grupo_control WHERE grupo_control_tipo_id = ? ORDER BY grupo_control_nombre ASC', parseInt(id));

            for(let i = 0; i < data.grupos_control.length; i ++){

                data.grupos_control[i].puntos_control = await pool.query('SELECT punto_control_id, punto_control_nombre, punto_control_nombre_en, punto_control_tipo_id FROM punto_control WHERE punto_control_tipo_id = ? AND punto_control_grupo_control_id = ? ORDER BY punto_control_nombre ASC', [parseInt(id), data.grupos_control[i].grupo_control_id]);

            }

            return {status: 'ok', data}

        }catch(error){

            return {status: 'error', code: error.code}

        }
    },

    async postControlTipo(VALUES){

        let tipo_control_id = VALUES.data.tipo_control_id;
        let nombre = await escapeDataSlashes(VALUES.data.tipo_control_es);
        let nombre_en = await escapeDataSlashes(VALUES.data.tipo_control_en);
        let estado = await escapeDataSlashes(VALUES.data.estado);

        /*console.log("---------------------------------");
        console.log("Tipo control: " + tipo_control_id + ", estado: " + estado);
        console.log("Nombre: (es) " + nombre + " (en)" + nombre_en);
        console.log("---------------------------------");*/

        try {
            await pool.query("UPDATE control_tipo SET control_tipo_nombre ='"+nombre+"', control_tipo_nombre_en ='"+nombre_en+"', control_tipo_estado_id ='"+estado+"'WHERE control_tipo_id = '" + tipo_control_id + "'");
            return {'status':'ok'};
        } catch (error) {
            return {'status':'error', 'code': 'Error al actualizar los datos'};
        }
    },
    
    async postTipoControlEditar(VALUES){

        let tipo_control_id = VALUES.data.tipoControlId;
        let id = await escapeDataSlashes(VALUES.data.id);
        let value = await escapeDataSlashes(VALUES.data.value);
        let type = await escapeDataSlashes(VALUES.data.type);
        let lan = await escapeDataSlashes(VALUES.data.lan);

        if(value===''){
            value = 'null';
            return {'status':'ok'};
        }
        if(type === 'pc'){
            try {
                switch(lan){
                    case 'es':
                        await pool.query('UPDATE punto_control SET punto_control_nombre = ? WHERE punto_control_id = ? AND punto_control_tipo_id = ?', [value, id, tipo_control_id]);
                        return {'status':'ok'};
                        break;
                    case 'en':
                        await pool.query('UPDATE punto_control SET punto_control_nombre_en = ? WHERE punto_control_id = ? AND punto_control_tipo_id = ?', [value, id, tipo_control_id]);
                        return {'status':'ok'};
                        break;
                }
            } catch (error) {
                return {'status':'error', 'code': 'Error al actualizar los datos'};
            }

        }else if(type === 'gc'){
            try {
                switch(lan){
                    case 'es':
                        await pool.query('UPDATE grupo_control SET grupo_control_nombre = ? WHERE grupo_control_id = ? AND grupo_control_tipo_id = ?', [value, id, tipo_control_id]);
                        return {'status':'ok'};
                        break;
                    case 'en':
                        await pool.query('UPDATE grupo_control SET grupo_control_nombre_en = ? WHERE grupo_control_id = ? AND grupo_control_tipo_id = ?', [value, id, tipo_control_id]);
                        return {'status':'ok'};
                        break;
                }
            } catch (error) {
                return {'status':'error', 'code': 'Error al actualizar los datos'};
            }
        }else{
            return {'status':'error', 'code': 'Error'}; 
        }
    },

    async postGrupoControlNuevo(PARAMS){

        let tipo_control_id = PARAMS.data.tipo_control;
        let nombre_es = PARAMS.data.grupo_control_es;
        let nombre_en = PARAMS.data.grupo_control_en;

        try {
            //let grupo_control_valid = await pool.query('SELECT COUNT(*) AS total FROM grupo_control WHERE grupo_control_nombre = ?', [nombre_es]);
           // grupo_control_valid = grupo_control_valid[0].total;
            //if(!grupo_control_valid){
                let consulta_grupo_control = await pool.query(`INSERT INTO grupo_control (
                                                grupo_control_tipo_id,
                                                grupo_control_nombre, 
                                                grupo_control_nombre_en
                                                ) 
                                                VALUES
                                                (?, ?, ?)`, 
                                                [
                                                    tipo_control_id,
                                                    nombre_es, 
                                                    nombre_en
                                                ]);
                let grupo_control_insertId = consulta_grupo_control.insertId;
                let grupo_control_id_hash = await genHash('grupo_control', grupo_control_insertId);
                await pool.query('UPDATE grupo_control SET grupo_control_id_hash = ? WHERE grupo_control_id = ? AND grupo_control_nombre = ? ', [grupo_control_id_hash, grupo_control_insertId, nombre_es]);
                
                return{status: 'ok', grupo_control_id: grupo_control_insertId};

           // }else{
           //     return{status: 'error', code: 'El grupo de control ya existe'};
           // }
            
        } catch (error) {
            return {'status':'error', 'code': 'Error al crear el grupo de control'};
        }
    },

    async postPuntoControlNuevo(PARAMS){

        let tipo_control_id = PARAMS.data.tipoControlId;
        let grupo_control_id = PARAMS.data.grupoControlId;
        let nombre_es = PARAMS.data.puntoControl;
        let nombre_en = PARAMS.data.puntoControlEn;

        /*console.log("------------------------");
        console.log("Nuevo punto: (es) " + nombre_es + ", (en) " + nombre_en);
        console.log("Tipo control: " + tipo_control_id + " y grupo de control: " + grupo_control_id);
        console.log("------------------------");*/

        try {
           // let punto_control_valid = await pool.query('SELECT COUNT(*) AS total FROM punto_control WHERE punto_control_nombre = ?', [nombre_es]);
            //punto_control_valid = punto_control_valid[0].total;
            //if(!punto_control_valid){
                let consulta_punto_control = await pool.query(`INSERT INTO punto_control (
                                                punto_control_tipo_id,
                                                punto_control_grupo_control_id,
                                                punto_control_nombre, 
                                                punto_control_nombre_en
                                                ) 
                                                VALUES
                                                (?, ?, ?,?)`, 
                                                [
                                                    tipo_control_id,
                                                    grupo_control_id,
                                                    nombre_es, 
                                                    nombre_en
                                                ]);
                let punto_control_insertId = consulta_punto_control.insertId;
                let punto_control_id_hash = await genHash('punto_control', punto_control_insertId);
                await pool.query('UPDATE punto_control SET punto_control_id_hash = ? WHERE punto_control_id = ? AND punto_control_nombre = ? ', [punto_control_id_hash, punto_control_insertId, nombre_es]);
                
                return{status: 'ok', punto_control_id: punto_control_insertId};

            //}else{
            //    return{status: 'error', code: 'El punto de control ya existe'};
            //}
        } catch (error) {
            return {'status':'error', 'code': 'Error al crear el punto de control'};
        }
    },

};
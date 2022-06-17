const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');
const {translateText} = require(appRoot+'/utils/Traductor');
const {escapeDataSlashes} = require(appRoot+'/utils/ParseData');

module.exports = {

    async getInformeDatos(informe_id, informe_hash){

        try{
        //------DATOS DEL CONTROL
                let datos_control = await pool.query('SELECT informe_id_hash, informe_codigo, informe_fecha, informe_tecnico_id, informe_cliente_id, informe_empresa, informe_sref, informe_nref, informe_poliza, informe_asegurado FROM informe WHERE informe_id = ?', [informe_id]);
                
                let cliente_nombre = await pool.query('SELECT cliente_nombre FROM cliente WHERE cliente_id = ?', [datos_control[0].informe_cliente_id]);
                datos_control[0].cliente_nombre = cliente_nombre[0].cliente_nombre;

                let gc = await pool.query('SELECT informe_grupo_control_id, informe_grupo_control_nombre, informe_grupo_control_nombre_en FROM informe_grupo_control WHERE informe_grupo_control_tipo_id = 1 AND informe_grupo_control_id = 0  ORDER BY informe_grupo_control_orden ASC');

                for(let i = 0; i < gc.length; i ++){

                gc[i].puntos_control = await pool.query('SELECT informe_punto_control_id, informe_punto_control_nombre, informe_punto_control_nombre_en FROM informe_punto_control WHERE informe_punto_control_grupo_control_id = ? AND informe_punto_control_tipo_id = 1', [gc[i].informe_grupo_control_id])
                
                for(let x = 0; x < gc[i].puntos_control.length; x++){
                    let values_pc = await pool.query('SELECT informe_data_id, informe_data_punto_control_id, informe_data_id_hash, informe_data_informe_id, informe_data_valor, informe_data_valor_en FROM informe_data WHERE informe_data_informe_id = ? AND informe_data_punto_control_id = ? AND informe_data_grupo_control_id = ?', [informe_id, gc[i].puntos_control[x].informe_punto_control_id, gc[i].informe_grupo_control_id])
                    gc[i].puntos_control[x].value = values_pc[0].informe_data_valor;
                    gc[i].puntos_control[x].informe_data_id_hash = values_pc[0].informe_data_id_hash;
                    gc[i].puntos_control[x].informe_id = informe_hash;
                    gc[i].puntos_control[x].informe_data_punto_control_id = values_pc[0].informe_data_punto_control_id;

                    let total_fotos = await pool.query('SELECT count(*) AS total FROM informe_foto WHERE informe_foto_punto_control_id = ? AND informe_foto_informe_id', [gc[i].informe_punto_control_id, informe_id]);
                    total_fotos = total_fotos[0].total;

                    gc[i].puntos_control[x].total_fotos = total_fotos;
                }

            }

                let util_clientes = await pool.query('SELECT cliente_id, cliente_nombre FROM cliente ORDER BY cliente_nombre ASC');
        
                let result = {status: "ok", datos: datos_control[0], gc, clientes: util_clientes};

                return result;
        }catch(error){
                return {status:'error', code: 'Error al obtener los datos'};
        }
    },

    async postInformeDatos(VALUES){

        try {
                let name = await escapeDataSlashes(VALUES.data.name);
                let informe_id = VALUES.informe_id;
                let value = await escapeDataSlashes(VALUES.data.value);

                let type_mod = name.length;
                
                if(type_mod === 2){
                        let traduccion = await translateText(value,'es','en');
                        await pool.query('UPDATE informe_data SET informe_data_valor = ?, informe_data_valor_en = ? WHERE informe_data_informe_id = ? AND informe_data_punto_control_id = ?', [value, traduccion, informe_id, name]);
                }else{
                        await pool.query('UPDATE informe SET '+name+' = ? WHERE informe_id = ?', [value, informe_id]);
                }

           
                
                
                
                return {'status':'ok'};
        } catch (error) {
                console.log(error)
                return {'status':'error', 'code': 'Error al actualizar los datos'};
        }


    },


};
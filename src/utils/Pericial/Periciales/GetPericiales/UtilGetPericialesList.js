const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');
const {getDate} = require(appRoot+'/utils/Date');

module.exports = {

    async getPericialesList(PARAMS){
        try{
            let usuario_id = PARAMS.usuario_id;
            let rol_id = PARAMS.rol_id;
            let fecha = getDate();
            let informes;
            let return_informes = [];
            

            if(rol_id === 1){
                informes = await pool.query('SELECT informe_id_hash as informe_id, informe_codigo, informe_estado, informe_cliente_id, informe_empresa, informe_sref, informe_nref, informe_fecha FROM informe WHERE informe_fecha = ? ORDER BY informe_fecha', [fecha]);
            }else if(rol_id === 2){
                informes = await pool.query('SELECT informe_id_hash as informe_id, informe_codigo, informe_estado, informe_cliente_id, informe_empresa, informe_sref, informe_nref, informe_fecha FROM informe WHERE informe_fecha = ? informe_tecnico_id = ? ORDER BY informe_fecha', [fecha, usuario_id]);
            }else if(rol_id === 3){
                let cliente_id = await pool.query('SELECT cliente_id FROM cliente WHERE cliente_usuario_id = ?', [usuario_id]);
                cliente_id = cliente_id[0].cliente_id;
                informes = await pool.query('SELECT informe_id_hash as informe_id, informe_codigo, informe_estado, informe_cliente_id, informe_empresa, informe_sref, informe_nref, informe_fecha FROM informe WHERE informe_fecha = ? AND informe_cliente_id = ? AND informe_estado = 1 ORDER BY informe_fecha', [fecha, cliente_id]);
             }else{
                informes = [];
            }
            
            let total_informes = informes.length;

            if(total_informes != 0){
                for(let i = 0; i < total_informes; i ++){

                    switch(informes[i].control_estado){
                        case 0:
                            informes[i].control_estado_nombre = "No activo";
                            break;
                        case 1:
                            informes[i].control_estado_nombre = "Activo";
                            break;
                    }
                    

                    if(informes[i].informe_empresa === 'null' || informes[i].informe_empresa === null){
                        let cliente_nombre = await pool.query('SELECT cliente_nombre FROM cliente WHERE cliente_id = ?', [informes[i].informe_cliente_id]);
                        informes[i].informe_cliente_nombre = cliente_nombre[0].cliente_nombre;
                    }else{
                        informes[i].informe_cliente_nombre = informes[i].informe_empresa;
                    }
                    
                }
                return_informes.informes = informes;
                return_informes.status = true;
            }else{
                return_informes.status = false;
            }
            
            return return_informes;
        
        }catch(error){
            return {status:'error', code: 'Error al obtener los periciales'};
        }

    }

};
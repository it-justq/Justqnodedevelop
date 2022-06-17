const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');


module.exports = {

    async getControlesList(PARAMS, TYPE, LAN){

        try{

            let data;

            switch (TYPE){
                case 'TOTAL':
                    data = await pool.query('SELECT control_tipo_id, control_tipo_nombre, control_tipo_nombre_en, control_tipo_estado_id FROM control_tipo WHERE control_tipo_principal != 1 ORDER BY control_tipo_nombre ASC')
                    break;

                case 'SEARCH':
                    console.log(PARAMS);
                    let control = PARAMS.data.control_tipo_nombre;
                    data = await pool.query("SELECT control_tipo_nombre, control_tipo_nombre_en, control_tipo_id, control_tipo_estado_id FROM control_tipo WHERE control_tipo_nombre LIKE '%"+control+"%' union SELECT control_tipo_nombre, control_tipo_nombre_en, control_tipo_id, control_tipo_estado_id FROM control_tipo WHERE control_tipo_nombre_en LIKE '%"+control+"%'  ORDER BY control_tipo_nombre ASC");
                    break;

                default:
                    break;
            }
            if (LAN == 'en'){
                for(let i = 0; i < data.length; i ++){
                    switch(data[i].control_tipo_estado_id){
                        case 0:
                            data[i].control_tipo_estado_nombre = 'Inactive';
                            break;
                        case 1:
                            data[i].control_tipo_estado_nombre = 'Active';
                            break;
                        default:
                            data[i].control_tipo_estado_nombre = 'Error';
                            break;
                    }
                }
            }else{
                for(let i = 0; i < data.length; i ++){
                    switch(data[i].control_tipo_estado_id){
                        case 0:
                            data[i].control_tipo_estado_nombre = 'No activa';
                            break;
                        case 1:
                            data[i].control_tipo_estado_nombre = 'Activa';
                            break;
                        default:
                            data[i].control_tipo_estado_nombre = 'Error';
                            break;
                    }
                }
            }

            return {status: 'ok', data};
        }catch(error){
            return {status:'error', code: error.code};
        }
        
    },


};
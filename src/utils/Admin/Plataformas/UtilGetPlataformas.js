const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');


module.exports = {

    async getPlataformasList(LAN){

        try{
            let data = await pool.query('SELECT plataforma_id, plataforma_nombre, plataforma_estado_id FROM plataforma ORDER BY plataforma_nombre ASC');
            if (LAN == 'en'){
                for(let i = 0; i < data.length; i ++){
                    switch(data[i].plataforma_estado_id){
                        case 0:
                            data[i].plataforma_estado_nombre = 'Inactive';
                            break;
                        case 1:
                            data[i].plataforma_estado_nombre = 'Active';
                            break;
                        default:
                            data[i].plataforma_estado_nombre = 'Error';
                            break;
                    }
                }
            }else{
                for(let i = 0; i < data.length; i ++){
                    switch(data[i].plataforma_estado_id){
                        case 0:
                            data[i].plataforma_estado_nombre = 'No activa';
                            break;
                        case 1:
                            data[i].plataforma_estado_nombre = 'Activa';
                            break;
                        default:
                            data[i].plataforma_estado_nombre = 'Error';
                            break;
                    }
                }
            }

            return {status:'ok', data};

        }catch(error){
            console.log(error)
            return {status:'error', code: error.code};
        }
    },

    async getPlataformaSearch(nombre, LAN){

        try{
            
            let data = await pool.query("SELECT plataforma_id, plataforma_nombre, plataforma_estado_id FROM plataforma WHERE plataforma_nombre LIKE '%"+nombre+"%'");
            
            if (LAN == 'en'){
                for(let i = 0; i < data.length; i ++){
                    switch(data[i].plataforma_estado_id){
                        case 0:
                            data[i].plataforma_estado_nombre = 'Inactive';
                            break;
                        case 1:
                            data[i].plataforma_estado_nombre = 'Active';
                            break;
                        default:
                            data[i].plataforma_estado_nombre = 'Error';
                            break;
                    }
                }
            }else{
                for(let i = 0; i < data.length; i ++){
                    switch(data[i].plataforma_estado_id){
                        case 0:
                            data[i].plataforma_estado_nombre = 'No activa';
                            break;
                        case 1:
                            data[i].plataforma_estado_nombre = 'Activa';
                            break;
                        default:
                            data[i].plataforma_estado_nombre = 'Error';
                            break;
                    }
                }
            }

            return {status:'ok', data};
            

        }catch(error){
            console.log(error)
            return {status:'error', code: error.code};
        }
    },
};
const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');


module.exports = {

    async getUsuariosList(PARAMS, TYPE, LAN){

        try{

            let data = [];
            let usuarios = [];


            switch (TYPE){
                case 'TOTAL':

                    let pagina = PARAMS;
                    if(pagina > 1){
                        inicio_pagina = (pagina - 1) * 15;
                    }else{
                            inicio_pagina = 0;
                    }
        
                    usuarios = await pool.query('SELECT usuario_id, usuario_user, usuario_nombre, usuario_estado_id, usuario_rol_id FROM usuario ORDER BY usuario_nombre ASC LIMIT 15 OFFSET ?', [inicio_pagina]);

                    break;

                case 'SEARCH':

                    let usuario = '';
                    let nombre = '';
                    let estado = '';
                    let rol = '';
                    let no_PARAMS = false;

                    if(PARAMS.usuario != '' || PARAMS.nombre != '' || PARAMS.estado != '' || PARAMS.rol != ''){
                        if(PARAMS.usuario != ''){
                            usuario = " usuario_user LIKE '%"+PARAMS.usuario+"%' AND ";
                        }
                        if(PARAMS.nombre != ''){
                            nombre = " usuario_nombre LIKE '%"+PARAMS.nombre+"%' AND ";
                        }
                        if(PARAMS.estado != ''){
                            estado = " usuario_estado_id = "+PARAMS.estado+" AND ";
                        }
                        if(PARAMS.rol != ''){
                            rol = " usuario_rol_id = "+PARAMS.rol+" AND ";
                        }
                    }else{
                        no_PARAMS = true;
                    }


                    if(no_PARAMS === false){
                        usuarios = await pool.query('SELECT usuario_id, usuario_user, usuario_nombre, usuario_estado_id, usuario_rol_id FROM usuario WHERE '+usuario+nombre+estado+rol+' 1=1 ORDER BY usuario_nombre ASC');
                    }


                    break;

                default:
                    break;
            }


            if(LAN == 'en'){

                for(let i = 0; i < usuarios.length; i++){
                    if(usuarios[i].usuario_rol_id == 1){
                        usuarios[i].usuario_rol_nombre = "Administrator";
                    }else if(usuarios[i].usuario_rol_id == 2){
                        usuarios[i].usuario_rol_nombre = "Surveyor";
                    }else if(usuarios[i].usuario_rol_id == 3){
                        usuarios[i].usuario_rol_nombre = "Client";
                    }else{
                        usuarios[i].usuario_rol_nombre = "No role";
                    }
                    
    
                    if(usuarios[i].usuario_estado_id === 1){
                        usuarios[i].usuario_estado_nombre = 'Active';
                    }else if(usuarios[i].usuario_estado_id === 0){
                        usuarios[i].usuario_estado_nombre = 'Inactive';
                    }
                }
            }else{

                for(let i = 0; i < usuarios.length; i++){
                    let rol_nombre = await pool.query('SELECT rol_nombre from rol WHERE rol_id = ?', [usuarios[i].usuario_rol_id]);
                    usuarios[i].usuario_rol_nombre = rol_nombre[0].rol_nombre;
    
                    if(usuarios[i].usuario_estado_id === 1){
                        usuarios[i].usuario_estado_nombre = 'Activo';
                    }else if(usuarios[i].usuario_estado_id === 0){
                        usuarios[i].usuario_estado_nombre = 'No activo';
                    }
                }
            }

            let roles = await pool.query('SELECT rol_id, rol_nombre FROM rol ORDER BY rol_nombre ASC');

            data.usuarios = usuarios;
            data.roles = roles;

            return data;
        }catch(error){
            console.log(error)
            return {status:'error', code: error.code};
        }
        
    },


};
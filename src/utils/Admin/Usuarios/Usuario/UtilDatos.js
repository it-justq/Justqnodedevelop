const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');

const {encriptPassword} = require(appRoot+'/utils/Crypto');

module.exports = {

    async getUsuarioData(id, lan){

        try{
            let data = [];

            let usuario = await pool.query('SELECT usuario_id, usuario_user, usuario_rol_id, usuario_nombre, usuario_estado_id, usuario_apellido_1, usuario_apellido_2, usuario_email, usuario_telefono, usuario_idioma_id FROM usuario WHERE usuario_id = ?', [id]);
            if(lan =='en'){
                switch(usuario[0].usuario_rol_id){
                    case 0:
                        usuario[0].usuario_rol_nombre = "No role";
                        break;
                    case 1:
                        usuario[0].usuario_rol_nombre = "Administrator";
                        break;
                    case 2:
                        usuario[0].usuario_rol_nombre = "Surveyor";
                        break;
                    case 3:
                        usuario[0].usuario_rol_nombre = "Client";
                        break;
                    default:
                        usuario[0].usuario_rol_nombre = "Role error";
                        break;
                }
    
                switch(usuario[0].usuario_estado_id){
                    case 0:
                        usuario[0].usuario_estado_nombre = "Inactive";
                        break;
                    case 1:
                        usuario[0].usuario_estado_nombre = "Active";
                        break;
                    default:
                        usuario[0].usuario_estado_nombre = "Status error";
                        break;
                }
    
                switch(usuario[0].usuario_idioma_id){
                    case 0:
                        usuario[0].usuario_idioma_nombre = "No language";
                        break;
                    case 1:
                        usuario[0].usuario_idioma_nombre = "Spanish";
                        break;
                    case 2:
                        usuario[0].usuario_idioma_nombre = "English";
                        break;
                    default:
                        usuario[0].usuario_idioma_nombre = "Language error";
                        break;
                }
        
            }else{
                switch(usuario[0].usuario_rol_id){
                    case 0:
                        usuario[0].usuario_rol_nombre = "Sin rol";
                        break;
                    case 1:
                        usuario[0].usuario_rol_nombre = "Administrador";
                        break;
                    case 2:
                        usuario[0].usuario_rol_nombre = "Técnico";
                        break;
                    case 3:
                        usuario[0].usuario_rol_nombre = "Cliente";
                        break;
                    default:
                        usuario[0].usuario_rol_nombre = "Error en el rol";
                        break;
                }
    
                switch(usuario[0].usuario_estado_id){
                    case 0:
                        usuario[0].usuario_estado_nombre = "No activo";
                        break;
                    case 1:
                        usuario[0].usuario_estado_nombre = "Activo";
                        break;
                    default:
                        usuario[0].usuario_estado_nombre = "Error en el estado";
                        break;
                }
    
                switch(usuario[0].usuario_idioma_id){
                    case 0:
                        usuario[0].usuario_idioma_nombre = "Sin idioma";
                        break;
                    case 1:
                        usuario[0].usuario_idioma_nombre = "Español";
                        break;
                    case 2:
                        usuario[0].usuario_idioma_nombre = "Inglés";
                        break;
                    default:
                        usuario[0].usuario_idioma_nombre = "Error en el idioma";
                        break;
                }
        
            }
           
            data.usuario = usuario[0];

            return data;

        }catch(error){
            return {status:'error', code: error.code};
        }
    },

    async postUsuarioData(PARAMS){

        try{
            let id = parseInt(PARAMS.data.id);
            let value = PARAMS.data.value;
            let campo = PARAMS.data.campo;

            let campoDB;
            let valueDB;

            switch(campo){
                case 'usuario-acceso':
                    campoDB = 'usuario_user';
                    valueDB = value;
                break;
                case 'contraseña':
                    campoDB = 'usuario_pass';
                    let passHash = await encriptPassword(value);
                    if(passHash.status === 'ok'){
                        valueDB = passHash.password;
                    }else{
                        throw "Error al generar la contraseña";
                    }
                    
                break;
                case 'nombre':
                    campoDB = 'usuario_nombre';
                    valueDB = value;
                break;
                case 'apellido1':
                    campoDB = 'usuario_apellido_1';
                    valueDB = value;
                break;
                case 'apellido2':
                    campoDB = 'usuario_apellido_2';
                    valueDB = value;
                break;
                case 'email':
                    campoDB = 'usuario_email';
                    valueDB = value;
                break;
                case 'telefono':
                    campoDB = 'usuario_telefono';
                    valueDB = value;
                break;
                case 'idioma':
                    campoDB = 'usuario_idioma_id';
                    valueDB = parseInt(value);
                break;
                case 'rol':
                    campoDB = 'usuario_rol_id';
                    valueDB = parseInt(value);
                break;
                case 'estado':
                    campoDB = 'usuario_estado_id';
                    valueDB = parseInt(value);
                break;
            }

            await pool.query('UPDATE usuario SET '+campoDB+' = ? WHERE usuario_id = ?', [valueDB, id])


            return {status: 'ok'};

        }catch(error){
            console.log(error)
            return {status:'error', code: error.code};
        }
    },


};
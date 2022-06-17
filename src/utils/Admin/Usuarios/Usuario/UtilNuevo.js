const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');
const {encriptPassword, genHash} = require(appRoot+'/utils/Crypto');

module.exports = {

    async getUsuarioNuevo(lan){

        try{
            let data = [];

            data.idioma = await pool.query('SELECT idioma_id, idioma_nombre FROM idioma ORDER BY idioma_id ASC');
            
            if(lan == 'en'){
                data.rol = [{ rol_id: 1, rol_nombre: 'Administrator' },
                            { rol_id: 3, rol_nombre: 'Client' },
                            { rol_id: 0, rol_nombre: 'No role' },
                            { rol_id: 2, rol_nombre: 'Surveyor' }
                        ]
            }else{
                data.rol = await pool.query('SELECT rol_id, rol_nombre FROM rol ORDER BY rol_nombre ASC');
            }

            return data;

        }catch(error){
            return {status:'error', code: error.code};
        }
    },

    async postUsuarioNuevo(DATA){

        try{

            let usuario = DATA.data.usuario;
            let password = DATA.data.password;
            let nombre = DATA.data.nombre;
            let apellido1 = DATA.data.apellido1;
            let apellido2 = DATA.data.apellido2;
            let email = DATA.data.email;
            let telefono = DATA.data.telefono;
            let idioma = DATA.data.idioma;
            let rol = DATA.data.rol;
            let estado = DATA.data.estado;

            let user_valid = await pool.query('SELECT COUNT(*) AS total FROM usuario WHERE usuario_user = ?', [usuario]);
            user_valid = user_valid[0].total;

            if(!user_valid){
                let hash_password = await encriptPassword(password);
                hash_password = hash_password.password;
                let consulta_usuario = await pool.query(`INSERT INTO usuario (
                                                usuario_user, 
                                                usuario_pass, 
                                                usuario_nombre, 
                                                usuario_apellido_1, 
                                                usuario_apellido_2, 
                                                usuario_email, 
                                                usuario_telefono, 
                                                usuario_idioma_id, 
                                                usuario_rol_id, 
                                                usuario_estado_id
                                                ) 
                                        VALUES
                                                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                                                [
                                                    usuario,
                                                    hash_password,
                                                    nombre,
                                                    apellido1,
                                                    apellido2,
                                                    email,
                                                    telefono,
                                                    idioma,
                                                    rol,
                                                    estado
                                                ]);
                let usuario_insertId = consulta_usuario.insertId;
                
                let usuario_id_hash = await genHash('usuario', usuario_insertId);
                await pool.query('UPDATE usuario SET usuario_id_hash = ? WHERE usuario_id = ? AND usuario_user = ? ', [usuario_id_hash, usuario_insertId, usuario]);
                
                if(rol == 3){
                   let consulta_cliente = await pool.query(`INSERT INTO cliente (
                                                                                cliente_usuario_id, 
                                                                                cliente_nombre
                                                                                ) VALUES (
                                                                                ?, ?
                                                                                )`, 
                                                                                [
                                                                                usuario_insertId,
                                                                                nombre   
                                                                                ]);
                    let cliente_insertId = consulta_cliente.insertId;
                    let cliente_id_hash = await genHash('cliente', cliente_insertId);
                    await pool.query('UPDATE cliente SET cliente_id_hash = ? WHERE cliente_id = ? AND cliente_nombre = ? ', [cliente_id_hash, cliente_insertId, nombre]);
                                                                                
                }
                return{status: 'ok', usuario_id: usuario_insertId};

            }else{
                return{status: 'error', code: 'El usuario ya existe'};
            }

        }catch(error){
            return {status:'error', code: error.code};

        }
    },


};
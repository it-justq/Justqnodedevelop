const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');


module.exports = {

    async getUsuarioPreferencias(id){

        try{
            let data = [];

            let cliente_id = await pool.query('SELECT cliente_id FROM cliente WHERE cliente_usuario_id = ?', [id]);

            if(cliente_id.length > 0){
                cliente_id = cliente_id[0].cliente_id;
                let cliente = await pool.query('SELECT * FROM cliente WHERE cliente_id = ?', [cliente_id]);
                data = cliente[0];

                let idioma = await pool.query('SELECT idioma_nombre FROM idioma WHERE idioma_id = ?', [data.cliente_idioma_id]);
                data.cliente_idioma_nombre = idioma[0].idioma_nombre;

                let control_enviar = await pool.query('SELECT usuario_estado_nombre FROM usuario_estado WHERE usuario_estado_id = ?', [data.cliente_control_enviar]);
                data.cliente_control_enviar_nombre = control_enviar[0].cliente_control_enviar;

                let logo_activo = await pool.query('SELECT usuario_estado_nombre FROM usuario_estado WHERE usuario_estado_id = ?', [data.cliente_logo_activo]);
                data.cliente_logo_activo_nombre = logo_activo[0].usuario_estado_nombre;

                let encabezado_personalizado = await pool.query('SELECT usuario_estado_nombre FROM usuario_estado WHERE usuario_estado_id = ?', [data.cliente_encabezado_personalizado]);
                data.cliente_encabezado_personalizado_nombre = encabezado_personalizado[0].usuario_estado_nombre;

                let firma_justq = await pool.query('SELECT usuario_estado_nombre FROM usuario_estado WHERE usuario_estado_id = ?', [data.cliente_firma_justq]);
                data.cliente_firma_justq_nombre = firma_justq[0].usuario_estado_nombre;

                let pais = await pool.query('SELECT pais_nombre, pais_nombre_en FROM pais WHERE pais_id = ?', data.cliente_pais_id);
                data.cliente_pais_nombre = pais[0].pais_nombre;
                data.cliente_pais_nombre_en = pais[0].pais_nombre_en;



                let cliente_email = await pool.query('SELECT email_contacto_id, email_contacto_cliente_id, email_contacto_email, email_contacto_activo FROM email_contacto WHERE email_contacto_cliente_id = ?', [cliente_id]);

                for(let i = 0; i < cliente_email.length; i ++){
                    if(cliente_email[i].email_contacto_activo === '1'){
                        cliente_email[i].email_contacto_activo_nombre = 'Activo';
                    }else if(cliente_email[i].email_contacto_activo === '0'){
                        cliente_email[i].email_contacto_activo_nombre = 'No activo';
                    }
                }

                data.cliente_email = cliente_email;

            }

            return {status: 'ok', data};

        }catch(error){
            return {status:'error', code: error.code};
        }
    },

    async postUsuarioPreferencias(DATA){

        try{

            let campo = DATA.data.campo;
            let value = DATA.data.value;
            let id = DATA.data.id;

            if(campo === 'add_email'){
                await pool.query('INSERT INTO email_contacto (email_contacto_email, email_contacto_cliente_id, email_contacto_activo) VALUES (?,?,?)', [value, id, 1])
            }else if(campo.includes('mod_email_')){
                let id_email = campo.replace('mod_email_', '');
                if(value === ''){
                    await pool.query('DELETE FROM email_contacto WHERE email_contacto_cliente_id = ? AND email_contacto_id = ?', [id, id_email])
                }else{
                    await pool.query('UPDATE email_contacto SET email_contacto_email = ? WHERE email_contacto_cliente_id = ? AND email_contacto_id = ?', [value, id, id_email])
                }
            }else{
                await pool.query('UPDATE cliente SET '+campo+' = ? WHERE cliente_id = ?', [value, id]);
            }


            return {status: 'ok'};

        }catch(error){
            console.log(error)
            return {status:'error', code: error.code};
        }
    },


};
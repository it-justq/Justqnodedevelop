const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');
const {numControl} = require(appRoot+'/utils/Control/ControlesMysql/UtilCommon');

const nodemailer = require('nodemailer');


let transport = nodemailer.createTransport({
    host: 'ssl0.ovh.net',
    port: 25,
    auth: {
       user: 'quality@justq.eu',
       pass: 'Justq-nfEE.2021'
    }
});

module.exports = {

    async sendMail(VALUE, type){
        try{

            switch(type){
                case 'control-cliente':

                    const control_id = VALUE.control_id;
                    const control_hash = VALUE.control_hash;
                    let control_codigo = await numControl(control_id);

                    const cliente_id = await pool.query('SELECT control_cliente_id, control_estado FROM control WHERE control_id = ?',[control_id]);
                
                    const email_cliente = await pool.query('SELECT email_contacto_email FROM email_contacto WHERE email_contacto_cliente_id = ? AND email_contacto_activo = 1',[cliente_id[0].control_cliente_id]);
                    const email_cliente_enviar = await pool.query('SELECT cliente_nombre, cliente_control_enviar FROM cliente WHERE cliente_id = ?',[cliente_id[0].control_cliente_id]);

                
                    if(email_cliente_enviar[0].cliente_control_enviar === 1 ){
                        if(cliente_id[0].control_estado === 1){
                            for(let i=0; i<email_cliente.length; i++){
                                if(email_cliente[i].email_contacto_email != null || email_cliente[i].email_contacto_email != 'null' || email_cliente[i].email_contacto_email != ''){
                    
                                   const message = {
                                        from: 'quality@justq.eu',
                                        to: email_cliente[i].email_contacto_email,
                                        subject: 'Survey report '+control_codigo,
                                        html: `
                                                <h3 style='color:black;'>Estimado cliente,</h3>
                                                        <p style='color:black;'>Un nuevo reporte está disponible en su <a href='https://www.justq.eu/informe/web/`+control_hash+`/es'>portal Web</a></p>
                                                        <p style='color:black;'>O directamente desde el enlace <a href='https://www.justq.eu/informe/pdf/es/`+control_hash+`'>pdf en español</a></p>
                                                        <p style='color:black;'>Para cualquier duda, contacte con el Departamento Técnico de Just Quality</p>
                                                        <p style='color:black;'>Un Saludo</p>
                    
                                                        <br>
                    
                                                <h3 style='color:black;'>Dear Client,</h3>
                                                        <p style='color:black;'>Now a new report is available in your <a href='https://www.justq.eu/informe/web/`+control_hash+`/en'>web Portal</a></p>
                                                        <p style='color:black;'>Or directly from the link <a href='https://www.justq.eu/informe/pdf/en/`+control_hash+`'>english pdf</a></p>
                                                        <p style='color:black;'>If you have any question, kindly contact with the Just Quality Technical Team</p>
                                                        <p style='color:black;'>Best Regards!</p>
                    
                                                        <br>
                    
                                                <img src='https://www.justq.eu/images/logo.png'>
                                    
                                                `,
                                    };
                    
                                    transport.sendMail(message, async function (err, info) {
                                        if (err) {
                                            return {status: 'error', code:'Hubo un error en el proceso de envío'};
                                        }
                                    });
                    
                    
                                }
                            }   

                            let contador_email = await pool.query('SELECT control_enviado_correo AS contador FROM control WHERE control_id = ?', [control_id]);
                            contador_email = parseInt(contador_email[0].contador) + 1;

                            await pool.query('UPDATE control SET control_enviado_correo = ? WHERE control_id = ?',[contador_email, control_id]);
                            
                            return {status: 'ok', code:'E-mail enviado correctamente'};
                        }else{
                            return {status: 'error', code:'El control debe de estar activo para enviarlo por E-mail'};
                        }
                        
                    }else{
                        return {status: 'error', code:'El cliente no tiene activo el envío de E-mail'};
                    }
                

                    break;
            }

        }catch(err){
            return {status: 'error', code:'Error al enviar el e-mail'};
        }
       
    },


};
const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');

module.exports = {

    async getConfiguracion(control, idioma){
        
        try{

            let DATA  = {};
            let cliente;

            cliente = await pool.query('SELECT cliente_id, cliente_firma_justq, cliente_logo, cliente_logo_activo, cliente_encabezado_personalizado, cliente_encabezado_id FROM cliente, control WHERE cliente_id = control_cliente_id AND control_id = ?', [control])
            cliente = cliente[0];
            
            if(cliente.cliente_firma_justq === 0){
                DATA.cliente_firma_justq = false;
            }else if(cliente.cliente_firma_justq === 1){
                DATA.cliente_firma_justq = true;
            }


            if(cliente.cliente_logo_activo === 0){
                DATA.cliente_logo_activo = false;
                DATA.cliente_logo = null;

            }else if(cliente.cliente_logo_activo === 1){
                DATA.cliente_logo_activo = true;
                DATA.cliente_logo = cliente.cliente_logo;
            }

            if(cliente.cliente_encabezado_personalizado === 0){
                DATA.cliente_encabezado_personalizado = false;
                DATA.cliente_encabezado_id = null;

            }else if(cliente.cliente_encabezado_personalizado === 1){
                DATA.cliente_encabezado_personalizado = true;
                DATA.cliente_encabezado_id = cliente.cliente_encabezado_id;
            }

            DATA.cliente_id = cliente.cliente_id;


            return {status: 'ok', data: DATA};

        }catch(error){
            return {status: 'error', code: 'Error al generar el control PDF'};
        }

    },



};

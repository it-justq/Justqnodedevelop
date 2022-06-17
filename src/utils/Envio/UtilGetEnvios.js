const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');
const {getDate} = require(appRoot+'/utils/Date');

module.exports = {

    async getEnviosList(PARAMS, pagina){
        try {
            let usuario_id = PARAMS.usuario_id;
            let rol_id = PARAMS.rol_id;
            let envios_list;

            if (pagina > 1) {
                inicio_pagina = (pagina - 1) * 15;
            } else {
                inicio_pagina = 0;
            }

            if (rol_id === 1) {//admin
                envios_list = await pool.query('SELECT envio_id_hash as envio_id, envio_estado_id, envio_transporte_referencia, envio_datos_transporte_id, envio_pedido_referencia, envio_consignatario, envio_carga_almacen, envio_producto, envio_carga_fecha, envio_etd, envio_eta, envio_termografo_id, envio_cliente_id FROM envio ORDER BY envio_eta DESC LIMIT 15 OFFSET ?', [inicio_pagina]);
            } else if (rol_id === 3) {//cliente
                let cliente_id = await pool.query('SELECT cliente_id FROM cliente WHERE cliente_usuario_id = ?', [usuario_id]);
                cliente_id = cliente_id[0].cliente_id;
                envios_list = await pool.query('SELECT envio_id_hash as envio_id, envio_estado_id, envio_transporte_referencia, envio_datos_transporte_id, envio_pedido_referencia, envio_consignatario, envio_carga_almacen, envio_producto, envio_carga_fecha, envio_etd, envio_eta, envio_termografo_id FROM envio WHERE envio_cliente_id = ? ORDER BY envio_eta DESC LIMIT 15 OFFSET ?', [cliente_id, inicio_pagina]);
            
            } else {
                envios_list = [];
            }
            let total_envios = envios_list.length;

            if (total_envios != 0) {
                for (let i = 0; i < total_envios; i++) {
                    let producto_nombre = await pool.query('SELECT familia_nombre FROM familia WHERE familia_id = ?', [envios_list[i].envio_producto]);
                    envios_list[i].envio_producto_nombre = producto_nombre[0].familia_nombre;
                    switch(envios_list[i].envio_estado_id){
                        case 0:
                            envios_list[i].envio_estado_nombre = "Desconocido";
                            break;
                        case 1:
                            envios_list[i].envio_estado_nombre = "Cargado";
                            break;
                        case 2:
                            envios_list[i].envio_estado_nombre = "En Tránsito";
                            break;
                        case 3:
                            envios_list[i].envio_estado_nombre = "Entregado";
                            break;
                    }

                    if(rol_id != 3){
                        let cliente_nombre = await pool.query('SELECT cliente_nombre FROM cliente WHERE cliente_id = ?', [envios_list[i].envio_cliente_id]);
                        envios_list[i].cliente_nombre = cliente_nombre[0].cliente_nombre;
                    }
                }
                
            } else {
                return { status: 'error', code: 'No se han encontrado envios' };
            }

            return envios_list;


        } catch (error) {
            return { status: 'error', code: 'Error al obtener los envios' };
        }

    }

};
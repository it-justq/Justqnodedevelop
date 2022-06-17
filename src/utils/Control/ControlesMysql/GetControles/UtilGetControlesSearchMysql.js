const { ConsoleMessage } = require('puppeteer');
const pool = require('../../../Conexion/UtilDatabase_jq');
const { escapeDataSearchControles, escapeDataSlashesDot, escapeData } = require(appRoot + '/utils/ParseData');

module.exports = {

    async getControlesSearchListMysql(PARAMS) {

        try {
            let usuario_id = PARAMS.usuario_id;
            let rol_id = PARAMS.rol_id;

            let controles;
            let return_controles = [];


            let fecha = '';
            let control = '';
            let cliente = '';
            let tecnico = '';
            let inicio = '';
            let fin = '';
            let estado = '';
            let familia = '';
            let plataforma = '';
            let referencia = '';
            let contenedor = '';

            let no_PARAMS = false;

            if (rol_id === 1) {

            } else if (rol_id === 2) {
                PARAMS.data.tecnico = '';
            } else if (rol_id === 3) {
                PARAMS.data.cliente = '';
                PARAMS.data.tecnico = '';
                PARAMS.data.estado = '';
            }


            if (PARAMS.data.fecha != '' || PARAMS.data.control != '' || PARAMS.data.cliente != '' || PARAMS.data.tecnico != '' || PARAMS.data.inicio != '' || PARAMS.data.fin != '' || PARAMS.data.familia != '' || PARAMS.data.estado != '' || PARAMS.data.referencia != '' || PARAMS.data.contenedor != '' || PARAMS.data.plataforma != '') {
                if (PARAMS.data.fecha != '') {
                    let fechaParse = await escapeDataSearchControles(PARAMS.data.fecha);
                    fecha = " control_fecha = '" + fechaParse + "' AND ";
                }
                if (PARAMS.data.control != '') {
                    let controlParse = await escapeDataSearchControles(PARAMS.data.control);
                    control = " control_codigo LIKE '%" + controlParse + "%' AND ";
                }
                if (PARAMS.data.cliente != '') {
                    let clienteParse = await escapeData(PARAMS.data.cliente);
                    let cliente_id = await pool.query('SELECT cliente_id FROM cliente WHERE cliente_id_hash = ?', [clienteParse]);
                    cliente = " control_cliente_id = " + cliente_id[0].cliente_id + " AND ";
                }
                if (PARAMS.data.tecnico != '') {
                    let tecnicoParse = await escapeData(PARAMS.data.tecnico);
                    let tecnico_id = await pool.query('SELECT usuario_id FROM usuario WHERE usuario_id_hash = ?', [tecnicoParse]);
                    tecnico = " control_tecnico_id = " + tecnico_id[0].usuario_id + " AND ";
                }
                if (PARAMS.data.estado != '') {

                    let estadoParse = await escapeData(PARAMS.data.estado);
                    estado = " control_estado = " + estadoParse + " AND ";
                }
                if (PARAMS.data.familia != '') {
                    let familiaParse = await escapeData(PARAMS.data.familia);
                    let familia_id = await pool.query('SELECT familia_id FROM familia WHERE familia_id_hash = ?', [familiaParse]);
                    familia = " control_producto_familia_id = " + familia_id[0].familia_id + " AND ";
                }
                if (PARAMS.data.plataforma != '') {

                    let plataformaParse = await escapeDataSlashesDot(PARAMS.data.plataforma);
                    let plataforma_id = await pool.query("SELECT plataforma_id FROM plataforma WHERE plataforma_nombre LIKE '%" + plataformaParse + "%'");
                    if (plataforma_id[0].plataforma_id != undefined) {
                        plataforma = " control_plataforma_id = " + plataforma_id[0].plataforma_id + " AND ";
                    } else {
                        no_PARAMS = true;
                    }
                }
                if (PARAMS.data.inicio != '') {
                    let inicioParse = await escapeDataSearchControles(PARAMS.data.inicio);
                    inicio = " control_fecha >= '" + inicioParse + "' AND ";
                }
                if (PARAMS.data.fin != '') {
                    let finParse = await escapeDataSearchControles(PARAMS.data.fin);
                    fin = " control_fecha <= '" + finParse + "' AND ";
                }
                if (PARAMS.data.referencia != '') {
                    //let referenciaParse = await escapeDataSlashesDot(PARAMS.data.referencia);
                    referencia = " control_referencia LIKE '%" + PARAMS.data.referencia + "%' AND ";
                }
                if (PARAMS.data.contenedor != '') {
                    let contenedorParse = await escapeDataSlashesDot(PARAMS.data.contenedor);
                    contenedor = " control_expedicion_contenedor LIKE '%" + contenedorParse + "%' AND ";
                }
            } else {
                no_PARAMS = true;
            }

            if (rol_id === 1 && no_PARAMS === false) {
                let total = await pool.query('SELECT COUNT(*) as count FROM control WHERE ' + fecha + control + cliente + inicio + fin + estado + familia + tecnico + referencia + contenedor + plataforma + ' control_borrado = 0 ');
                total = total[0].count;
                if (total <= 100) {
                    controles = await pool.query('SELECT control_id_hash as control_id, control_codigo, control_estado, control_valoracion_id, control_cliente_id, control_cliente_mod, control_referencia, control_fecha, control_producto_familia_id, control_producto_marca, control_plataforma_id, control_plataforma_mod FROM control WHERE ' + fecha + control + cliente + inicio + fin + estado + familia + tecnico + referencia + contenedor + plataforma + ' control_borrado = 0 ORDER BY control_fecha DESC');
                    return_controles.length_limit = false;
                } else {
                    return_controles.length_limit = true;
                    return_controles.status = true;
                    return return_controles;
                }

            } else if (rol_id === 2 && no_PARAMS === false) {
                let total = await pool.query('SELECT COUNT(*) as count FROM control WHERE control_tecnico_id = ? AND ' + fecha + control + cliente + inicio + fin + estado + familia + referencia + plataforma + ' control_borrado = 0', [parseInt(usuario_id)]);
                total = total[0].count;
                if (total <= 100) {
                    controles = await pool.query('SELECT control_id_hash as control_id, control_codigo, control_estado, control_valoracion_id, control_cliente_id, control_cliente_mod, control_referencia, control_fecha, control_producto_familia_id, control_producto_marca, control_plataforma_id, control_plataforma_mod FROM control WHERE control_tecnico_id = ? AND ' + fecha + control + cliente + inicio + fin + estado + familia + referencia + plataforma + ' control_borrado = 0 ORDER BY control_fecha DESC', [parseInt(usuario_id)]);
                    return_controles.length_limit = false;
                } else {
                    return_controles.length_limit = true;
                    return_controles.status = true;
                    return return_controles;
                }
            } else if (rol_id === 3 && no_PARAMS === false) {
                let cliente_id_search = await pool.query('SELECT cliente_id FROM cliente WHERE cliente_usuario_id = ?', [usuario_id]);
                cliente_id_search = cliente_id_search[0].cliente_id;
                let total = await pool.query('SELECT COUNT(*) as count FROM control WHERE control_cliente_id = ? AND ' + fecha + control + inicio + fin + familia + referencia + contenedor + plataforma + ' control_borrado = 0 AND control_estado = 1', [parseInt(cliente_id_search)]);
                total = total[0].count;
                if (total <= 100) {
                    controles = await pool.query('SELECT control_id_hash as control_id, control_codigo, control_valoracion_id, control_cliente_id, control_cliente_mod, control_referencia, control_fecha, control_producto_familia_id, control_producto_marca, control_plataforma_id, control_plataforma_mod FROM control WHERE control_cliente_id = ? AND ' + fecha + control + inicio + fin + familia + referencia + contenedor + plataforma + ' control_borrado = 0 AND control_estado = 1 ORDER BY control_fecha DESC', [parseInt(cliente_id_search)]);
                    return_controles.length_limit = false;
                } else {
                    return_controles.length_limit = true;
                    return_controles.status = true;
                    return return_controles;
                }
            } else {
                controles = [];
            }


            let total_controles = controles.length;

            if (total_controles != 0) {
                for (let i = 0; i < controles.length; i++) {

                    switch (controles[i].control_estado) {
                        case 0:
                            controles[i].control_estado_nombre = "No activo";
                            break;
                        case 1:
                            controles[i].control_estado_nombre = "Activo";
                            break;
                    }

                    let plataforma_nombre = await pool.query('SELECT plataforma_nombre FROM plataforma WHERE plataforma_id = ?', [controles[i].control_plataforma_id]);
                    let familia_nombre = await pool.query('SELECT familia_nombre FROM familia WHERE familia_id = ?', [controles[i].control_producto_familia_id]);
                    let cliente_nombre = await pool.query('SELECT cliente_nombre FROM cliente WHERE cliente_id = ?', [controles[i].control_cliente_id]);
                    let valoracion = await pool.query('SELECT valoracion_nombre, valoracion_color_id FROM valoracion WHERE valoracion_id = ?', [controles[i].control_valoracion_id]);
                    let color = await pool.query('SELECT color_codigo FROM color WHERE color_id = ?', [valoracion[0].valoracion_color_id]);

                    controles[i].plataforma_nombre = (controles[i].control_plataforma_mod != 'null') ? controles[i].control_plataforma_mod : plataforma_nombre[0].plataforma_nombre;
                    controles[i].familia_nombre = familia_nombre[0].familia_nombre;
                    controles[i].cliente_nombre = (controles[i].control_cliente_mod != 'null') ? controles[i].control_cliente_mod : cliente_nombre[0].cliente_nombre;
                    controles[i].valoracion_nombre = valoracion[0].valoracion_nombre;

                    if (color[0].color_codigo === 'FFFFFF') {
                        controles[i].valoracion_color = 'd9d9d9';
                    } else {
                        controles[i].valoracion_color = color[0].color_codigo;
                    }

                    controles[i].tipo_mysql = true;

                }

                return_controles.controles = controles;
                return_controles.status = true;
            } else {
                return_controles.status = false;
            }

            return return_controles;

        } catch (error) {
            return { status: 'error', code: 'Error al obtener los controles' };
        }

    }

};
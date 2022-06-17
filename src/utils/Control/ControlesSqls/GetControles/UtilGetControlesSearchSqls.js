const pool = require(appRoot + '/utils/Conexion/UtilDatabase_jq');
const config = require(appRoot + '/utils/Conexion/UtilDatabase_sqls');
const sql = require('mssql');
const dayjs = require('dayjs');
const { getDate, redateSqls } = require(appRoot + '/utils/Date');


module.exports = {

    async getControlesSearchListSqls(PARAMS) {

        try {
            const mssql = await sql.connect(config);

            let usuario_id = PARAMS.usuario_id;
            let rol_id = PARAMS.rol_id;
            let usuario_nombre = PARAMS.user;

            let controles;
            let return_controles = [];
            let total_controles = 0;

            let fecha = '';
            let control = '';
            let cliente = '';
            let tecnico = '';
            let inicio = '';
            let fin = '';
            let familia = '';
            let plataforma = '';
            let referencia = '';
            let estado = '';

            let no_PARAMS = false;


            let usuario_user = null;
            if (rol_id != 1) {
                let userDB = await pool.query('SELECT usuario_user FROM usuario WHERE usuario_id = ?', [usuario_id]);

                if (userDB.length != 0) {
                    usuario_user = userDB[0].usuario_user;
                }
            }


            if (PARAMS.data.fecha != '' || PARAMS.data.control != '' || PARAMS.data.cliente != '' || PARAMS.data.tecnico != '' || PARAMS.data.inicio != '' || PARAMS.data.fin != '' || PARAMS.data.familia != '' || PARAMS.data.plataforma != '' || PARAMS.data.referencia != '' || PARAMS.data.estado != '') {

                if (PARAMS.data.estado != '') {
                    no_PARAMS = true;
                } else {
                    if (PARAMS.data.fecha != '') {
                        fecha = " Fecha_Control = '" + PARAMS.data.fecha + "  00:00:00.000' AND ";
                    }
                    if (PARAMS.data.control != '') {
                        control = " codigo LIKE '%" + PARAMS.data.control + "%' AND ";
                    }
                    if (PARAMS.data.cliente != '') {
                        let cliente_id = await pool.query('SELECT cliente_id FROM cliente WHERE cliente_id_hash = ?', [PARAMS.data.cliente]);

                        let mysql_cliente_nombre = await pool.query('SELECT cliente_nombre FROM cliente WHERE cliente_id = ?', [cliente_id[0].cliente_id]);
                        mysql_cliente_nombre = mysql_cliente_nombre[0].cliente_nombre;

                        let sqls_Cliente_idGuid = await mssql.query(`SELECT Cliente_idGuid AS id FROM CLIENTES WHERE Nombre = '` + mysql_cliente_nombre + `'`);
                        if (sqls_Cliente_idGuid.recordset[0] != undefined) {
                            sqls_Cliente_idGuid = sqls_Cliente_idGuid.recordset[0].id;
                            cliente = " Cliente_idGuid = '" + sqls_Cliente_idGuid + "' AND ";
                        } else {
                            no_PARAMS = true;
                        }

                    }
                    if (PARAMS.data.tecnico != '') {
                        let tecnico_id = await pool.query('SELECT usuario_id, usuario_user FROM usuario WHERE usuario_id_hash = ?', [PARAMS.data.tecnico]);
                        mysql_tecnico_nombre = tecnico_id[0].usuario_user;


                        let sqls_tecnico_idGuid = await mssql.query(`SELECT Usuario_idGuid AS id FROM USUARIOS WHERE Usuario = '` + mysql_tecnico_nombre + `'`);
                        sqls_tecnico_idGuid = sqls_tecnico_idGuid.recordset[0].id;

                        tecnico = " Tecnico_idGuid = '" + sqls_tecnico_idGuid + "' AND ";
                    }
                    if (PARAMS.data.familia != '') {
                        let familia_id = await pool.query('SELECT familia_id FROM familia WHERE familia_id_hash = ?', [PARAMS.data.familia]);

                        let mysql_familia_nombre = await pool.query('SELECT familia_nombre FROM familia WHERE familia_id = ?', [familia_id[0].familia_id]);
                        mysql_familia_nombre = mysql_familia_nombre[0].familia_nombre;

                        let sqls_familia_idGuid = await mssql.query(`SELECT Familia_idGuid AS id FROM FAMILIA WHERE Nombre = '` + mysql_familia_nombre + `'`);
                        sqls_familia_idGuid = sqls_familia_idGuid.recordset[0].id;

                        familia = " Familia_idGuid = '" + sqls_familia_idGuid + "' AND ";
                    }
                    if (PARAMS.data.plataforma != '') {

                        //let mysql_plataforma_nombre = await pool.query('SELECT plataforma_nombre FROM plataforma WHERE plataforma_id = ?', [PARAMS.data.plataforma]);
                        //mysql_plataforma_nombre = mysql_plataforma_nombre[0].plataforma_nombre;
                        //let sqls_Plataforma_idGuid = await mssql.query(`SELECT Plataforma_idGuid AS id FROM PLATAFORMAS WHERE Nombre LIKE '%`+mysql_plataforma_nombre+`%'`);
                        let sqls_Plataforma_idGuid = await mssql.query(`SELECT Plataforma_idGuid AS id FROM PLATAFORMAS WHERE Nombre LIKE '%` + PARAMS.data.plataforma + `%'`);
                        if (sqls_Plataforma_idGuid.recordset[0] != undefined) {
                            sqls_Plataforma_idGuid = sqls_Plataforma_idGuid.recordset[0].id;
                            plataforma = " Plataforma_idGuid = '" + sqls_Plataforma_idGuid + "' AND ";
                        } else {
                            no_PARAMS = true;
                        }

                    }
                    if (PARAMS.data.inicio != '') {
                        inicio = " Fecha_Control >= '" + PARAMS.data.inicio + "  00:00:00.000' AND ";
                    }
                    if (PARAMS.data.fin != '') {
                        fin = " Fecha_Control <= '" + PARAMS.data.fin + "  00:00:00.000' AND ";
                    }
                    if (PARAMS.data.referencia != '') {
                        referencia = " Referencia_Cliente LIKE '%" + PARAMS.data.referencia + "%' AND ";
                    }
                }
            } else {
                no_PARAMS = true;
            }



            if (rol_id === 1 && no_PARAMS === false) {//admin
                let total = await mssql.query(`SELECT COUNT(*) as count FROM control WHERE ` + fecha + control + cliente + tecnico + inicio + fin + familia + plataforma + referencia + ` finalizado = 1`);
                total = total.recordset[0].count;
                if (total <= 300) {
                    controles = await mssql.query(`SELECT Control_idGuid AS control_id, 
                    codigo AS control_codigo, 
                    Tecnico_idGuid, 
                    Cliente_idGuid, 
                    Fecha_Control AS control_fecha, 
                    Referencia_Cliente AS control_referencia, 
                    Valoracion_idGuid, 
                    Plataforma_idGuid, 
                    Familia_idGuid,
                    Marca AS control_producto_marca
                    FROM control WHERE `+ fecha + control + cliente + tecnico + inicio + fin + familia + plataforma + referencia + ` finalizado = 1 ORDER BY Fecha_Control DESC`);
                    controles = controles.recordset;
                    return_controles.length_limit = false;

                } else {
                    return_controles.length_limit = true;
                    return_controles.status = true;
                    return return_controles;
                }


            } else if (rol_id === 2 && no_PARAMS === false) {//tecnico

                let usuario_idSQLS = await mssql.query(`SELECT Usuario_idGuid FROM USUARIOS WHERE Usuario = '` + usuario_user + `'`);
                usuario_idSQLS = usuario_idSQLS.recordset[0].Usuario_idGuid;

                let total = await mssql.query(`SELECT COUNT(*) as count FROM control WHERE ` + fecha + control + cliente + inicio + fin + familia + plataforma + referencia + ` Usuario_idGuid = '` + usuario_idSQLS + `' AND finalizado = 1`);
                total = total.recordset[0].count;

                if (total <= 300) {
                    controles = await mssql.query(`SELECT Control_idGuid AS control_id, 
                                            codigo AS control_codigo, 
                                            Tecnico_idGuid, 
                                            Cliente_idGuid, 
                                            Fecha_Control AS control_fecha, 
                                            Referencia_Cliente AS control_referencia, 
                                            Valoracion_idGuid, 
                                            Plataforma_idGuid, 
                                            Familia_idGuid,
                                            Marca AS control_producto_marca
                                            FROM control WHERE `+ fecha + control + cliente + inicio + fin + familia + plataforma + referencia + ` Usuario_idGuid = '` + usuario_idSQLS + `' AND finalizado = 1 ORDER BY Fecha_Control DESC`);
                    controles = controles.recordset;
                    return_controles.length_limit = false;

                } else {
                    return_controles.length_limit = true;
                    return_controles.status = true;
                    return return_controles;
                }


            } else if (rol_id === 3 && no_PARAMS === false) {//cliente

                let cliente_idSQLS = await mssql.query(`SELECT Cliente_idGuid FROM CLIENTES WHERE Nombre = '` + usuario_nombre + `'`);
                cliente_idSQLS = cliente_idSQLS.recordset[0].Cliente_idGuid;

                let total = await mssql.query(`SELECT COUNT(*) as count FROM control WHERE ` + fecha + control + inicio + fin + familia + plataforma + referencia + ` Cliente_idGuid = '` + cliente_idSQLS + `' AND finalizado = 1`);
                total = total.recordset[0].count;

                if (total <= 300) {
                    controles = await mssql.query(`SELECT Control_idGuid AS control_id, 
                                                        codigo AS control_codigo, 
                                                        Tecnico_idGuid, 
                                                        Cliente_idGuid, 
                                                        Fecha_Control AS control_fecha, 
                                                        Referencia_Cliente AS control_referencia, 
                                                        Valoracion_idGuid, 
                                                        Plataforma_idGuid, 
                                                        Familia_idGuid,
                                                        Marca AS control_producto_marca
                                                        FROM control WHERE `+ fecha + control + inicio + fin + familia + plataforma + referencia + ` Cliente_idGuid = '` + cliente_idSQLS + `' AND finalizado = 1 ORDER BY Fecha_Control DESC`);
                    controles = controles.recordset;
                    return_controles.length_limit = false;

                } else {
                    return_controles.length_limit = true;
                    return_controles.status = true;
                    return return_controles;
                }
            } else {
                controles = [];
            }


            total_controles = controles.length;

            if (total_controles != 0) {
                for (let i = 0; i < total_controles; i++) {

                    controles[i].estado = 1;

                    if (controles[i].Familia_idGuid != null) {
                        let familia_nombre = await mssql.query("SELECT Nombre FROM FAMILIA WHERE Familia_idGuid = '" + controles[i].Familia_idGuid + "'");
                        controles[i].familia_nombre = familia_nombre.recordset[0].Nombre;
                    } else {
                        controles[i].familia_nombre = 'null';
                    }


                    if (controles[i].Plataforma_idGuid != null) {
                        let plataforma_nombre = await mssql.query("SELECT Nombre FROM PLATAFORMAS WHERE Plataforma_idGuid = '" + controles[i].Plataforma_idGuid + "'");
                        controles[i].plataforma_nombre = plataforma_nombre.recordset[0].Nombre;
                    } else {
                        controles[i].plataforma_nombre = 'null';
                    }


                    if (controles[i].Cliente_idGuid != null) {
                        let cliente_nombre = await mssql.query("SELECT Nombre FROM CLIENTES WHERE Cliente_idGuid = '" + controles[i].Cliente_idGuid + "'");
                        controles[i].cliente_nombre = cliente_nombre.recordset[0].Nombre;
                    } else {
                        controles[i].cliente_nombre = 'null';
                    }



                    if (controles[i].Valoracion_idGuid != null) {
                        let valoracion = await mssql.query("SELECT VALORACION.Nombre AS ValoracionNombre, COLOR.Color AS ColorNombre FROM VALORACION, COLOR WHERE VALORACION.Valoracion_idGuid = '" + controles[i].Valoracion_idGuid + "' AND VALORACION.Color_idGuid = COLOR.Color_idGuid");
                        controles[i].valoracion_nombre = valoracion.recordset[0].ValoracionNombre;
                        controles[i].valoracion_color = valoracion.recordset[0].ColorNombre.replace(/#/g, '');

                    } else {
                        controles[i].valoracion_nombre = 'Sin valorar';
                        controles[i].valoracion_color = 'd9d9d9';
                    }



                    if (controles[i].control_fecha != null) {
                        let redateFecha = await redateSqls(controles[i].control_fecha);
                        controles[i].control_fecha = redateFecha;
                    }

                    controles[i].tipo_sqls = true;
                    controles[i].control_estado = 1;

                }

                return_controles.controles = controles;
                return_controles.status = true;
            } else {
                return_controles.status = false;
            }
            return return_controles;

        } catch (error) {
            console.log(error)
            return { status: 'error', code: error };
        }

    }

};
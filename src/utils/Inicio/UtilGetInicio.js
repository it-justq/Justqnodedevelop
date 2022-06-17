const { ConsoleMessage } = require("puppeteer");

const pool = require(appRoot + '/utils/Conexion/UtilDatabase_jq');
const { getDate } = require(appRoot + '/utils/Date');
const { genHash } = require(appRoot + '/utils/Crypto');

module.exports = {

    async getInicioDatos(PARAMS) {

        try {

           /* let table = await pool.query('SELECT foto_punto_control_id as id FROM foto_punto_control WHERE foto_punto_control_id_hash = 0');

            for (let i = 0; i < table.length; i++) {
                try {
                    let hash = await genHash('foto_punto_control', table[i].id);
                    await pool.query('UPDATE foto_punto_control SET foto_punto_control_id_hash = ? WHERE foto_punto_control_id = ?', [hash, table[i].id]);
                } catch (error) {
                    console.log(error + '----' + table[i].id);
                }
            }*/

            let usuario_rol_id = PARAMS.usuario_rol_id;
            let usuario_id = PARAMS.usuario_id;
            let data = {};

            data.usuario_nombre = PARAMS.usuario_nombre;
            data.date = getDate();

            if (usuario_rol_id === 1 || usuario_rol_id === 2) {
                let controles_activos = await pool.query('SELECT COUNT(*) as total FROM control WHERE control_estado = 1 AND control_tecnico_id = ?', [usuario_id]);
                data.controles_activos = controles_activos[0].total;
                let controles_no_activos = await pool.query('SELECT COUNT(*) as total FROM control WHERE control_estado = 0 AND control_tecnico_id = ?', [usuario_id]);
                data.controles_no_activos = controles_no_activos[0].total;


            } else if (usuario_rol_id === 3) {

            }

            data.status = 'ok';
            return data;
        } catch (error) {
            return { status: 'error', code: 'Error al obtener los datos' };
        }

    }
}
const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');

module.exports = {

    async GenControl(tipo){

        try{

            const control_prefijo = await pool.query('SELECT control_tipo_prefijo FROM control_tipo WHERE control_tipo_id = ?',[tipo]);

            const control_numeracion = await pool.query('SELECT MAX(control_numeracion_numero) AS maximo FROM control_numeracion WHERE control_numeracion_tipo_control_id = ?',[tipo]);
            const numeracion = parseInt(control_numeracion[0].maximo, 10) + 1;

            await pool.query('INSERT INTO control_numeracion (control_numeracion_tipo_control_id, control_numeracion_numero) VALUES (?,?)',[tipo, numeracion]);

            const control_codigo = control_prefijo[0].control_tipo_prefijo+"-"+numeracion;


            return {status: 'ok', control_codigo};

        }catch(error){
            console.log(error)
            return {status: 'error'};
        }
    },

    async DelControl(control_id){

        try{


            return {status: 'ok'};

        }catch(error){
            return {status: 'error'};
        }
    },
}
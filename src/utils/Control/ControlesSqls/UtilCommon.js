const config = require(appRoot+'/utils/Conexion/UtilDatabase_sqls');
const sql = require('mssql');

module.exports = {

    async numControl(controlId){
        const mssql = await sql.connect(config);

        let num = await mssql.query("SELECT Codigo FROM CONTROL WHERE Control_idGuid = '"+controlId+"'");

        return num.recordset[0].Codigo;
    },

    async permisosControl(rolId){

        let rol_id = parseInt(rolId);


        if(rol_id === 1){

            return true;

        }else{

            return false;

        }

    },

    async esPrecarga(controlId){
        let confirm = await pool. query('SELECT control_tipo_id AS id FROM control WHERE control_id = ?', [controlId]);

        if(confirm[0].id === 1){
            return true;
        }else{
            return false;
        }
    }
    
};
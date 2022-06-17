const layout = '../../views/pages/intranet/periciales/pericial/';
const modules = 'modules/intranet/periciales/pericial/';

const {requested} = require(appRoot+'/utils/Pericial/UtilRequested');
const {numInforme, permisosInforme} = require(appRoot+'/utils/Pericial/UtilCommon');
const {getUserData} = require(appRoot+'/utils/GetUser');



const {deletePericialTotal} = require(appRoot+'/utils/Pericial/Periciales/UtilConfiguracion');





module.exports = {

    async deleteInforme(req, res){
        const cnf = await requested(req);

        if(await permisosInforme(cnf.informe_id, cnf.user_id, cnf.rol)){
            let response = await deletePericialTotal(cnf);
            res.send(response);
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES deleteInforme USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.informe_hash);
            res.send(response);
        }
    },


};

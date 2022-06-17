const layout = '../../views/pages/intranet/controles/control/';
const modules = 'modules/intranet/controles/control/';

const {requested} = require(appRoot+'/utils/Control/UtilRequested');
const {numControl, permisosControl} = require(appRoot+'/utils/Control/ControlesMysql/UtilCommon');


const {deleteControlTotal, createPlantillaTotal, deletePlantillaTotal} = require(appRoot+'/utils/Control/ControlesMysql/UtilConfiguracion');





module.exports = {

    async deleteControl(req, res){
        const cnf = await requested(req);

        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol)){
            let response = await deleteControlTotal(cnf);
            res.send(response);
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES deleteControl USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.send(response);
        }
    },

    async createPlantilla(req, res){
        const cnf = await requested(req);

        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol)){
            await createPlantillaTotal(cnf.data, cnf.control_id, cnf.user_id);
            res.redirect('/intranet/control/'+cnf.control_hash);
            
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES createPlantilla USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.send(response);
        }
    },
    async deletePlantilla(req, res){
        const cnf = await requested(req);

        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol)){
            
            let response = await deletePlantillaTotal(cnf.subId, cnf.control_id);
            res.send(response);
            
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES deletePlantilla USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.send(response);
        }
    },

};

const layout = '../../views/pages/intranet/controles/control/'
const modules = 'modules/intranet/controles/control/';

const {requested} = require(appRoot+'/utils/Control/UtilRequested');
const {numControl, esPrecarga, permisosControl} = require(appRoot+'/utils/Control/ControlesMysql/UtilCommon');
const {getUserData} = require(appRoot+'/utils/GetUser');


const {getControlInformacion, postControlInformacion} = require(appRoot+'/utils/Control/ControlesMysql/UtilInformacion');


const menuControl = false;
const nav = 'controles';

module.exports = {

    async getMenu(req, res){
        const user = await getUserData(req);
        const cnf = await requested(req);

        if(await permisosControl(cnf.control_id, cnf.control_hash)){
            const control_codigo = await numControl(cnf.control_id);
            const activePrecarga = await esPrecarga(cnf.control_id);

            res.render(modules+'menu', {layout: layout+'menu.hbs', csrfToken: req.csrfToken(), menuControl, activePrecarga, control_codigo, control_id: cnf.control_hash, user, nav});
            
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES getInformacion USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
        }
    },


};
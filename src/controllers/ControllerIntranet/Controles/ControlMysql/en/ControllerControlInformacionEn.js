const layout = '../../views/pages/intranet/controles/control/';
const modules = 'modules/intranet/controles/control/';

const {requested} = require(appRoot+'/utils/Control/UtilRequested');
const {numControl, esPrecarga, permisosControl} = require(appRoot+'/utils/Control/ControlesMysql/UtilCommon');
const {getUserData} = require(appRoot+'/utils/GetUser');


const {getControlInformacion, postControlInformacion} = require(appRoot+'/utils/Control/ControlesMysql/UtilInformacion');


const menuControl = true;
const nav = 'controles';

module.exports = {

    async getInformacionEn(req, res){
        const user = await getUserData(req);
        const cnf = await requested(req);

        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol)){
            const control_codigo = await numControl(cnf.control_id);
            const activePrecarga = await esPrecarga(cnf.control_id);
            const menuInformacion = true;

            const data = await getControlInformacion(cnf.control_id, cnf.control_hash);
            res.render(modules+'en/informacion', {layout: layout+'en/informacion.hbs', csrfToken: req.csrfToken(), menuControl, activePrecarga, menuInformacion, data, control_codigo, control_id: cnf.control_hash, user, nav});
            
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES getInformacion USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
        }
    },

    async postInformacionEn(req, res){
        const cnf = await requested(req);

        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol)){
            let response = await postControlInformacion(cnf);
            res.json(response);
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES postInformacion USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
        }

    },

};

//CONTROLADOR DEL CONTROL

const layout = '../../views/pages/intranet/controles/control/';

const modules = 'modules/intranet/controles/control/';

const {requested, requestedData} = require(appRoot+'/utils/Control/UtilRequested');
const {numControl, esPrecarga, permisosControl} = require(appRoot+'/utils/Control/ControlesMysql/UtilCommon');


const {getPalletsDatos, postPalletsDatos} = require(appRoot+'/utils/Control/ControlesMysql/UtilPallets');


const menuControl = true;

module.exports = {

    async getPallets(req, res){
        const cnf = requested(req);

        if(await permisosControl(cnf.control, cnf.user_id, cnf.rol)){
            const control_codigo = await numControl(cnf.control);
            const activePrecarga = await esPrecarga(cnf.control);
            const menuPallets = true;

            const data = await getPalletsDatos(cnf.control, cnf.user_id, cnf.rol);

            res.render(modules+'pallets', {layout: layout+'pallets.hbs', menuControl, activePrecarga, menuPallets, data, control_codigo, control_id: cnf.control, user: cnf.user});
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES getPallets USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control);
            res.redirect('/intranet/ERROR/unauthorized')
        }
    },

    async postPallets(req, res){
        const cnf = requestedData(req);

        if(await permisosControl(cnf.control, cnf.user_id, cnf.rol)){
            let response = await postPalletsDatos(cnf);
            res.json(response);
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES postPallets USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control);
            res.redirect('/intranet/ERROR/unauthorized')
        }
    },

};

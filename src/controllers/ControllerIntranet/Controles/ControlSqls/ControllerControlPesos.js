//CONTROLADOR DEL CONTROL

const layout = '../../views/pages/intranet/controles/control/';

const modules = 'modules/intranet/controles/control/';

const {requested, requestedData, requestedFotos} = require(appRoot+'/utils/Control/UtilRequested');
const {numControl, esPrecarga, permisosControl} = require(appRoot+'/utils/Control/ControlesMysql/UtilCommon');


const {getPesosDatos, postPesosDatos} = require(appRoot+'/utils/Control/ControlesMysql/UtilPesos');


const menuControl = true;

module.exports = {

    async getPesos(req, res){
        const cnf = requested(req);

        if(await permisosControl(cnf.control, cnf.user_id, cnf.rol)){
            const control_codigo = await numControl(cnf.control);
            const activePrecarga = await esPrecarga(cnf.control);
            const menuPesos = true;

            const data = await getPesosDatos(cnf.control, cnf.user_id, cnf.rol);

            res.render(modules+'pesos', {layout: layout+'pesos.hbs', menuControl, activePrecarga, menuPesos, data, control_codigo, control_id: cnf.control, user: cnf.user});
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES getPesos USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control);
            res.redirect('/intranet/ERROR/unauthorized')
        }
    },

    async postPesos(req, res){
        const cnf = requestedData(req);

        if(await permisosControl(cnf.control, cnf.user_id, cnf.rol)){
            let response = await postPesosDatos(cnf);
            res.json(response);
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES postPesos USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control);
            res.redirect('/intranet/ERROR/unauthorized')
        }
    
    },

};

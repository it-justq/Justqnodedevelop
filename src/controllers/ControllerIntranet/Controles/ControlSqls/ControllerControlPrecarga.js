//CONTROLADOR DEL CONTROL

const layout = '../../views/pages/intranet/controles/control/';

const modules = 'modules/intranet/controles/control/';

const {requested, requestedData} = require(appRoot+'/utils/Control/UtilRequested');
const {numControl, esPrecarga, permisosControl} = require(appRoot+'/utils/Control/ControlesMysql/UtilCommon');


const {getPrecargaDatos,  postPrecargaDatos} = require(appRoot+'/utils/Control/ControlesMysql/UtilPrecarga');




const menuControl = true;

module.exports = {

    async getPrecarga(req, res){
        const cnf = requested(req);
        const activePrecarga = await esPrecarga(cnf.control);

        if(await permisosControl(cnf.control, cnf.user_id, cnf.rol) && activePrecarga){
            const control_codigo = await numControl(cnf.control);
            const menuPrecarga = true;

            const data = await getPrecargaDatos(cnf.control, cnf.user_id, cnf.rol);

            res.render(modules+'precarga', {layout: layout+'precarga.hbs', menuControl, activePrecarga, menuPrecarga, data, control_codigo, control_id: cnf.control, user: cnf.user});
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES getPrecarga USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control);
            res.redirect('/intranet/ERROR/unauthorized')
        }
    },

    async postPrecarga(req, res){
        const cnf = requestedData(req);
        const activePrecarga = await esPrecarga(cnf.control);

        if(await permisosControl(cnf.control, cnf.user_id, cnf.rol) && activePrecarga){
            let response = await postPrecargaDatos(cnf);
            res.json(response);
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES postPrecarga USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control);
            res.redirect('/intranet/ERROR/unauthorized')
        }
    }

};

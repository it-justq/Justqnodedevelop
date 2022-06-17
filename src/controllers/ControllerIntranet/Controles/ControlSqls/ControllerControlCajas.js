//CONTROLADOR DEL CONTROL

const layout = '../../views/pages/intranet/controles/control/';

const modules = 'modules/intranet/controles/control/';

const {requested, requestedData} = require(appRoot+'/utils/Control/UtilRequested');
const {numControl, esPrecarga, permisosControl} = require(appRoot+'/utils/Control/ControlesMysql/UtilCommon');

const {getCajasDatos, postCajasDatos} = require(appRoot+'/utils/Control/ControlesMysql/UtilCajas');


const menuControl = true;

module.exports = {

    async getCajas(req, res){
        const cnf = requested(req);

        if(await permisosControl(cnf.control, cnf.user_id, cnf.rol)){
            const control_codigo = await numControl(cnf.control);
            const activePrecarga = await esPrecarga(cnf.control);
            const menuCajas = true;

            const data = await getCajasDatos(cnf.control, cnf.user_id, cnf.rol);

            res.render(modules+'cajas', {layout: layout+'cajas.hbs', menuControl, activePrecarga, menuCajas, data, control_codigo, control_id: cnf.control, user: cnf.user});
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES getCajas USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control);
            res.redirect('/intranet/ERROR/unauthorized')
        }
    },

    async postCajas(req, res){
        const cnf = requestedData(req);

        if(await permisosControl(cnf.control, cnf.user_id, cnf.rol)){
            let response = await postCajasDatos(cnf);
            res.json(response);
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES postCajas USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control);
            res.redirect('/intranet/ERROR/unauthorized')
        }
    },

};

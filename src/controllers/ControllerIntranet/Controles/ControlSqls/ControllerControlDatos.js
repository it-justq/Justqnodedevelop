//CONTROLADOR DEL CONTROL

const layout = '../../views/pages/intranet/controles/controlSqls/';

const modules = 'modules/intranet/controles/controlSqls/';

const {requested, requestedData} = require(appRoot+'/utils/Control/UtilRequested');
const {numControl, esPrecarga, permisosControl} = require(appRoot+'/utils/Control/ControlesSqls/UtilCommon');


const {getControlDatos, postControlDatos} = require(appRoot+'/utils/Control/ControlesSqls/UtilDatos');




const menuControl = true;

module.exports = {

    async getDatos(req, res){

        const cnf = requested(req);

        if(await permisosControl(cnf.rol)){
            const control_codigo = await numControl(cnf.control);
            const menuDatos = true;

            const data = await getControlDatos(cnf.control);

            res.render(modules+'datos', {layout: layout+'datos.hbs', data, menuControl, menuDatos, control_codigo, control_id: cnf.control, user: cnf.user});
            
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES getDatos USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control);
            res.redirect('/intranet/ERROR/unauthorized')
        }
    },

    async postDatos(req, res){
        const cnf = requestedData(req);

        if(await permisosControl(cnf.rol)){
            let response = await postControlDatos(cnf);
            res.json(response);
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES postDatos USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control);
            res.redirect('/intranet/ERROR/unauthorized')
        }

    },

};

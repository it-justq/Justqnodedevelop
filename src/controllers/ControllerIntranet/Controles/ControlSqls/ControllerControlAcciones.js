//CONTROLADOR DEL CONTROL

const layout = '../../views/pages/intranet/controles/control/';

const modules = 'modules/intranet/controles/control/';

const {requested, requestedData} = require(appRoot+'/utils/Control/UtilRequested');
const {numControl, esPrecarga, permisosControl} = require(appRoot+'/utils/Control/ControlesMysql/UtilCommon');

const {getAccionesDatos, postAccionesDatos, putAccionesDatos, deleteAccionesDatos} = require(appRoot+'/utils/Control/ControlesMysql/UtilAcciones');




const menuControl = true;

module.exports = {


    async getAcciones(req, res){
        const cnf = requested(req);


        if(await permisosControl(cnf.control, cnf.user_id, cnf.rol)){
            const control_codigo = await numControl(cnf.control);
            const activePrecarga = await esPrecarga(cnf.control);
            const menuAcciones = true;

            const data = await getAccionesDatos(cnf.control, cnf.user_id, cnf.rol);
            res.render(modules+'acciones', {layout: layout+'acciones.hbs', menuControl, menuAcciones, data, control_codigo, control_id: cnf.control, user: cnf.user});
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES getAcciones USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control);
            res.redirect('/intranet/ERROR/unauthorized')
        }

    },
    
    async postAcciones(req, res){
        const cnf = requestedData(req);

        if(await permisosControl(cnf.control, cnf.user_id, cnf.rol)){
            let response = await postAccionesDatos(cnf);
            res.json(response);
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES postAcciones USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control);
            res.redirect('/intranet/ERROR/unauthorized')
        }


    },    

    async putAcciones(req, res){
        const cnf = requestedData(req);

        if(await permisosControl(cnf.control, cnf.user_id, cnf.rol)){
            let response = await putAccionesDatos(cnf);
            res.json(response);
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES putAcciones USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control);
            res.redirect('/intranet/ERROR/unauthorized')
        }

    },    

    async deleteAcciones(req, res){
        const cnf = requestedData(req);

        if(await permisosControl(cnf.control, cnf.user_id, cnf.rol)){
            let response = await deleteAccionesDatos(cnf);
            res.json(response);
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control);
            res.redirect('/intranet/ERROR/unauthorized')
        }

    },   

};

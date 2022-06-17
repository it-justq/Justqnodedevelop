//CONTROLADOR DEL CONTROL

const layout = '../../views/pages/intranet/controles/control/';

const modules = 'modules/intranet/controles/control/';

const {requested, requestedData, requestedImagesContent} = require(appRoot+'/utils/Control/UtilRequested');

const {numControl, esPrecarga, permisosControl} = require(appRoot+'/utils/Control/ControlesMysql/UtilCommon');


const {getGruposControlDatos, postGruposControlDatos, getDatosPuntoControlFotos} = require(appRoot+'/utils/Control/ControlesMysql/UtilGruposControl');




const menuControl = true;

module.exports = {

    async getGruposControl(req, res){
        const cnf = requested(req);

        if(await permisosControl(cnf.control, cnf.user_id, cnf.rol)){
            const control_codigo = await numControl(cnf.control);
            const activePrecarga = await esPrecarga(cnf.control);
            const menuGc = true;
            const data = await getGruposControlDatos(cnf.control, cnf.user_id, cnf.rol);

            res.render(modules+'grupos-control', {layout: layout+'grupos-control.hbs',  menuControl, activePrecarga, menuGc, data, control_codigo, control_id: cnf.control, user: cnf.user});
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES getGruposControl USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control);
            res.redirect('/intranet/ERROR/unauthorized')
        }
    },

    async postGruposControl(req, res){
        const cnf = requestedData(req);

        if(await permisosControl(cnf.control, cnf.user_id, cnf.rol)){
            let response = await postGruposControlDatos(cnf);
            res.json(response);
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES postGruposControl USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control);
            res.redirect('/intranet/ERROR/unauthorized')
        }

    },


    //FOTOS DE LOS GRUPOS DE CONTROL

    async getPuntoControlFotos(req, res){
        const cnf = requestedImagesContent(req);

        if(await permisosControl(cnf.control, cnf.user_id, cnf.rol)){
            const control_codigo = await numControl(cnf.control);
            const menuPcFotos = true;

            const data = await getDatosPuntoControlFotos(cnf);

            console.log(data)

            res.render(modules+'punto-control-fotos', {layout: layout+'punto-control-fotos.hbs', menuControl, menuPcFotos, data: data.fotos, pc_nombre: data.pc_nombre, control_codigo, control_id: cnf.control, user: cnf.user});
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES getPuntoControlFotos USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control);
            res.redirect('/intranet/ERROR/unauthorized')
        }
    },

};

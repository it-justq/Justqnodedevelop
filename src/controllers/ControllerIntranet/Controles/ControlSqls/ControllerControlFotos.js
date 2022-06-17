//CONTROLADOR DEL CONTROL

const layout = '../../views/pages/intranet/controles/control/';

const modules = 'modules/intranet/controles/control/';

const {requested, requestedImages} = require(appRoot+'/utils/Control/UtilRequested');
const {numControl, esPrecarga, permisosControl} = require(appRoot+'/utils/Control/ControlesMysql/UtilCommon');


const {getFotosControl, postFotosControl} = require(appRoot+'/utils/Control/ControlesMysql/UtilFotos');



const menuControl = true;

module.exports = {

    async getFotos(req, res){
        const cnf = requested(req);
        const control_codigo = await numControl(cnf.control);
        const activePrecarga = await esPrecarga(cnf.control);
        const menuFotos = true;

        const data = await getFotosControl(cnf.control, cnf.user_id, cnf.rol);


        if(await permisosControl(cnf.control, cnf.user_id, cnf.rol)){
            res.render(modules+'fotos', {layout: layout+'fotos.hbs', menuControl, activePrecarga, menuFotos, data, control_codigo, control_id: cnf.control, user: cnf.user});
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES getFotos USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control);
            res.redirect('/intranet/ERROR/unauthorized');
            
        }
    },

    async postFotos(req, res){
        const cnf = requestedImages(req);
        const control_id = cnf.control;
      
        if(await permisosControl(cnf.control, cnf.user_id, cnf.rol)){
            let response = await postFotosControl(cnf);
            if(response.status === 'ok'){
                return res.redirect('/intranet/control/'+control_id+'/fotos');
            }else{
                return res.redirect('/intranet/control/'+control_id+'/fotos');
            }
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES postFotos USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control);
            return res.redirect('/intranet/ERROR/unauthorized');
        }
    },

};

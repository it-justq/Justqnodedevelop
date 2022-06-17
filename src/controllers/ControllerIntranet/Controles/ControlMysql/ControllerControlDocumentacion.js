const layout = '../../views/pages/intranet/controles/control/';
const modules = 'modules/intranet/controles/control/';

const {requested} = require(appRoot+'/utils/Control/UtilRequested');
const {numControl, esPrecarga, permisosControl} = require(appRoot+'/utils/Control/ControlesMysql/UtilCommon');
const {getUserData} = require(appRoot+'/utils/GetUser');


const {getDocumentacionDatos, postDocumentacionDatos, deleteDocumentacionAllDatos, deleteDocumentacionDatos} = require(appRoot+'/utils/Control/ControlesMysql/UtilDocumentacion');



const menuControl = true;
const nav = 'controles';

module.exports = {

    async getDocumentacion(req, res){
        const user = await getUserData(req);
        const cnf = await requested(req);

        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol)){
            const control_codigo = await numControl(cnf.control_id);
            const activePrecarga = await esPrecarga(cnf.control_id);
            const menuDocumentacion = true;
    
            const data = await getDocumentacionDatos(cnf.control_id, cnf.control_hash);

            switch(data.status){
                case 'ok':
                    res.render(modules+'documentacion', {layout: layout+'documentacion.hbs', csrfToken: req.csrfToken(), menuControl, activePrecarga, menuDocumentacion, data, control_codigo, control_id: cnf.control_hash, user, nav});
                    break;
                case 'error':
                    res.redirect('/ERROR/control/'+cnf.control_hash+'/documentacion');
                break;
            }

        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES getDocumentacion USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
            
        }
    },

    async postDocumentacion(req, res){
        const cnf = await requested(req);
      
        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol)){

            let response = await postDocumentacionDatos(cnf);
            if(response.status === 'ok'){
                return res.redirect('/intranet/control/'+cnf.control_hash+'/documentacion');
            }else{
                return res.redirect('/intranet/control/'+cnf.control_hash+'/documentacion');
            }
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES postDocumentacion USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
        }
    },

    async deleteAllDocumentacion(req, res){
        const cnf = await requested(req);
      
        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol)){
            let response = await deleteDocumentacionAllDatos(cnf);
            if(response.status === 'ok'){
                res.json(response);
            }else{
                res.json(response);
            }
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES deleteAllDocumentacion USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
        }
    },

    async deleteDocumentacion(req, res){
        const cnf = await requested(req);

        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol)){
            let response = await deleteDocumentacionDatos(cnf);
            if(response.status === 'ok'){
                res.json(response);
            }else{
                res.json(response);
            }
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES deleteDocumentacion USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
        }
    },

};

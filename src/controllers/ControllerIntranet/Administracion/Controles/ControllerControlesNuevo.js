const layout = '../../views/pages/intranet/administracion/controles/';
const modules = 'modules/intranet/administracion/controles/';

const {requested} = require(appRoot+'/utils/Admin/UtilRequested');
const {isPermissedTo} = require(appRoot+'/utils/Permissions');

const {postControlTipoNuevo} = require(appRoot+'/utils/Admin/Controles/UtilNuevo');

const {getUserData} = require(appRoot+'/utils/GetUser');


const menuAdmin = true;
const nav = 'administracion-controles';

module.exports = {

    async getNuevoTipoControl(req, res){

        const cnf = requested(req);
        const user = getUserData(req);

        if(await isPermissedTo(cnf.user_id, cnf.rol, 'ADMIN-CONTROLES')){

            const user = getUserData(req);
            res.render(modules+'nuevo', {layout: layout+'nuevo.hbs', csrfToken: req.csrfToken(), menuAdmin, user: cnf.user, user, nav});
        
        }else{
            res.redirect('/ERROR/unauthorized');
        }
    },

    async postNuevoTipoControl(req, res){
        const cnf = requested(req);
        if(await isPermissedTo(cnf.user_id, cnf.rol, 'ADMIN-CONTROLES')){
            let response = await postControlTipoNuevo(cnf);
            
            if(response.status != "error"){
                res.redirect('/intranet/administracion/controles/tipo-control/' + response.tipo_control_id);
            }else{
                res.redirect('/ERROR/error');
            }
        }else{
            res.redirect('/ERROR/unauthorized');
        }
    },

    async postEditarTipoControl(req, res){
        const cnf = requested(req);
        
        if(await isPermissedTo(cnf.user_id, cnf.rol, 'ADMIN-CONTROLES')){
            let response = await postTipoControlEditar(cnf);
            res.json(response);
        }else{
            res.redirect('/ERROR/unauthorized');
        }
    },

};
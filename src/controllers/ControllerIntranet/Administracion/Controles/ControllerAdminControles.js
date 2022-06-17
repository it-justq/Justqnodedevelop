const layout = '../../views/pages/intranet/administracion/controles/';
const modules = 'modules/intranet/administracion/controles/';

const {requested, requestedSearch} = require(appRoot+'/utils/Admin/UtilRequested');
const {isPermissedTo} = require(appRoot+'/utils/Permissions');

const {getControlData, postControlTipo, postTipoControlEditar, postGrupoControlNuevo, postPuntoControlNuevo} = require(appRoot+'/utils/Admin/Controles/UtilControl');
const {getControlesList} = require(appRoot+'/utils/Admin/Controles/UtilGetControles');

const {getUserData} = require(appRoot+'/utils/GetUser');


const menuAdmin = true;
const nav = 'administracion-controles';

module.exports = {

    async getControles(req, res){

        const cnf = requested(req);
        const user = getUserData(req);

        if(await isPermissedTo(cnf.user_id, cnf.rol, 'ADMIN-CONTROLES')){

            let data = await getControlesList('', 'TOTAL', 'es');

            if(data.status != 'error'){
                data = data.data;
                res.render(modules+'main', {layout: layout+'main.hbs', csrfToken: req.csrfToken(), controles_total: true, menuAdmin, user, nav, data});
            }else{
                res.redirect('/ERROR/error');
            }
        }else{
            res.redirect('/ERROR/unauthorized');
        }
        
    },

    async getControlesSearch(req, res){

        const cnf = requestedSearch(req);
        const user = getUserData(req);

        if(await isPermissedTo(cnf.user_id, cnf.rol, 'ADMIN-CONTROLES')){

            let data = await getControlesList(cnf, 'SEARCH', 'es');

            if(data.status != 'error'){
                data = data.data;
                res.render(modules+'main', {layout: layout+'main.hbs', data, csrfToken: req.csrfToken(), controles_search: true, menuAdmin, user, nav});
            }else{
                res.redirect('/ERROR/error');
            }

        }else{
            res.redirect('/ERROR/unauthorized');
        }
        
    },

    async getTipoControl(req, res){

        const cnf = requested(req);

        if(await isPermissedTo(cnf.user_id, cnf.rol, 'ADMIN-CONTROLES')){

            let data = await getControlData(cnf.id);
            const user = getUserData(req);

            if(data.status != 'error'){
                data = data.data;
                res.render(modules+'control/main', {layout: layout+'control/main.hbs', csrfToken: req.csrfToken(), data, menuAdmin, usuario_id: cnf.id, user, nav});

            }else{
                res.redirect('/ERROR/error');
            }

        }else{
            res.redirect('/ERROR/unauthorized');
        }
        
    },

    async postTipoControl(req, res){
        const cnf = requested(req);
        if(await isPermissedTo(cnf.user_id, cnf.rol, 'ADMIN-CONTROLES')){
            let response = await postControlTipo(cnf);
            
            if(response.status != "error"){
                res.redirect('/intranet/administracion/controles');
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

    async postNuevoGrupoControl(req, res){
        const cnf = requested(req);
        if(await isPermissedTo(cnf.user_id, cnf.rol, 'ADMIN-CONTROLES')){
            let response = await postGrupoControlNuevo(cnf);

            if(response.status != "error"){
                res.redirect('/intranet/administracion/controles/tipo-control/'+cnf.data.tipo_control);
            }else{
                res.redirect('/ERROR/error');
            }
        }else{
            res.redirect('/ERROR/unauthorized');
        }
    },

    async postNuevoPuntoControl(req, res){
        const cnf = requested(req);
        if(await isPermissedTo(cnf.user_id, cnf.rol, 'ADMIN-CONTROLES')){
            let response = await postPuntoControlNuevo(cnf);
            res.json(response);
        }else{
            res.redirect('/ERROR/unauthorized');
        }
    },

};
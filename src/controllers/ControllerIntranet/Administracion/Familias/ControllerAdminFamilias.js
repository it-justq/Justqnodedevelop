const layout = '../../views/pages/intranet/administracion/familias/';
const modules = 'modules/intranet/administracion/familias/';

const {requested} = require(appRoot+'/utils/Admin/UtilRequested');
const {isPermissedTo} = require(appRoot+'/utils/Permissions');

const {getFamiliaData} = require(appRoot+'/utils/Admin/familias/familia/UtilFamilia');
const {getFamiliasList} = require(appRoot+'/utils/Admin/familias/UtilGetFamilias');

const {getUserData} = require(appRoot+'/utils/GetUser');

const {postFamiliaEditar, postVariedadEditar, postVariedadNuevo} = require(appRoot+'/utils/Admin/Familias/Familia/UtilEditar');


const menuAdmin = true;
const nav = 'administracion-familias';

module.exports = {

    async getFamilias(req, res){

        const cnf = requested(req);
        const user = getUserData(req);

        if(await isPermissedTo(cnf.user_id, cnf.rol, 'ADMIN-FAMILIAS')){

            const data = await getFamiliasList(cnf, 'TOTAL');

            res.render(modules+'main', {layout: layout+'main.hbs', csrfToken: req.csrfToken(), data, menuAdmin, user, nav});
        }else{
            res.redirect('/ERROR/unauthorized');
        }
        
    },

    async getFamiliasSearch(req, res){

        const cnf = requested(req);

        if(await isPermissedTo(cnf.user_id, cnf.rol, 'ADMIN-FAMILIAS')){

            const data = await getFamiliasList(cnf, 'SEARCH');
            const user = getUserData(req);

            res.render(modules+'main', {layout: layout+'main.hbs', csrfToken: req.csrfToken(), data, menuAdmin, familias_search: true, user, nav});
        }else{
            res.redirect('/ERROR/unauthorized');
        }
        
    },

    async getFamilia(req, res){

        const cnf = requested(req);

        if(await isPermissedTo(cnf.user_id, cnf.rol, 'ADMIN-FAMILIAS')){

            let data = await getFamiliaData(cnf.id);
            const user = getUserData(req);

            if(data.status != 'error'){
                data = data.data;
                res.render(modules+'familia/datos', {layout: layout+'familia/datos.hbs', csrfToken: req.csrfToken(), data, menuAdmin, usuario_id: cnf.id, user, nav});

            }else{
                res.redirect('/ERROR/error');
            }


        }else{
            res.redirect('/ERROR/unauthorized');
        }
        
    },

    async postEditarFamilia(req, res){
        const cnf = requested(req);
        
        if(await isPermissedTo(cnf.user_id, cnf.rol, 'ADMIN-FAMILIAS')){
            let response = await postFamiliaEditar(cnf);

            if(response.status != "error"){
                res.redirect('/intranet/administracion/familias');
            }else{
                res.redirect('/ERROR/error');
            }
        }else{
            res.redirect('/ERROR/unauthorized');
        }
    },

    async postEditarVariedad(req, res){
        const cnf = requested(req);
        
        if(await isPermissedTo(cnf.user_id, cnf.rol, 'ADMIN-FAMILIAS')){
            let response = await postVariedadEditar(cnf);

            if(response.status != "error"){
                res.redirect('/intranet/administracion/familias');
            }else{
                res.redirect('/ERROR/error');
            }
        }else{
            res.redirect('/ERROR/unauthorized');
        }
    },

    async postNuevoVariedad(req, res){
        const cnf = requested(req);
        
        if(await isPermissedTo(cnf.user_id, cnf.rol, 'ADMIN-FAMILIAS')){
            let response = await postVariedadNuevo(cnf);

            if(response.status != "error"){
                res.redirect('/intranet/administracion/familias');
            }else{
                res.redirect('/ERROR/error');
            }
        }else{
            res.redirect('/ERROR/unauthorized');
        }
    },

};
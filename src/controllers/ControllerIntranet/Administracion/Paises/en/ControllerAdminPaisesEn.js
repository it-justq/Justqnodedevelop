const layout = '../../views/pages/intranet/administracion/paises/';
const modules = 'modules/intranet/administracion/paises/';

const {requested} = require(appRoot+'/utils/Admin/UtilRequested');
const {isPermissedTo} = require(appRoot+'/utils/Permissions');

const {getPaisesList} = require(appRoot+'/utils/Admin/Paises/UtilGetPaises');
const {postNuevoPais} = require(appRoot+'/utils/Admin/Paises/Pais/UtilNuevo');

const {getUserData} = require(appRoot+'/utils/GetUser');


const menuAdmin = true;
const nav = 'administracion-paises';

module.exports = {

    async getPaisesEn(req, res){

        const cnf = requested(req);
        const user = getUserData(req);

        if(await isPermissedTo(cnf.user_id, cnf.rol, 'ADMIN-PAISES')){

            let data = await getPaisesList(cnf, 'TOTAL');

            if(data.status != 'error'){
                data = data.data;
                res.render(modules+'en/main', {layout: layout+'en/main.hbs', csrfToken: req.csrfToken(), data, menuAdmin, user, nav});

            }else{
                res.redirect('/ERROR/data');
            }

        }else{
            res.redirect('/ERROR/unauthorized');
        }
        
    },

    async getPaisesSearchEn(req, res){

        const cnf = requested(req);
        const user = getUserData(req);

        if(await isPermissedTo(cnf.user_id, cnf.rol, 'ADMIN-PAISES')){

            let data = await getPaisesList(cnf, 'SEARCH');

            if(data.status = 'error'){
                data = data.data;
                res.render(modules+'en/main', {layout: layout+'en/main.hbs', csrfToken: req.csrfToken(), data, menuAdmin, paises_search: true, user, nav});
            }else{
                res.redirect('/ERROR/unauthorized');
            }

        }else{
            res.redirect('/ERROR/unauthorized');
        }
        
    },

    async getPaisesNuevoEn(req, res){

        const cnf = requested(req);

        if(await isPermissedTo(cnf.user_id, cnf.rol, 'ADMIN-PAISES')){

            const user = getUserData(req);
            
            res.render(modules+'en/nuevo', {layout: layout+'en/nuevo.hbs', csrfToken: req.csrfToken(), menuAdmin, pagina: cnf.pagina, user: cnf.user, user, nav});
        }else{
            res.redirect('/ERROR/unauthorized');
        }
        
    },

    async postPaisesNuevoEn(req, res){
        const cnf = requested(req);

        if(await isPermissedTo(cnf.user_id, cnf.rol, 'ADMIN-PAISES')){
            let response = await postNuevoPais(cnf);
            
            if(response.status != "error"){
                res.redirect('/intranet/administracion/paises/en');
            }else{
                res.redirect('/ERROR/error');
            }
        }else{
            res.redirect('/ERROR/unauthorized');
        }

        
    },

};
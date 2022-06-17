const layout = '../../views/pages/intranet/administracion/plataformas/';
const modules = 'modules/intranet/administracion/plataformas/';

const {requested} = require(appRoot+'/utils/Admin/UtilRequested');
const {isPermissedTo} = require(appRoot+'/utils/Permissions');
const {getUserData} = require(appRoot+'/utils/GetUser');

const {postPlataformaNuevo} = require(appRoot+'/utils/Admin/Plataformas/Plataforma/UtilNuevo');

const menuAdmin = true;
const nav = 'administracion-plataformas';

module.exports = {

    async getNuevoPlataforma(req, res){

        const cnf = requested(req);

        if(await isPermissedTo(cnf.user_id, cnf.rol, 'ADMIN-PLATAFORMAS')){

            const user = getUserData(req);

            res.render(modules+'plataforma', {layout: layout+'plataforma.hbs', csrfToken: req.csrfToken(), menuAdmin, pagina: cnf.pagina, user: cnf.user, user, nav});
        }else{
            res.redirect('/ERROR/unauthorized');
        }
        
    },

    async postNuevoPlataforma(req, res){
        const cnf = requested(req);

        if(await isPermissedTo(cnf.user_id, cnf.rol, 'ADMIN-PLATAFORMAS')){
            let response = await postPlataformaNuevo(cnf);
            
            if(response.status != "error"){
                res.redirect('/intranet/administracion/plataformas');
            }else{
                res.redirect('/ERROR/error');
            }
        }else{
            res.redirect('/ERROR/unauthorized');
        }

        
    },


};
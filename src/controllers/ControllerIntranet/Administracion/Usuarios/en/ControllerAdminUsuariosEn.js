const layout = '../../views/pages/intranet/administracion/usuarios/';
const modules = 'modules/intranet/administracion/usuarios/';

const {requested, requestedSearch} = require(appRoot+'/utils/Admin/UtilRequested');
const {isPermissedTo} = require(appRoot+'/utils/Permissions');

const {getUsuarioData} = require(appRoot+'/utils/Admin/Usuarios/UtilUsuario');
const {getUsuariosList} = require(appRoot+'/utils/Admin/usuarios/UtilGetUsuarios');

const {getUserData} = require(appRoot+'/utils/GetUser');


const menuAdmin = true;
const nav = 'administracion-usuarios';

module.exports = {

    async getUsuariosEn(req, res){

        const cnf = requested(req);

        if(await isPermissedTo(cnf.user_id, cnf.rol, 'ADMIN-USUARIOS')){

            const data = await getUsuariosList(cnf.data, 'TOTAL', 'en');
            const user = getUserData(req);


            res.render(modules+'en/main', {layout: layout+'en/main.hbs', csrfToken: req.csrfToken(), usuarios_total: true, menuAdmin, pagina: cnf.pagina, user, nav});
        }else{
            res.redirect('/ERROR/unauthorized');
        }
        
    },

    async getUsuariosSearchEn(req, res){

        const cnf = requestedSearch(req);

        if(await isPermissedTo(cnf.user_id, cnf.rol, 'ADMIN-USUARIOS')){

            const data = await getUsuariosList(cnf.data, 'SEARCH', 'en');
            const user = getUserData(req);

            res.render(modules+'en/main', {layout: layout+'en/main.hbs', data, csrfToken: req.csrfToken(), usuarios_search: true, menuAdmin, pagina: cnf.pagina, user, nav});
        }else{
            res.redirect('/ERROR/unauthorized');
        }
        
    },

    async getUsuarioEn(req, res){

        const cnf = requested(req);

        if(await isPermissedTo(cnf.user_id, cnf.rol, 'ADMIN-USUARIOS')){

            const data = await getUsuarioData(cnf.id);
            const user = getUserData(req);


            if(data.usuario.usuario_rol_id === 1 || data.usuario.usuario_rol_id === 2){
                res.render(modules+'usuario/en/main', {layout: layout+'usuario/en/main.hbs', data, csrfToken: req.csrfToken(), menuAdmin, usuario_id: cnf.id, user, nav, menuTecnicoAdmin: true});
            }else if(data.usuario.usuario_rol_id === 3){
                res.render(modules+'usuario/en/main', {layout: layout+'usuario/en/main.hbs', data, csrfToken: req.csrfToken(), menuAdmin, usuario_id: cnf.id, user, nav, menuClienteAdmin: true});
            }

        }else{
            res.redirect('/ERROR/unauthorized');
        }
        
    },

};
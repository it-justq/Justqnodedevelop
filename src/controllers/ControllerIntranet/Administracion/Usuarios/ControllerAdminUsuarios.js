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

    async getUsuarios(req, res){

        const cnf = requested(req);

        if(await isPermissedTo(cnf.user_id, cnf.rol, 'ADMIN-USUARIOS')){

            const data = await getUsuariosList(cnf.data, 'TOTAL', 'es');
            const user = getUserData(req);


            res.render(modules+'main', {layout: layout+'main.hbs', csrfToken: req.csrfToken(), usuarios_total: true, menuAdmin, pagina: cnf.pagina, user, nav});
        }else{
            res.redirect('/ERROR/unauthorized');
        }
        
    },

    async getUsuariosSearch(req, res){

        const cnf = requestedSearch(req);

        if(await isPermissedTo(cnf.user_id, cnf.rol, 'ADMIN-USUARIOS')){

            const data = await getUsuariosList(cnf.data, 'SEARCH', 'es');
            const user = getUserData(req);

            res.render(modules+'main', {layout: layout+'main.hbs', data, csrfToken: req.csrfToken(), usuarios_search: true, menuAdmin, pagina: cnf.pagina, user, nav});
        }else{
            res.redirect('/ERROR/unauthorized');
        }
        
    },

    async getUsuario(req, res){

        const cnf = requested(req);

        if(await isPermissedTo(cnf.user_id, cnf.rol, 'ADMIN-USUARIOS')){

            const data = await getUsuarioData(cnf.id);
            const user = getUserData(req);


            if(data.usuario.usuario_rol_id === 1 || data.usuario.usuario_rol_id === 2){
                res.render(modules+'usuario/main', {layout: layout+'usuario/main.hbs', data, csrfToken: req.csrfToken(), menuAdmin, usuario_id: cnf.id, user, nav, menuTecnicoAdmin: true});
            }else if(data.usuario.usuario_rol_id === 3){
                res.render(modules+'usuario/main', {layout: layout+'usuario/main.hbs', data, csrfToken: req.csrfToken(), menuAdmin, usuario_id: cnf.id, user, nav, menuClienteAdmin: true});
            }

        }else{
            res.redirect('/ERROR/unauthorized');
        }
        
    },

};
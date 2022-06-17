const layout = '../../views/pages/intranet/administracion/usuarios/';
const modules = 'modules/intranet/administracion/usuarios/';

const {requested} = require(appRoot+'/utils/Admin/UtilRequested');
const {isPermissedTo} = require(appRoot+'/utils/Permissions');
const {getUserData} = require(appRoot+'/utils/GetUser');

const {getUsuarioNuevo, postUsuarioNuevo} = require(appRoot+'/utils/Admin/Usuarios/Usuario/UtilNuevo');


const menuAdmin = true;
const nav = 'administracion-usuarios';

module.exports = {

    async getNuevoUsuario(req, res){

        const cnf = requested(req);

        if(await isPermissedTo(cnf.user_id, cnf.rol, 'ADMIN-USUARIOS')){

            const data = await getUsuarioNuevo('es');
            const user = getUserData(req);

            res.render(modules+'nuevo', {layout: layout+'nuevo.hbs', csrfToken: req.csrfToken(), data, menuAdmin, pagina: cnf.pagina, user, nav});
        }else{
            res.redirect('/ERROR/unauthorized');
        }
        
    },

    async postNuevoUsuario(req, res){

        const cnf = requested(req);

        if(await isPermissedTo(cnf.user_id, cnf.rol, 'ADMIN-USUARIOS')){
            
            const user_generated = await postUsuarioNuevo(cnf);

            if(user_generated.status != 'error'){
                res.redirect('/intranet/administracion/usuarios/usuario/' + user_generated.usuario_id);
            }else{
                res.redirect('/ERROR/error');
            }
        }else{
            res.redirect('/ERROR/unauthorized');
        }
        
    },


};
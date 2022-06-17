const layout = '../../views/pages/intranet/administracion/usuarios/';
const modules = 'modules/intranet/administracion/usuarios/';

const {requested} = require(appRoot+'/utils/Admin/UtilRequested');
const {isPermissedTo} = require(appRoot+'/utils/Permissions');
const {getUserData} = require(appRoot+'/utils/GetUser');

const {getUsuarioNuevo, postUsuarioNuevo} = require(appRoot+'/utils/Admin/Usuarios/Usuario/UtilNuevo');


const menuAdmin = true;
const nav = 'administracion-usuarios';

module.exports = {

    async getNuevoUsuarioEn(req, res){

        const cnf = requested(req);

        if(await isPermissedTo(cnf.user_id, cnf.rol, 'ADMIN-USUARIOS')){

            const data = await getUsuarioNuevo('en');
            const user = getUserData(req);

            res.render(modules+'en/nuevo', {layout: layout+'en/nuevo.hbs', csrfToken: req.csrfToken(), data, menuAdmin, pagina: cnf.pagina, user, nav});
        }else{
            res.redirect('/ERROR/unauthorized');
        }
        
    },

    async postNuevoUsuarioEn(req, res){

        const cnf = requested(req);

        if(await isPermissedTo(cnf.user_id, cnf.rol, 'ADMIN-USUARIOS')){
            
            const user_generated = await postUsuarioNuevo(cnf);

            if(user_generated.status != 'error'){
                res.redirect('/intranet/administracion/usuarios/en/usuario/' + user_generated.usuario_id);
            }else{
                res.redirect('/ERROR/error');
            }
        }else{
            res.redirect('/ERROR/unauthorized');
        }
        
    },


};
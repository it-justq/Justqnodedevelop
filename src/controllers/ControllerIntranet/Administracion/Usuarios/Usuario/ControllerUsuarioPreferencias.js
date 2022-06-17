const layout = '../../views/pages/intranet/administracion/usuarios/usuario/';
const modules = 'modules/intranet/administracion/usuarios/usuario/';

const {requested} = require(appRoot+'/utils/Admin/UtilRequested');
const {isPermissedTo} = require(appRoot+'/utils/Permissions');
const {getUserData} = require(appRoot+'/utils/GetUser');

const {getUsuarioPreferencias, postUsuarioPreferencias} = require(appRoot+'/utils/Admin/Usuarios/Usuario/UtilPreferencias');


const menuAdmin = true;
const nav = 'administracion-usuarios';

module.exports = {

    async getPreferenciasUsuario(req, res){

        const cnf = requested(req);

        if(await isPermissedTo(cnf.user_id, cnf.rol, 'ADMIN-USUARIOS')){

            let data = await getUsuarioPreferencias(cnf.id);
            const user = getUserData(req);

            if(data.status != 'error'){
                data = data.data;
                res.render(modules+'preferencias', {layout: layout+'preferencias.hbs', csrfToken: req.csrfToken(), data, menuAdmin, pagina: cnf.pagina, user, nav});
            }else{
                res.redirect('/ERROR/error');
            }

        }else{
            res.redirect('/ERROR/unauthorized');
        }
        
    },

    async postPreferenciasUsuario(req, res){

        const cnf = requested(req);

        if(await isPermissedTo(cnf.user_id, cnf.rol, 'ADMIN-USUARIOS')){
            let response = await postUsuarioPreferencias(cnf);
            res.json(response);
        }else{
            res.redirect('/ERROR/unauthorized');
        }

        
    },


};
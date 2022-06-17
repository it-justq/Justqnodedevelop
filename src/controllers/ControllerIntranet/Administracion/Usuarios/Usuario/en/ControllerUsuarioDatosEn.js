const layout = '../../views/pages/intranet/administracion/usuarios/usuario/';
const modules = 'modules/intranet/administracion/usuarios/usuario/';

const {requested} = require(appRoot+'/utils/Admin/UtilRequested');
const {isPermissedTo} = require(appRoot+'/utils/Permissions');
const {getUserData} = require(appRoot+'/utils/GetUser');

const {getUsuarioData, postUsuarioData} = require(appRoot+'/utils/Admin/Usuarios/Usuario/UtilDatos');


const menuAdmin = true;
const nav = 'administracion-usuarios';

module.exports = {

    async getDatosUsuarioEn(req, res){

        const cnf = requested(req);

        if(await isPermissedTo(cnf.user_id, cnf.rol, 'ADMIN-USUARIOS')){

            const data = await getUsuarioData(cnf.id, 'en');
            const user = getUserData(req);

            res.render(modules+'en/datos', {layout: layout+'en/datos.hbs', csrfToken: req.csrfToken(), data, menuAdmin, pagina: cnf.pagina, user, nav});
        }else{
            res.redirect('/ERROR/unauthorized');
        }
        
    },

    async postDatosUsuarioEn(req, res){

        const cnf = requested(req);

        if(await isPermissedTo(cnf.user_id, cnf.rol, 'ADMIN-USUARIOS')){
            let response = await postUsuarioData(cnf);
            res.json(response);
        }else{
            res.redirect('/ERROR/unauthorized');
        }

        
    },


};
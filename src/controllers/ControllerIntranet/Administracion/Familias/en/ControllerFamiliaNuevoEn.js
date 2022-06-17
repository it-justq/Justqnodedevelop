const layout = '../../views/pages/intranet/administracion/familias/';
const modules = 'modules/intranet/administracion/familias/';

const {requested} = require(appRoot+'/utils/Admin/UtilRequested');
const {isPermissedTo} = require(appRoot+'/utils/Permissions');
const {getUserData} = require(appRoot+'/utils/GetUser');

const {postFamiliaNuevo} = require(appRoot+'/utils/Admin/Familias/Familia/UtilNuevo');

const menuAdmin = true;
const nav = 'administracion-familias';

module.exports = {

    async getNuevoFamiliaEn(req, res){

        const cnf = requested(req);

        if(await isPermissedTo(cnf.user_id, cnf.rol, 'ADMIN-FAMILIAS')){

            //const data = await getFamiliaNuevo();
            const user = getUserData(req);

            
            res.render(modules+'en/nuevo', {layout: layout+'en/nuevo.hbs', csrfToken: req.csrfToken(), menuAdmin, pagina: cnf.pagina, user: cnf.user, user, nav});
        }else{
            res.redirect('/ERROR/unauthorized');
        }
        
    },

    async postNuevoFamiliaEn(req, res){
        const cnf = requested(req);

        if(await isPermissedTo(cnf.user_id, cnf.rol, 'ADMIN-FAMILIAS')){
            let response = await postFamiliaNuevo(cnf);
            
            if(response.status != "error"){
                res.redirect('/intranet/administracion/familias/en');
            }else{
                res.redirect('/ERROR/error');
            }
        }else{
            res.redirect('/ERROR/unauthorized');
        }

        
    },


};
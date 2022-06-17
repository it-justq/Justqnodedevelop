const layout = '../../views/pages/intranet/administracion/plataformas/';
const modules = 'modules/intranet/administracion/plataformas/';

const {requested} = require(appRoot+'/utils/Admin/UtilRequested');
const {isPermissedTo} = require(appRoot+'/utils/Permissions');

const {getPlataformaData} = require(appRoot+'/utils/Admin/Plataformas/UtilPlataforma');
const {getPlataformasList, getPlataformaSearch} = require(appRoot+'/utils/Admin/Plataformas/UtilGetPlataformas');
const {postPlataformaEditar} = require(appRoot+'/utils/Admin/Plataformas/Plataforma/UtilEditarPlataformas');

const {getUserData} = require(appRoot+'/utils/GetUser');


const menuAdmin = true;
const nav = 'administracion-plataformas';

module.exports = {

    async getPlataformas(req, res){

        const user = getUserData(req);
        const cnf = requested(req);

        if(await isPermissedTo(cnf.user_id, cnf.rol, 'ADMIN-PLATAFORMAS')){

            let data = await getPlataformasList('es');
            
            if(data.status != 'error'){
                data = data.data;
                res.render(modules+'main', {layout: layout+'main.hbs', csrfToken: req.csrfToken(), data, menuAdmin, pagina: cnf.pagina, user: cnf.user, nav, user});
            }else{
                res.redirect('/ERROR/error');
            }
            
        }else{
            res.redirect('/ERROR/unauthorized');
        }
        
    },

    async getPlataformasSearch(req, res){

        const user = getUserData(req);
        const cnf = requested(req);
        
        if(await isPermissedTo(cnf.user_id, cnf.rol, 'ADMIN-PLATAFORMAS')){

            let data = await getPlataformaSearch(cnf.data.plataforma_nombre, 'es');

            if(data.status!='error'){
            data = data.data;
            res.render(modules+'main', {layout: layout+'main.hbs', csrfToken: req.csrfToken(), data, menuAdmin, pagina: cnf.pagina, user: cnf.user, nav, user});
            }else{
                res.redirect('/ERROR/error');
            }
        }else{
            res.redirect('/ERROR/unauthorized');
        }
        
    },

    async getPlataforma(req, res){

        const user = getUserData(req);
        const cnf = requested(req);

        if(await isPermissedTo(cnf.user_id, cnf.rol, 'ADMIN-PLATAFORMAS')){

            const plataforma = await getPlataformaData(cnf.id);
            res.render(modules+'plataforma', {layout: layout+'plataforma.hbs', csrfToken: req.csrfToken(), plataforma, menuAdmin, usuario_id: cnf.id, user: cnf.user, nav, user});

        }else{
            res.redirect('/ERROR/unauthorized');
        }
        
    },

    async postEditarPlataforma(req, res){
        const cnf = requested(req);
        
        if(await isPermissedTo(cnf.user_id, cnf.rol, 'ADMIN-PLATAFORMAS')){
            let response = await postPlataformaEditar(cnf);

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
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

    async getPlataformasEn(req, res){

        const user = getUserData(req);
        const cnf = requested(req);
        console.log(user);

        if(await isPermissedTo(cnf.user_id, cnf.rol, 'ADMIN-PLATAFORMAS')){

            let data = await getPlataformasList('en');
            
            if(data.status != 'error'){
                data = data.data;
                res.render(modules+'en/main', {layout: layout+'en/main.hbs', csrfToken: req.csrfToken(), data, menuAdmin, pagina: cnf.pagina, user: cnf.user, nav, user});
            }else{
                res.redirect('/ERROR/error');
            }
            
        }else{
            res.redirect('/ERROR/unauthorized');
        }
        
    },

    async getPlataformasSearchEn(req, res){

        const user = getUserData(req);
        const cnf = requested(req);
        
        if(await isPermissedTo(cnf.user_id, cnf.rol, 'ADMIN-PLATAFORMAS')){

            let data = await getPlataformaSearch(cnf.data.plataforma_nombre, 'en');

            if(data.status!='error'){
            data = data.data;
            res.render(modules+'en/main', {layout: layout+'en/main.hbs', csrfToken: req.csrfToken(), data, menuAdmin, pagina: cnf.pagina, user: cnf.user, nav, user});
            }else{
                res.redirect('/ERROR/error');
            }
        }else{
            res.redirect('/ERROR/unauthorized');
        }
        
    },

    async getPlataformaEn(req, res){

        const user = getUserData(req);
        const cnf = requested(req);

        if(await isPermissedTo(cnf.user_id, cnf.rol, 'ADMIN-PLATAFORMAS')){

            const plataforma = await getPlataformaData(cnf.id);
            res.render(modules+'en/plataforma', {layout: layout+'en/plataforma.hbs', csrfToken: req.csrfToken(), plataforma, menuAdmin, usuario_id: cnf.id, user: cnf.user, nav, user});

        }else{
            res.redirect('/ERROR/unauthorized');
        }
        
    },

    async postEditarPlataformaEn(req, res){
        const cnf = requested(req);
        
        if(await isPermissedTo(cnf.user_id, cnf.rol, 'ADMIN-PLATAFORMAS')){
            let response = await postPlataformaEditar(cnf);

            if(response.status != "error"){
                res.redirect('/intranet/administracion/plataformas/en');
            }else{
                res.redirect('/ERROR/error');
            }
        }else{
            res.redirect('/ERROR/unauthorized');
        }
    },

};
const layout = '../../views/pages/intranet/perfil/';
const modules = 'modules/intranet/perfil/';

const {requested} = require(appRoot+'/utils/Admin/UtilRequested');
const {getPerfilData, postPerfilData} = require(appRoot+'/utils/Perfil/UtilPerfil');
const {getUserData} = require(appRoot+'/utils/GetUser');


const nav = 'perfil';

module.exports = {

    async getPerfil(req, res){

        const user = getUserData(req);
        let data = await getPerfilData(user.id);
        res.render(modules+'main', {layout: layout+'main.hbs', csrfToken: req.csrfToken(), data, user, nav});
    
    },

    async postPerfil(req, res){

        const cnf = requested(req);
        let response = await postPerfilData(cnf);
        res.json(response);

    },

};


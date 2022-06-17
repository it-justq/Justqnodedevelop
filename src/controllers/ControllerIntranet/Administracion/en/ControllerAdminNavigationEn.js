const layout = '../../views/pages/intranet/administracion/';
const modules = 'modules/intranet/administracion/';

const {getUserData} = require(appRoot+'/utils/GetUser');


const menuAdmin = true;
const nav = 'administracion';

module.exports = {

    getAdministracionEn(req, res){
        const user = getUserData(req);
        
        res.render(modules+'en/main', {layout: layout+'en/main.hbs', menuAdmin: true, csrfToken: req.csrfToken(), user, nav});
    },
    

};
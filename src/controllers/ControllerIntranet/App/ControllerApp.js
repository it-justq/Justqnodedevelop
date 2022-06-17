const layout = '../../views/pages/intranet/app/';
const modules = 'modules/intranet/app/';

const {getAppDatos} = require(appRoot+'/utils/App/UtilGetApp');
const {getUserData} = require(appRoot+'/utils/GetUser');


const nav = 'app';

module.exports = {

    async getApp(req, res){
        /*const user = getUserData(req);
        let data = await getAppDatos(user.id);

        res.render(modules+'main', {layout: layout+'main.hbs', user, data, nav});*/
        res.redirect('/ERROR/not-available');

    },


};
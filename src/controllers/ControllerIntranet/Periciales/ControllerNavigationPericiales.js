
const layout = '../../views/pages/intranet/';
const modules = 'modules/intranet/';

const {getPericiales} = require(appRoot+'/utils/Pericial/UtilGetControlesPericiales');
const {requestedControles, requestedControlesSearch} = require(appRoot+'/utils/Control/UtilRequested'); //control,user,rol
const {getUserData} = require(appRoot+'/utils/GetUser');

const nav = 'periciales';

module.exports = {

    async getPericiales(req, res){

        let user = getUserData(req);
        let PARAMS = requestedControles(req);
        let informes = await getPericiales(PARAMS, 'total');
 
        res.render(modules+'periciales/main', {layout: layout+'periciales/main.hbs', csrfToken: req.csrfToken(), informes, date: PARAMS.date, informes_main: true, user, nav});
    },


    async getPericialesSearch(req, res){

        let user = getUserData(req);
        let PARAMS = requestedControlesSearch(req);
        let informes = await getPericiales(PARAMS, 'search');

        res.render(modules+'periciales/main', {layout: layout+'periciales/main.hbs', csrfToken: req.csrfToken(), informes, informes_search: true, user, nav});
    },

 

};


const layout = '../../views/pages/intranet/';
const modules = 'modules/intranet/';

const {getControles} = require(appRoot+'/utils/Control/UtilGetControles');
const {requestedControles, requestedControlesSearch} = require(appRoot+'/utils/Control/UtilRequested'); //control,user,rol
const {getUserData} = require(appRoot+'/utils/GetUser');

const nav = 'controles';

module.exports = {

    async getControles(req, res){
        let user = getUserData(req);
        let pagina = parseInt(req.params.pagina);
        let PARAMS = requestedControles(req);
        let controles = await getControles(PARAMS, 'total', pagina);

        controles.sort((a, b) => (a.control_fecha <= b.control_fecha) ? 1 : -1);
        
        res.render(modules+'controles/main', {layout: layout+'controles/main.hbs', csrfToken: req.csrfToken(), controles, date: PARAMS.date, pagina, controles_main: true, user, nav});
    },

    async getControlesSearch(req, res){
        const user = getUserData(req);
        let PARAMS = requestedControlesSearch(req);
        let controles = await getControles(PARAMS, 'search');

        res.render(modules+'controles/main', {layout: layout+'controles/main.hbs', csrfToken: req.csrfToken(), controles, controles_search: true, user, nav});
    },
 

};

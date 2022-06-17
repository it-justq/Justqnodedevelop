
const layout = '../../views/pages/intranet/';
const modules = 'modules/intranet/';

const {getEnviosList} = require(appRoot+'/utils/Envio/UtilGetEnvios');
const {requestedEnvios, requestedEnviosSearch} = require(appRoot+'/utils/Envio/UtilRequested'); 
const {getUserData} = require(appRoot+'/utils/GetUser');

const nav = 'envios';

module.exports = {

    async getEnvios(req, res){
        let user = getUserData(req);
        let pagina = parseInt(req.params.pagina);
        let PARAMS = requestedEnvios(req);
        let envios = await getEnviosList(PARAMS, pagina);
        
        res.render(modules+'envios/main', {layout: layout+'envios/main.hbs', csrfToken: req.csrfToken(), envios, date: PARAMS.date, pagina, envios_main: true, user, nav});
    },

    async getEnviosSearch(req, res){
        const user = getUserData(req);
        let PARAMS = requestedEnviosSearch(req);
        let envios = await getEnvios(PARAMS, 'search');

        res.render(modules+'envios/main', {layout: layout+'envios/main.hbs', csrfToken: req.csrfToken(), envios, envios_search: true, user, nav});
    },
 

};

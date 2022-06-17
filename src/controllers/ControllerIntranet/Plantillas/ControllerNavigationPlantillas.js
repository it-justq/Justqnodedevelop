
const layout = '../../views/pages/intranet/';
const modules = 'modules/intranet/';
const {getUserData} = require(appRoot+'/utils/GetUser');

const {getPlantillasList, postNuevoControlPlantillaData} = require(appRoot+'/utils/Plantilla/UtilGetPlantillas');
const nav = 'plantillas';

module.exports = {

    async getPlantillas(req, res){
        const user = getUserData(req);
        let pagina = parseInt(req.params.pagina);

        let data = await getPlantillasList(pagina);

        switch(data.status){
            case 'ok':
                res.render(modules+'plantillas/main', {layout: layout+'plantillas/main.hbs', csrfToken: req.csrfToken(), data, pagina, user, nav});
                break;
            case 'error':
                res.redirect('');
            break;
        }
    },


    async postNuevoControlPlantilla(req, res){
        const user = getUserData(req);
        let plantilla_hash = req.params.id;
        
        let response = await postNuevoControlPlantillaData(plantilla_hash, user.id);
        res.json(response);
    },
 

};

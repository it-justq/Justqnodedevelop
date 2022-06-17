const layout = '../../views/pages/intranet/';
const modules = 'modules/intranet/';

const {getInicioDatos} = require(appRoot+'/utils/Inicio/UtilGetInicio');
const {getUserData} = require(appRoot+'/utils/GetUser');

const nav = 'inicio';

module.exports = {

    async getInicio(req, res){
        const user = getUserData(req);
        let data = await getInicioDatos(req.user);
        
       if (user.idioma == 2){
        res.render(modules+'inicio/en/main', {layout: layout+'inicio/en/main.hbs', user, data, nav});
        }
        else{
            res.render(modules+'inicio/main', {layout: layout+'inicio/main.hbs', user, data, nav});
        }


        /*switch(data.status){
            case 'ok':
                res.render(modules+'inicio/main', {layout: layout+'inicio/main.hbs', user, data, nav});
                break;
            case 'error':
                res.redirect('');
            break;
        }*/

    },


};
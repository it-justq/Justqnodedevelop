const layout = '../../views/pages/informes/web/';
const modules = 'modules/informes/web/';

const {requested} = require(appRoot+'/utils/Informe/UtilRequested');
const {getUserData} = require(appRoot+'/utils/GetUser');
const {getControlPdf} = require(appRoot+'/utils/Informe/Pdf/ControlPdf');


module.exports = {

	async getInformeWeb(req, res){
        const cnf = await requested(req);
        const user = await getUserData(req);
        const data = await getControlPdf(cnf);

        control_id = cnf.control_hash;

        if(data.status === 'ok'){
            let DATA = data.data;

            if(cnf.idioma === 'es'){
            res.render(modules+'web-control-es', {layout: layout+'web-control.hbs', DATA, user, control_id});

            }else if(cnf.idioma === 'en'){
            res.render(modules+'web-control-en', {layout: layout+'web-control.hbs', DATA, user, control_id});

            }else{
                res.redirect('/ERROR/informe-web')
            }


        }else{
            res.redirect('/ERROR/informe-web')
        }
    }

};
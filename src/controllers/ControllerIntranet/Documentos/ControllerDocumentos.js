const layout = '../../views/pages/intranet/documentos/';
const modules = 'modules/intranet/documentos/';

const {getDocumentosDatos} = require(appRoot+'/utils/Documentos/UtilGetDocumentos');
const {getUserData} = require(appRoot+'/utils/GetUser');


const nav = 'documentos';

module.exports = {

    async getDocumentos(req, res){
        /*const user = getUserData(req);
        let data = await getDocumentosDatos(user.id);

        res.render(modules+'main', {layout: layout+'main.hbs', user, data, nav});*/
        res.redirect('/ERROR/not-available');

    },


};
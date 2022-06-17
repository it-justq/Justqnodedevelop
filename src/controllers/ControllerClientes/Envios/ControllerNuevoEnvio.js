const layout = '../../views/pages/intranet/';
const modules = 'modules/intranet/';


const {requestedPost} = require(appRoot+'/utils/Envio/UtilRequested');
const {postNuevoEnvio} = require(appRoot+'/utils/Envio/UtilNuevoEnvio');
const nav = 'envios';

module.exports = {

    async postEnvioNuevo(req,res){
        const cnf = await requestedPost(req);
        const result = await postNuevoEnvio(cnf);

        if(result.status === true){
            res.redirect('/clientes/envios');
        }else{
            //res.redirect('/clientes/nuevo/envio');
            alert("Ya existe un envío con esa referencia de pedido");
        }
    }

}
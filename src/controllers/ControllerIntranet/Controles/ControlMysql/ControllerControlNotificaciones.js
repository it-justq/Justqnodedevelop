const layout = '../../views/pages/intranet/controles/control/';
const modules = 'modules/intranet/controles/control/';

const {requested} = require(appRoot+'/utils/Control/UtilRequested');
const {numControl, permisosControl} = require(appRoot+'/utils/Control/ControlesMysql/UtilCommon');

const {sendMail} = require(appRoot+'/utils/Mailer');


module.exports = {

    async sendMailControlCliente(req, res){
        const cnf = await requested(req);

        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol)){
            let response = await sendMail(cnf, 'control-cliente');
            res.send(response);
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES sendMailControlCliente USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
        }
    },

};

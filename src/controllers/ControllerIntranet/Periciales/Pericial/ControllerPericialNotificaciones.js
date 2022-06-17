const layout = '../../views/pages/intranet/periciales/pericial/';
const modules = 'modules/intranet/periciales/pericial/';

const {requested} = require(appRoot+'/utils/Pericial/UtilRequested');
const {permisosInforme} = require(appRoot+'/utils/Pericial/UtilCommon');
const {getUserData} = require(appRoot+'/utils/GetUser');

const {sendMail} = require(appRoot+'/utils/Mailer');


module.exports = {

    async sendMailPericialCliente(req, res){
        const cnf = await requested(req);

        if(await permisosInforme(cnf.informe_id, cnf.user_id, cnf.rol)){
            let response = await sendMail(cnf, 'pericial-cliente');
            res.send(response);
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES sendMailControlCliente USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.informe_hash);
            res.redirect('/ERROR/unauthorized')
        }
    },

};

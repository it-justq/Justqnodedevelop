const layout = '../../views/pages/intranet/periciales/pericial/';
const modules = 'modules/intranet/periciales/pericial/';

const {requested} = require(appRoot+'/utils/Pericial/UtilRequested');
const {numInforme, permisosInforme} = require(appRoot+'/utils/Pericial/UtilCommon');
const {getUserData} = require(appRoot+'/utils/GetUser');


const {getPericialInformacion, postPericialInformacion} = require(appRoot+'/utils/Pericial/Periciales/UtilInformacion');


const menuPericial = true;
const nav = 'periciales';

module.exports = {

    async getInformacion(req, res){
        const user = await getUserData(req);
        const cnf = await requested(req);

        if(await permisosInforme(cnf.informe_id, cnf.user_id, cnf.rol)){
            const informe_codigo = await numInforme(cnf.informe_id);
            const menuInformacion = true;

            const data = await getPericialInformacion(cnf.pericial_id, cnf.control_hash);
            res.render(modules+'informacion', {layout: layout+'informacion.hbs', csrfToken: req.csrfToken(), menuPericial, menuInformacion, data, informe_codigo, informe_id: cnf.informe_hash, user, nav});
            
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES getInformacion USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.informe_hash);
            res.redirect('/ERROR/unauthorized')
        }
    },

    async postInformacion(req, res){
        const cnf = await requested(req);

        if(await permisosInforme(cnf.informe_id, cnf.user_id, cnf.rol)){
            let response = await postPericialInformacion(cnf);
            res.json(response);
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES postInformacion USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.informe_hash);
            res.redirect('/ERROR/unauthorized')
        }

    },

};

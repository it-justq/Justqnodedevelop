const layout = '../../views/pages/intranet/controles/control/';
const modules = 'modules/intranet/controles/control/';

const {requested} = require(appRoot+'/utils/Control/UtilRequested');
const {numControl, esPrecarga, permisosControl} = require(appRoot+'/utils/Control/ControlesMysql/UtilCommon');
const {getUserData} = require(appRoot+'/utils/GetUser');

const {getPrecargaDatos,  postPrecargaDatos} = require(appRoot+'/utils/Control/ControlesMysql/UtilPrecarga');

const menuControl = true;
const nav = 'controles';

module.exports = {

    async getPrecargaEn(req, res){
        const user = await getUserData(req);
        const cnf = await requested(req);
        const activePrecarga = await esPrecarga(cnf.control_id);

        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol) && activePrecarga){
            const control_codigo = await numControl(cnf.control_id);
            const menuPrecarga = true;

            const data = await getPrecargaDatos(cnf.control_id, cnf.control_hash);

            switch(data.status){
                case 'ok':
                    res.render(modules+'en/precarga', {layout: layout+'en/precarga.hbs', csrfToken: req.csrfToken(), menuControl, activePrecarga, menuPrecarga, data, control_codigo, control_id: cnf.control_hash, user, nav});
                    break;
                case 'error':
                    res.redirect('/ERROR/control/en/'+cnf.control_hash+'/precarga');
                break;
            }

        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES getPrecarga USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
        }
    },

    async postPrecargaEn(req, res){
        const cnf = await requested(req);
        const activePrecarga = await esPrecarga(cnf.control_id);

        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol) && activePrecarga){
            let response = await postPrecargaDatos(cnf);
            res.json(response);
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES postPrecarga USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
        }
    }

};

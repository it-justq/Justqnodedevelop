const layout = '../../views/pages/intranet/controles/control/';
const modules = 'modules/intranet/controles/control/';

const {requested} = require(appRoot+'/utils/Control/UtilRequested');
const {numControl, esPrecarga, permisosControl} = require(appRoot+'/utils/Control/ControlesMysql/UtilCommon');
const {getUserData} = require(appRoot+'/utils/GetUser');


const {getControlDatos, postControlDatos} = require(appRoot+'/utils/Control/ControlesMysql/UtilDatos');


const menuControl = true;
const nav = 'controles';

module.exports = {

    async getDatosEn(req, res){
        const user = await getUserData(req);
        let cnf = await requested(req);

        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol)){
            const control_codigo = await numControl(cnf.control_id);
            const activePrecarga = await esPrecarga(cnf.control_id);
            const menuDatos = true;

            const data = await getControlDatos(cnf.control_id, cnf.control_hash);

            switch(data.status){
                case 'ok':
                    res.render(modules+'en/datos', {layout: layout+'en/datos.hbs', csrfToken: req.csrfToken(), menuControl, activePrecarga, menuDatos, data, control_codigo, control_id: cnf.control_hash, user, nav});
                break;
                case 'error':
                    res.redirect('/ERROR/control/en/'+cnf.control_hash+'/datos');
                break;
            }
            
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES getDatos USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
        }
    },

    async postDatosEn(req, res){
        let cnf = await requested(req);

        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol)){
            let response = await postControlDatos(cnf);
            res.json(response);
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES postDatos USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
        }

    },

};

const layout = '../../views/pages/intranet/periciales/pericial/';
const modules = 'modules/intranet/periciales/pericial/';

const {requested} = require(appRoot+'/utils/Pericial/UtilRequested');
const {numInforme, permisosInforme} = require(appRoot+'/utils/Pericial/UtilCommon');
const {getUserData} = require(appRoot+'/utils/GetUser');


const {getInformeDatos, postInformeDatos} = require(appRoot+'/utils/Pericial/Periciales/UtilDatos');


const menuPericial = true;
const nav = 'periciales';

module.exports = {

    async getDatos(req, res){
        const user = await getUserData(req);
        let cnf = await requested(req);

        if(await permisosInforme(cnf.informe_id, cnf.user_id, cnf.rol)){
            const informe_codigo = await numInforme(cnf.informe_id);
            const menuDatos = true;

            const data = await getInformeDatos(cnf.informe_id, cnf.informe_hash);

            switch(data.status){
                case 'ok':
                    res.render(modules+'datos', {layout: layout+'datos.hbs', csrfToken: req.csrfToken(), menuPericial, menuDatos, data, informe_codigo, informe_id: cnf.informe_hash, user, nav});
                break;
                case 'error':
                    res.redirect('/ERROR/control/'+cnf.informe_hash+'/datos');
                break;
            }
            
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES getDatos USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.informe_hash);
            res.redirect('/ERROR/unauthorized')
        }
    },

    async postDatos(req, res){
        let cnf = await requested(req);

        if(await permisosInforme(cnf.informe_id, cnf.user_id, cnf.rol)){
            let response = await postInformeDatos(cnf);
            res.json(response);
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES postDatos USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.informe_hash);
            res.redirect('/ERROR/unauthorized')
        }

    },

};

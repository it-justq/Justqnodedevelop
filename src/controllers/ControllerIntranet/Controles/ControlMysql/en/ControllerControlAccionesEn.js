const layout = '../../views/pages/intranet/controles/control/';
const modules = 'modules/intranet/controles/control/';

const {requested} = require(appRoot+'/utils/Control/UtilRequested');
const {numControl, esPrecarga, permisosControl} = require(appRoot+'/utils/Control/ControlesMysql/UtilCommon');
const {getUserData} = require(appRoot+'/utils/GetUser');

const {getAccionesDatos, modAccionesDatos, addAccionesDatos, deleteAccionesDatos} = require(appRoot+'/utils/Control/ControlesMysql/UtilAcciones');

const menuControl = true;
const nav = 'controles';

module.exports = {


    async getAccionesEn(req, res){
        const user = await getUserData(req);
        const cnf = await requested(req);
        

        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol)){
            const control_codigo = await numControl(cnf.control_id);
            const activePrecarga = await esPrecarga(cnf.control_id);

            const menuAcciones = true;

            const data = await getAccionesDatos(cnf.control_id, cnf.control_hash);

            switch(data.status){
                case 'ok':
                    res.render(modules+'en/acciones', {layout: layout+'en/acciones.hbs', csrfToken: req.csrfToken(), menuControl, menuAcciones, activePrecarga, data, control_codigo, control_id: cnf.control_hash, user, nav});
                    break;
                case 'error':
                    res.redirect('/ERROR/control/'+cnf.control_hash+'/acciones');
                break;
            }

        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES getAcciones USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
        }

    },
    
    async modAccionesEn(req, res){
        const cnf = await requested(req);

        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol)){
            await modAccionesDatos(cnf);
            res.redirect('/intranet/control/en/'+cnf.control_hash+'/acciones');
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES postAcciones USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
        }


    },    

    async addAccionesEn(req, res){
        const cnf = await requested(req);

        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol)){
            let response = await addAccionesDatos(cnf);
            if(cnf.type === 'txt'){
                res.json(response);
            }else{
                res.redirect('/intranet/control/en/'+cnf.control_hash+'/acciones');
            }
            
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES putAcciones USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
        }

    },    

    async deleteAccionesEn(req, res){
        const cnf = await requested(req);

        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol)){
            let response = await deleteAccionesDatos(cnf);
            res.json(response);
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
        }

    },   

};

const layout = '../../views/pages/intranet/controles/control/';

const modules = 'modules/intranet/controles/control/';

const {requested} = require(appRoot+'/utils/Control/UtilRequested');
const {numControl, esPrecarga, permisosControl} = require(appRoot+'/utils/Control/ControlesMysql/UtilCommon');
const {getUserData} = require(appRoot+'/utils/GetUser');


const {getFotosControl, postFotosControl, deleteFotosControl, deleteFotoControl} = require(appRoot+'/utils/Control/ControlesMysql/UtilFotos');



const menuControl = true;
const nav = 'controles';

module.exports = {

    async getFotos(req, res){
        const user = await getUserData(req);
        const cnf = await requested(req);

        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol)){

            const control_codigo = await numControl(cnf.control_id);
            const activePrecarga = await esPrecarga(cnf.control_id);
            const menuFotos = true;
    
            const data = await getFotosControl(cnf.control_id, cnf.control_hash);

            switch(data.status){
                case 'ok':
                    res.render(modules+'fotos', {layout: layout+'fotos.hbs', csrfToken: req.csrfToken(), menuControl, activePrecarga, menuFotos, data, control_codigo, control_id: cnf.control_hash, user, nav});
                    break;
                case 'error':
                    res.redirect('/ERROR/control/'+cnf.control_hash+'/fotos');
                break;
            }


        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES getFotos USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
            
        }
    },

    async postFotos(req, res){
        const cnf = await requested(req);
      
        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol)){
            let response = await postFotosControl(cnf);

            if(response.status === 'ok'){
                return res.redirect('/intranet/control/'+cnf.control_hash+'/fotos');
            }else{
                return res.redirect('/intranet/control/'+cnf.control_hash+'/fotos');
            }
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES postFotos USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
        }
    },

    async deleteAllFotos(req, res){
        const cnf = await requested(req);
      
        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol)){
            let response = await deleteFotosControl(cnf);
            if(response.status === 'ok'){
                res.json(response);
            }else{
                res.json(response);
            }
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES deleteFotos USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
        }
    },

    async deleteFoto(req, res){
        const cnf = await requested(req);
        
        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol)){
            let response = await deleteFotoControl(cnf);
            if(response.status === 'ok'){
                res.json(response);
            }else{
                res.json(response);
            }
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES deleteFoto USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
        }
    },

};

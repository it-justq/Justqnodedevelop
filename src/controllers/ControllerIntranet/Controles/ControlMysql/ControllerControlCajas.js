const layout = '../../views/pages/intranet/controles/control/';
const modules = 'modules/intranet/controles/control/';

const {requested} = require(appRoot+'/utils/Control/UtilRequested');
const {numControl, esPrecarga, permisosControl} = require(appRoot+'/utils/Control/ControlesMysql/UtilCommon');
const {getUserData} = require(appRoot+'/utils/GetUser');

const {getCajasDatos, postCajasDatos, addCajasDatos, delCajasDatos, getCajaFotosDatos, postDatosCajaFotos, deleteDatosCajaFotos, deleteDatosCajaFoto} = require(appRoot+'/utils/Control/ControlesMysql/UtilCajas');


const menuControl = true;
const nav = 'controles';

module.exports = {

    async getCajas(req, res){
        const user = await getUserData(req);
        const cnf = await requested(req);

        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol)){
            const control_codigo = await numControl(cnf.control_id);
            const activePrecarga = await esPrecarga(cnf.control_id);
            const menuCajas = true;

            const data = await getCajasDatos(cnf.control_id, cnf.control_hash);

            switch(data.status){
                case 'ok':
                    res.render(modules+'cajas', {layout: layout+'cajas.hbs', csrfToken: req.csrfToken(), menuControl, activePrecarga, menuCajas, data, control_codigo, control_id: cnf.control_hash, user, nav});
                    break;
                case 'error':
                    res.redirect('/ERROR/control/'+cnf.control+'/cajas');
                break;
            }

        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES getCajas USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
        }
    },

    async modCajas(req, res){
        const cnf = await requested(req);

        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol)){
            let response = await postCajasDatos(cnf);
            res.json(response);
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES postCajas USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
        }
    },

    async addCajas(req, res){
        
        const cnf = await requested(req);

        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol)){
            let response = await addCajasDatos(cnf);
            res.json(response);
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES addCajas USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
        }
    
    },

    async delCaja(req, res){
        const cnf = await requested(req);

        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol)){
            let response = await delCajasDatos(cnf);
            res.json(response);
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES delCaja USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
        }
    
    },

    async getCajaFotos(req, res){
        const user = await getUserData(req);
        const cnf = await requested(req);

        if(await permisosControl(cnf.control_id, user.id, user.rol)){
            const control_codigo = await numControl(cnf.control_id);
            const activePrecarga = await esPrecarga(cnf.control_id);
            const menuCajaFotos = true;

            const data = await getCajaFotosDatos(cnf);

            switch(data.status){
                case 'ok':
                    res.render(modules+'caja-fotos', {layout: layout+'caja-fotos.hbs', csrfToken: req.csrfToken(), menuControl, activePrecarga, menuCajaFotos, data, caja_id: cnf.id, control_codigo, control_id: cnf.control_hash, user, nav});
                    break;
                case 'error':
                    res.redirect('/ERROR/control/'+cnf.control_hash+'/cajas');
                break;
            }

        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES getCajaFotos USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
        }
    },

    async postCajaFotos(req, res){
        const cnf = await requested(req);

        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol)){
            let response = await postDatosCajaFotos(cnf);
            if(response.status === 'ok'){
                return res.redirect('/intranet/control/'+cnf.control_hash+'/caja/'+cnf.id+'/fotos');
            }else{
                return res.redirect('/intranet/control/'+cnf.control_hash+'/caja/'+cnf.id+'/fotos');
            }
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES postCajaFotos USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
        }
    },

    async deleteFotosCaja(req, res){
        const cnf = await requested(req);
      
        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol)){
            let response = await deleteDatosCajaFotos(cnf);
            if(response.status === 'ok'){
                res.json(response);
            }else{
                res.json(response);
            }
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES deleteFotosCaja USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
        }
    },

    async deleteFotoCaja(req, res){
        const cnf = await requested(req);
        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol)){
            let response = await deleteDatosCajaFoto(cnf);
            if(response.status === 'ok'){
                res.json(response);
            }else{
                res.json(response);
            }
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES deleteFotoCaja USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
        }
    },

};

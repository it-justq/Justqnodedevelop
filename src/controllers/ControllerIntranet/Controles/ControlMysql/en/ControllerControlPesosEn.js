const layout = '../../views/pages/intranet/controles/control/';
const modules = 'modules/intranet/controles/control/';

const {requested} = require(appRoot+'/utils/Control/UtilRequested');
const {numControl, esPrecarga, permisosControl} = require(appRoot+'/utils/Control/ControlesMysql/UtilCommon');
const {getUserData} = require(appRoot+'/utils/GetUser');

const {getPesosDatos, modPesosDatos, addPesosDatos, delPesoDatos, getPesoFotosDatos, postDatosPesoFotos, deleteDatosPesoFotos, deleteDatosPesoFoto} = require(appRoot+'/utils/Control/ControlesMysql/UtilPesos');

const menuControl = true;
const nav = 'controles';

module.exports = {

    async getPesosEn(req, res){
        const user = await getUserData(req);
        const cnf = await requested(req);

        if(await await permisosControl(cnf.control_id, cnf.user_id, cnf.rol)){
            const control_codigo = await numControl(cnf.control_id);
            const activePrecarga = await esPrecarga(cnf.control_id);
            const menuPesos = true;

            const data = await getPesosDatos(cnf.control_id, cnf.control_hash);

            switch(data.status){
                case 'ok':
                    res.render(modules+'en/pesos', {layout: layout+'en/pesos.hbs', csrfToken: req.csrfToken(), menuControl, activePrecarga, menuPesos, data, control_codigo, control_id: cnf.control_hash, user, nav});
                    break;
                case 'error':
                    res.redirect('/ERROR/control/'+cnf.control_hash+'/pesos');
                break;
            }

        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES getPesos USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
        }
    },

    async modPesosEn(req, res){
        const cnf = await requested(req);

        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol)){
            let response = await modPesosDatos(cnf);
            res.json(response);
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES modPesos USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
        }
    
    },

    async addPesosEn(req, res){
        const cnf = await requested(req);

        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol)){
            let response = await addPesosDatos(cnf);
            res.json(response);
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES addPesos USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
        }
    
    },

    async delPesoEn(req, res){
        const cnf = await requested(req);

        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol)){
            let response = await delPesoDatos(cnf);
            res.json(response);
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES delPeso USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
        }
    
    },

    async getPesoFotosEn(req, res){
        const user = await getUserData(req);
        const cnf = await requested(req);

        if(await permisosControl(cnf.control_id, user.id, user.rol)){
            const control_codigo = await numControl(cnf.control_id);
            const activePrecarga = await esPrecarga(cnf.control_id);
            const menuPesoFotos = true;

            const data = await getPesoFotosDatos(cnf);

            switch(data.status){
                case 'ok':
                    res.render(modules+'en/peso-fotos', {layout: layout+'en/peso-fotos.hbs', csrfToken: req.csrfToken(), menuControl, activePrecarga, menuPesoFotos, data, peso_id: cnf.id, control_codigo, control_id: cnf.control_hash, user, nav});
                    break;
                case 'error':
                    res.redirect('/ERROR/control/'+cnf.control_hash+'/pesos');
                break;
            }

        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES getPesoFotos USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
        }
    },

    async postPesoFotosEn(req, res){
        const cnf = await requested(req);

        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol)){
            let response = await postDatosPesoFotos(cnf);
            if(response.status === 'ok'){
                return res.redirect('/intranet/control/en/'+cnf.control_hash+'/peso/'+cnf.id+'/fotos');
            }else{
                return res.redirect('/intranet/control/en/'+cnf.control_hash+'/peso/'+cnf.id+'/fotos');
            }
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES postPesoFotos USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control);
            res.redirect('/ERROR/unauthorized')
        }
    },

    async deleteFotosPesoEn(req, res){
        const cnf = await requested(req);
      
        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol)){
            let response = await deleteDatosPesoFotos(cnf);
            if(response.status === 'ok'){
                res.json(response);
            }else{
                res.json(response);
            }
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES deleteFotosPeso USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
        }
    },

    async deleteFotoPesoEn(req, res){
        const cnf = await requested(req);
        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol)){
            let response = await deleteDatosPesoFoto(cnf);
            if(response.status === 'ok'){
                res.json(response);
            }else{
                res.json(response);
            }
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES deleteFotoPeso USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
        }
    },

};

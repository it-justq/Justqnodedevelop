const layout = '../../views/pages/intranet/controles/control/';
const modules = 'modules/intranet/controles/control/';

const {requested} = require(appRoot+'/utils/Control/UtilRequested');
const {numControl, esPrecarga, permisosControl} = require(appRoot+'/utils/Control/ControlesMysql/UtilCommon');
const {getUserData} = require(appRoot+'/utils/GetUser');

const {getPalletsDatos, postPalletsDatos, addPalletsDatos, delPalletsDatos, getPalletFotosDatos, postDatosPalletFotos, deleteDatosPalletFotos, deleteDatosPalletFoto} = require(appRoot+'/utils/Control/ControlesMysql/UtilPallets');


const menuControl = true;
const nav = 'controles';

module.exports = {

    async getPalletsEn(req, res){
        const user = await getUserData(req);
        const cnf = await requested(req);

        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol)){
            const control_codigo = await numControl(cnf.control_id);
            const activePrecarga = await esPrecarga(cnf.control_id);
            const menuPallets = true;

            const data = await getPalletsDatos(cnf.control_id, cnf.control_hash);

            switch(data.status){
                case 'ok':
                    res.render(modules+'en/pallets', {layout: layout+'en/pallets.hbs', csrfToken: req.csrfToken(), menuControl, activePrecarga, menuPallets, data, control_codigo, control_id: cnf.control_hash, user, nav});
                    break;
                case 'error':
                    res.redirect('/ERROR/control/'+cnf.control_hash+'/pallets');
                break;
            }

        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES getPallets USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
        }
    },

    async modPalletsEn(req, res){
        const cnf = await requested(req);

        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol)){
            let response = await postPalletsDatos(cnf);
            res.json(response);
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES modPallets USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
        }
    },

    async addPalletsEn(req, res){
        
        const cnf = await requested(req);

        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol)){
            let response = await addPalletsDatos(cnf);
            res.json(response);
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES addPallets USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
        }
    
    },

    async delPalletEn(req, res){
        const cnf = await requested(req);

        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol)){
            let response = await delPalletsDatos(cnf);
            res.json(response);
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES delPallet USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
        }
    
    },

    async getPalletFotosEn(req, res){
        const user = await getUserData(req);
        const cnf = await requested(req);

        if(await permisosControl(cnf.control_id, user.id, user.rol)){
            const control_codigo = await numControl(cnf.control_id);
            const activePrecarga = await esPrecarga(cnf.control_id);
            const menuPalletFotos = true;

            const data = await getPalletFotosDatos(cnf);

            switch(data.status){
                case 'ok':
                    res.render(modules+'en/pallet-fotos', {layout: layout+'en/pallet-fotos.hbs', csrfToken: req.csrfToken(), menuControl, activePrecarga, menuPalletFotos, data, pallet_id: cnf.id, control_codigo, control_id: cnf.control_hash, user, nav});
                    break;
                case 'error':
                    res.redirect('/ERROR/control/'+cnf.control_hash+'/pallets');
                break;
            }

        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES getPalletFotos USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
        }
    },

    async postPalletFotosEn(req, res){
        const cnf = await requested(req);

        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol)){
            let response = await postDatosPalletFotos(cnf);
            if(response.status === 'ok'){
                return res.redirect('/intranet/control/en/'+cnf.control_hash+'/pallet/'+cnf.id+'/fotos');
            }else{
                return res.redirect('/intranet/control/en/'+cnf.control_hash+'/pallet/'+cnf.id+'/fotos');
            }
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES postPalletFotos USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
        }
    },

    async deleteFotosPalletEn(req, res){
        const cnf = await requested(req);
      
        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol)){
            let response = await deleteDatosPalletFotos(cnf);
            if(response.status === 'ok'){
                res.json(response);
            }else{
                res.json(response);
            }
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES deleteFotosPallet USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
        }
    },

    async deleteFotoPalletEn(req, res){
        const cnf = await requested(req);
        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol)){
            let response = await deleteDatosPalletFoto(cnf);
            if(response.status === 'ok'){
                res.json(response);
            }else{
                res.json(response);
            }
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES deleteFotoPallets USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
        }
    },

};

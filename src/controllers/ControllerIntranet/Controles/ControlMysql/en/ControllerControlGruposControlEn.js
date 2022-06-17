const layout = '../../views/pages/intranet/controles/control/';
const modules = 'modules/intranet/controles/control/';

const {requested} = require(appRoot+'/utils/Control/UtilRequested');
const {numControl, esPrecarga, permisosControl} = require(appRoot+'/utils/Control/ControlesMysql/UtilCommon');
const {getUserData} = require(appRoot+'/utils/GetUser');

const {getGruposControlDatos, postGruposControlDatos, postAddedGruposControlDatos, addPuntoControlDatos, deleteAddedPuntoControlDatos, getDatosPuntoControlFotos, postDatosPuntoControlFotos, deleteDatosPuntoControlFotos, deleteDatosPuntoControlFoto} = require(appRoot+'/utils/Control/ControlesMysql/UtilGruposControl');

const menuControl = true;
const nav = 'controles';

module.exports = {

    async getGruposControlEn(req, res){
        const user = await getUserData(req);
        const cnf = await requested(req);

        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol)){
            const control_codigo = await numControl(cnf.control_id);
            const activePrecarga = await esPrecarga(cnf.control_id);
            const menuGc = true;
            const data = await getGruposControlDatos(cnf.control_id, cnf.control_hash);

            switch(data.status){
                case 'ok':
                    res.render(modules+'en/grupos-control', {layout: layout+'en/grupos-control.hbs', csrfToken: req.csrfToken(), menuControl, activePrecarga, menuGc, data, control_codigo, control_id: cnf.control_hash, user, nav});
                    break;
                case 'error':
                    res.redirect('/ERROR/control/'+cnf.control_hash+'/grupos-de-control');
                break;
            }

        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES getGruposControl USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
        }
    },

    async postGruposControlEn(req, res){
        const cnf = await requested(req);

        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol)){
            let response = await postGruposControlDatos(cnf);
            res.json(response);
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES postGruposControl USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
        }

    },

    
    async postAddedGruposControlEn(req, res){
        const cnf = await requested(req);

        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol)){
            let response = await postAddedGruposControlDatos(cnf);
            res.json(response);
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES postGruposControl USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
        }

    },

    async addPuntoControlEn(req, res){
        const cnf = await requested(req);

        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol)){
            let response = await addPuntoControlDatos(cnf);
            res.json(response);
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES postGruposControl USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
        }

    },

    async deleteAddedGruposControlEn(req, res){
        const cnf = await requested(req);

        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol)){
            let response = await deleteAddedPuntoControlDatos(cnf);
            res.json(response);
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES postGruposControl USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
        }

    },


    //FOTOS DE LOS GRUPOS DE CONTROL

    async getPuntoControlFotosEn(req, res){
        const cnf = await requested(req);
        const user = await getUserData(req);

        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol)){
            const control_codigo = await numControl(cnf.control_id);
            const menuPcFotos = true;

            const data = await getDatosPuntoControlFotos(cnf);

            switch(data.status){
                case 'ok':
                    res.render(modules+'en/punto-control-fotos', {layout: layout+'en/punto-control-fotos.hbs', csrfToken: req.csrfToken(), menuControl, menuPcFotos, nav, data: data, pc_nombre_en: data.pc_nombre_en, pc_id: cnf.id, control_codigo, control_id: cnf.control_hash, user});
                    break;
                case 'error':
                    res.redirect('/ERROR/control/'+cnf.control_hash+'/fotos-punto-control');
                break;
            }

        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES getPuntoControlFotos USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
        }
    },

    async postPuntoControlFotosEn(req, res){
        const cnf = await requested(req);

        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol)){
            let response = await postDatosPuntoControlFotos(cnf);
            if(response.status === 'ok'){
                return res.redirect('/intranet/control/en/'+cnf.control_hash+'/punto-control/'+cnf.id+'/fotos');
            }else{
                return res.redirect('/intranet/control/en/'+cnf.control_hash+'/punto-control/'+cnf.id+'/fotos');
            }
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES postPuntoControlFotos USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
        }
    },

    async deleteFotosPcEn(req, res){
        const cnf = await requested(req);
      
        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol)){
            let response = await deleteDatosPuntoControlFotos(cnf);
            if(response.status === 'ok'){
                res.json(response);
            }else{
                res.json(response);
            }
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES deleteFotosPc USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
        }
    },

    async deleteFotoPcEn(req, res){
        const cnf = await requested(req);
        if(await permisosControl(cnf.control_id, cnf.user_id, cnf.rol)){
            let response = await deleteDatosPuntoControlFoto(cnf);
            if(response.status === 'ok'){
                res.json(response);
            }else{
                res.json(response);
            }
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES deleteFotoPC USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.control_hash);
            res.redirect('/ERROR/unauthorized')
        }
    },

};

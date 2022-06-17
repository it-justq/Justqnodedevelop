const layout = '../../views/pages/intranet/periciales/pericial/';
const modules = 'modules/intranet/periciales/pericial/';

const {requested} = require(appRoot+'/utils/Pericial/UtilRequested');
const {numInforme, permisosInforme} = require(appRoot+'/utils/Pericial/UtilCommon');
const {getUserData} = require(appRoot+'/utils/GetUser');

const {getGruposControlDatos, postGruposControlDatos, getDatosPuntoControlFotos, postDatosPuntoControlFotos, deleteDatosPuntoControlFotos, deleteDatosPuntoControlFoto} = require(appRoot+'/utils/Pericial/Periciales/UtilGruposControl');

const menuPericial = true;
const nav = 'periciales';

module.exports = {

    async getGruposControl(req, res){
        const user = await getUserData(req);
        const cnf = await requested(req);

        if(await permisosInforme(cnf.informe_id, cnf.user_id, cnf.rol)){
            const informe_codigo = await numInforme(cnf.informe_id);
            const menuGc = true;
            const data = await getGruposControlDatos(cnf.informe_id, cnf.informe_hash);

            switch(data.status){
                case 'ok':
                    res.render(modules+'grupos-control', {layout: layout+'grupos-control.hbs', csrfToken: req.csrfToken(), menuPericial, menuGc, data, informe_codigo, informe_id: cnf.informe_hash, user, nav});
                    break;
                case 'error':
                    res.redirect('/ERROR/pericial/'+cnf.informe_hash+'/grupos-de-control');
                break;
            }

        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES getGruposControl USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.informe_hash);
            res.redirect('/ERROR/unauthorized')
        }
    },

    async postGruposControl(req, res){
        const cnf = await requested(req);

        if(await permisosInforme(cnf.informe_id, cnf.user_id, cnf.rol)){
            let response = await postGruposControlDatos(cnf);
            res.json(response);
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES postGruposControl USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.informe_hash);
            res.redirect('/ERROR/unauthorized')
        }

    },


    //FOTOS DE LOS GRUPOS DE CONTROL

    async getPuntoControlFotos(req, res){
        const cnf = await requested(req);
        const user = await getUserData(req);

        if(await permisosInforme(cnf.informe_id, cnf.user_id, cnf.rol)){
            const informe_codigo = await numInforme(cnf.informe_id);
            const menuPcFotos = true;

            const data = await getDatosPuntoControlFotos(cnf);

            switch(data.status){
                case 'ok':
                    res.render(modules+'punto-control-fotos', {layout: layout+'punto-control-fotos.hbs', csrfToken: req.csrfToken(), menuPericial, menuPcFotos, nav, data: data, pc_nombre: data.pc_nombre, pc_id: cnf.id, informe_codigo, informe_id: cnf.informe_hash, user});
                    break;
                case 'error':
                    res.redirect('/ERROR/pericial/'+cnf.informe_hash+'/fotos-punto-control');
                break;
            }

        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES getPuntoControlFotos USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.informe_hash);
            res.redirect('/ERROR/unauthorized')
        }
    },

    async postPuntoControlFotos(req, res){
        const cnf = await requested(req);


        if(await permisosInforme(cnf.informe_id, cnf.user_id, cnf.rol)){
            let response = await postDatosPuntoControlFotos(cnf);
            if(response.status === 'ok'){
                return res.redirect('/intranet/control/'+cnf.informe_hash+'/punto-control/'+cnf.id+'/fotos');
            }else{
                return res.redirect('/intranet/control/'+cnf.informe_hash+'/punto-control/'+cnf.id+'/fotos');
            }
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES postPuntoControlFotos USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.informe_hash);
            res.redirect('/ERROR/unauthorized')
        }
    },

    async deleteFotosPc(req, res){
        const cnf = await requested(req);
      
        if(await permisosInforme(cnf.informe_id, cnf.user_id, cnf.rol)){
            let response = await deleteDatosPuntoControlFotos(cnf);
            if(response.status === 'ok'){
                res.json(response);
            }else{
                res.json(response);
            }
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES deleteFotosPc USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.informe_hash);
            res.redirect('/ERROR/unauthorized')
        }
    },

    async deleteFotoPc(req, res){
        const cnf = await requested(req);
        if(await permisosInforme(cnf.informe_id, cnf.user_id, cnf.rol)){
            let response = await deleteDatosPuntoControlFoto(cnf);
            if(response.status === 'ok'){
                res.json(response);
            }else{
                res.json(response);
            }
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES deleteFotoPC USUARIO:"+cnf.user_id+" - CONTROL:"+cnf.informe_hash);
            res.redirect('/ERROR/unauthorized')
        }
    },

};

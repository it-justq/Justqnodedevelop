const layout = appRoot + '/views/pages/intranet/envios/envio/';
const modules = appRoot + '/views/modules/intranet/envios/envio/';

const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');

const { requested, requestedControl } = require(appRoot + '/utils/Envio/UtilRequested');
const { refEnvio, permisosEnvio } = require(appRoot + '/utils/Envio/UtilCommon');
const { getUserData } = require(appRoot + '/utils/GetUser');
const { getControlPdf } = require(appRoot + '/utils/Informe/Pdf/ControlPdf');

const { getEnvioDatos, postEnvioDatos } = require(appRoot + '/utils/Envio/UtilDatos');


const menuEnvio = true;
const nav = 'envios';

const XMLHttpRequest = require('xhr2');
const btoa = require('btoa');

module.exports = {

    async getDatos(req, res) {
        
        const user = await getUserData(req);
        
        let cnf = await requested(req);
        
        if (await permisosEnvio(cnf.envio_id, cnf.user_id, cnf.rol)) {
            const envio_referencia = await refEnvio(cnf.envio_id);
            const menuDatos = true;

            const data = await getEnvioDatos(cnf.envio_id, cnf.envio_hash);
            switch (data.status) {
                case 'ok':
                    res.render(modules + 'datos', { layout: layout + 'datos.hbs', csrfToken: req.csrfToken(), menuEnvio, menuDatos, data, envio_referencia, envio_id: cnf.envio_hash, user, nav });
                    break;
                case 'error':
                    res.redirect('/ERROR/envio/' + cnf.envio_hash + '/datos');
                    break;
            }

        } else {
            console.log("ERROR: PERMISOS INSUFICIENTES getDatos USUARIO:" + cnf.user_id + " - ENVIO:" + cnf.envio_hash);
            res.redirect('/ERROR/unauthorized')
        }
    },

    async getPrecarga(req, res) {
        let cnf_envio = await requested(req);
        //let idioma = req.params.idioma;
        let idioma = "es";
        const cnf = await requestedControl(cnf_envio.envio_id, idioma, "precarga");
        const user = await getUserData(req);
        const envio_referencia = await refEnvio(cnf_envio.envio_id);

        let solicitado = cnf.solicitado;
        const menuPrecarga = true;

        if (solicitado) {
            const data = await getControlPdf(cnf);
            control_id = cnf.control;

            if (data.status === 'ok') {
                let DATA = data.data;

                //if(idioma === 'es'){
                res.render(modules + 'inspeccion-es', { layout: layout + 'inspeccion.hbs', DATA, solicitado, menuEnvio, menuPrecarga, envio_id: cnf_envio.envio_hash, user, control_id, envio_referencia});

                /*}else if(idioma === 'en'){
                res.render(modules+'inspeccion-precarga-en', {layout: layout+'inspeccion-precarga.hbs', DATA, menuEnvio, menuPrecarga, user, control_id});
    
                }else{
                    res.redirect('/ERROR/informe-web')
                }*/
            } else {
                res.redirect('/ERROR/informe-web')
            }
        } else {
            res.render(modules + 'inspeccion-es', { layout: layout + 'inspeccion.hbs', solicitado, menuEnvio, menuPrecarga, envio_id: cnf_envio.envio_hash, user });
        }
    },

    async getTermografo(req, res) {

        let menuTermografo = true;
        let cnf = await requested(req);
        let tk = false;
        const envio_referencia = await refEnvio(cnf.envio_id);
        const user = await getUserData(req);
        let termografo_id = await pool.query('SELECT envio_termografo_id FROM envio WHERE envio_id_hash = ?', cnf.envio_hash);
        termografo_id = termografo_id[0].envio_termografo_id;
        let url = 'https://traxx.hispatectrack.com';
        
        if(termografo_id!=""){
            url = 'https://traxx.hispatectrack.com/#!/shipInformation/deviceInfo/'+termografo_id;
            tk = true;
        }
        //res.render(modules+'termografo', {layout: layout+'termografo.hbs', DATA, menuEnvio, menuTermografo, user, control_id, envio_referencia});
        
        res.render(modules + 'termografo', { layout: layout + 'termografo.hbs', menuEnvio, menuTermografo, envio_id: cnf.envio_hash, envio_referencia, user, tk, url });
    },

    async getTracking(req, res) {
        try{
        let menuTracking = true;
        let cnf = await requested(req);
        const envio_referencia = await refEnvio(cnf.envio_id);
        const user = await getUserData(req);
        let tk = false;
        let url="";
        let datos_transporte = await pool.query('SELECT envio_tipo_transporte_id, envio_contenedor FROM envio WHERE envio_id_hash = ?', cnf.envio_hash);
        if(datos_transporte[0].envio_tipo_transporte_id == 2){
            contenedor = datos_transporte[0].envio_contenedor;
            url =`https://mojito-pro-api.azurewebsites.net/api/shipment/sharenew`;
            //"CRLU1191155"
            let datos = {
                ContainerRef: contenedor,
                CanUpload: true,
                CanDelete: true
            };
            
            const api = new XMLHttpRequest;
            api.open('POST', url, true);
            api.setRequestHeader('Content-type', 'application/json');
            api.setRequestHeader("Authorization", "Basic " + btoa("ITJustQuality:YKMQq8#k"));
            api.send(JSON.stringify(datos));
    
            api.onreadystatechange = function(){
                
                if(this.status == 200 && this.readyState == 4){
                    let message = JSON.parse(this.responseText);
                    url = message.url;
                    tk = true;
                    res.render(modules + 'tracking', { layout: layout + 'tracking.hbs', menuEnvio, menuTracking, envio_id: cnf.envio_hash, url, tk, envio_referencia, user });   

                }
                
                else if (this.status != 200 && this.readyState == 4){
                    console.log("dentro de status !=200");
                    tk = false;
                    res.render(modules + 'tracking', { layout: layout + 'tracking.hbs', menuEnvio, menuTracking, envio_id: cnf.envio_hash, tk, envio_referencia, user });   

                }
           
            }
            

        
        }else{
            console.log("transporte no maritimo");
            res.render(modules + 'tracking', { layout: layout + 'tracking.hbs', menuEnvio, menuTracking, envio_id: cnf.envio_hash, tk, envio_referencia, user });   
        }
    
    }catch(e){
            console.log(e);
        }
        

   
        //res.render(modules+'tracking', {layout: layout+'tracking.hbs', DATA, menuEnvio, menuTracking, user, control_id});
    },


    async getDestino(req, res) {
        let cnf_envio = await requested(req);
        //let idioma = req.params.idioma;
        let idioma = "es";
        const cnf = await requestedControl(cnf_envio.envio_id, idioma, "destino");
        const user = await getUserData(req);
        let solicitado = cnf.solicitado;
        const envio_referencia = await refEnvio(cnf_envio.envio_id);
        const menuDestino = true;
        
        if (solicitado) {
            const data = await getControlPdf(cnf);

            control_id = cnf.control;

            if (data.status === 'ok') {
                let DATA = data.data;

                //if(idioma === 'es'){
                res.render(modules + 'inspeccion-es', { layout: layout + 'inspeccion.hbs', DATA, solicitado, menuEnvio, menuDestino, envio_id: cnf_envio.envio_hash, user, control_id, envio_referencia });

                /*}else if(idioma === 'en'){
                res.render(modules+'inspeccion-precarga-en', {layout: layout+'inspeccion-precarga.hbs', DATA, menuEnvio, menuPrecarga, user, control_id});
    
                }else{
                    res.redirect('/ERROR/informe-web')
                }*/
            } else {
                res.redirect('/ERROR/informe-web')
            }
        } else {
            res.render(modules + 'inspeccion-es', { layout: layout + 'inspeccion.hbs', solicitado, menuEnvio, menuDestino, envio_id: cnf_envio.envio_hash, user });
        }
    },

    async getReclamaciones(req, res) {
        const user = await getUserData(req);
        let menuReclamaciones = true;
        let cnf = await requested(req);
        const envio_referencia = await refEnvio(cnf.envio_id);
        let reclamacion = await pool.query('SELECT envio_reclamacion FROM envio WHERE envio_id_hash = ?', [cnf.envio_hash]);
        reclamacion = reclamacion[0].envio_reclamacion;
        //res.render(modules+'reclamaciones', {layout: layout+'reclamaciones.hbs', DATA, menuEnvio, menuReclamaciones, user, control_id});
        res.render(modules + 'reclamaciones', { layout: layout + 'reclamaciones.hbs', menuEnvio, menuReclamaciones, envio_id: cnf.envio_hash, envio_referencia, user, reclamacion });
    },

    async getModDatos(req, res){
        const user = await getUserData(req);
        
        let cnf = await requested(req);
        
        if (await permisosEnvio(cnf.envio_id, cnf.user_id, cnf.rol)) {
            const envio_referencia = await refEnvio(cnf.envio_id);
            const menuDatos = true;

            const data = await getEnvioDatos(cnf.envio_id, cnf.envio_hash);
            console.log(JSON.stringify(data))
            switch (data.status) {
                case 'ok':
                    res.render(modules + 'mod-datos', { layout: layout + 'mod-datos.hbs', csrfToken: req.csrfToken(), data, envio_referencia, envio_id: cnf.envio_hash, user, nav });
                    break;
                case 'error':
                    res.redirect('/ERROR/envio/' + cnf.envio_hash + '/mod-datos');
                    break;
            }

        } else {
            console.log("ERROR: PERMISOS INSUFICIENTES getDatos USUARIO:" + cnf.user_id + " - ENVIO:" + cnf.envio_hash);
            res.redirect('/ERROR/unauthorized')
        }

    },

    async postDatos(req, res){
        let cnf = await requested(req);

        if(await permisosEnvio(cnf.envio_id, cnf.user_id, cnf.rol)){
            let response = await postEnvioDatos(cnf);
            res.json(response);
        }else{
            console.log("ERROR: PERMISOS INSUFICIENTES postDatos USUARIO:"+cnf.user_id+" - ENVIO:"+cnf.envio_hash);
            res.redirect('/ERROR/unauthorized')
        }

    },

};

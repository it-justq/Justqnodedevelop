const {escapeData} = require(appRoot+'/utils/ParseData');
const {idPrecarga, idDestino} = require(appRoot+'/utils/Envio/UtilCommon');
const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');

module.exports = {

    async requested(req){
        
        let envio_id_hash = await escapeData(req.params.envioId);
        
        let envio_id = await pool.query('SELECT envio_id FROM envio WHERE envio_id_hash = ?', [envio_id_hash]);
       
        envio_id = envio_id[0].envio_id;
        
        
        let requested = {
            envio_id: envio_id,
            envio_hash: envio_id_hash,
            user_id: parseInt(req.user.usuario_id),
            user: req.user.usuario_nombre,
            rol:  parseInt(req.user.usuario_rol_id),
            date: req.params.date,
            
            data: req.body,
            files: req.files,

            type: await escapeData(req.params.type),
            id: await escapeData(req.params.id),
            subId: await escapeData(req.params.subId),
           
        };

        return requested;
    },

    requestedEnvios(req){
        let requested = {
            data: null,
            date: req.params.date,
            usuario_id: parseInt(req.user.usuario_id),
            rol_id: parseInt(req.user.usuario_rol_id),
            user: req.user.usuario_nombre,
            type: 'total'
        };

        return requested;
    },
    requestedEnviosSearch(req){
        let requested = {
            data: req.body,
            date: req.params.date,
            usuario_id: parseInt(req.user.usuario_id),
            rol_id: parseInt(req.user.usuario_rol_id),
            user: req.user.usuario_nombre,
            type: 'search'
        };

        return requested;
    },

    async requestedControl(envio_id, idioma, type){
        let solicitado;
        let requested;
        if(type == "precarga"){
            solicitado = await pool.query('SELECT envio_inspeccion_precarga FROM envio WHERE envio_id = ?', [envio_id]);
            if(solicitado[0].envio_inspeccion_precarga == 1){
                control_id = await idPrecarga(envio_id);
                requested = {
                    solicitado : true,
                    control: control_id,
                    idioma: idioma
                };
            }else{
                requested = {solicitado : false};
            }
        }else if(type == "destino"){
            solicitado = await pool.query('SELECT envio_inspeccion_destino FROM envio WHERE envio_id = ?', [envio_id]);
            if(solicitado[0].envio_inspeccion_destino == 1){
                control_id = await idDestino(envio_id);
                requested = {
                    solicitado : true,
                    control: control_id,
                    idioma: idioma
                };
            }else{
                requested = {solicitado : false};
            }
        }


        return requested;
    },

    async requestedPost(req){
        let requested = {
            user_id: parseInt(await escapeData(req.user.usuario_id)),
            rol:  parseInt(await escapeData(req.user.usuario_rol_id)),
            data: req.body
        };

        return requested;
    },

};

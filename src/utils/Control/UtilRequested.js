const {idControl} = require('./ControlesMysql/UtilCommon');
const {escapeData} = require(appRoot+'/utils/ParseData');

module.exports = {

    async requested(req){

        let control_id_hash = await escapeData(req.params.controlId);
        let control_id = await idControl(control_id_hash);
        
        let requested = {
            control_id: control_id,
            control_hash: control_id_hash,
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

    requestedControles(req){
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
    requestedControlesSearch(req){
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

};

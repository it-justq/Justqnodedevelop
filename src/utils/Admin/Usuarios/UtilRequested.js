
module.exports = {

    requested(req){
        let requested = {
            control: parseInt(req.params.controlId),
            user_id: parseInt(req.user.usuario_id),
            user: req.user.usuario_nombre,
            rol:  parseInt(req.user.usuario_rol_id),
            date: req.params.date,
            
            data: req.body,
            files: req.files,

            type: req.params.type,
            id: parseInt(req.params.id),
            subId: parseInt(req.params.subId),
           
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
    requestedUsuarisSearch(req){
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

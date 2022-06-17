
module.exports = {

    requested(req){
        let requested = {
            user_id:  req.user.usuario_id,
            user: req.user.usuario_nombre,
            rol:  req.user.usuario_rol_id,
            pagina: req.params.pagina,
            id: req.params.id,
            data: req.body

        };

        return requested;
    },
    requestedSearch(req){
        let requested = {
            user_id:  req.user.usuario_id,
            user: req.user.usuario_nombre,
            rol:  req.user.usuario_rol_id,
            pagina: req.params.pagina,
            id: req.params.id,
            data: req.body
        };

        return requested;
    }


};

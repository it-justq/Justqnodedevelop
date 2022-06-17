const {escapeData} = require(appRoot+'/utils/ParseData');

module.exports = {

    async requestedGet(req){
        let requested = {
            user_id:  parseInt(await escapeData(req.user.usuario_id)),
            user: req.user.usuario_nombre,
            rol: parseInt(await escapeData(req.user.usuario_rol_id)),
        };

        return requested;
    },
    async requestedPost(req){
        let requested = {
            user_id: parseInt(await escapeData(req.user.usuario_id)),
            user: req.user.usuario_nombre,
            rol:  parseInt(await escapeData(req.user.usuario_rol_id)),
            data: req.body
        };

        return requested;
    }
   

};

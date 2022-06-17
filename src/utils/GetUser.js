module.exports = {

    getUserData(DATA){

        let user = {};

        user.id = DATA.user.usuario_id;
        user.nombre  = DATA.user.usuario_nombre;
        user.user = DATA.user.usuario_user;
        user.estado = DATA.user.usuario_estado_id;
        user.rol = DATA.user.usuario_rol_id;
        user.idioma = DATA.user.usuario_idioma_id;
        user.email = DATA.user.usuario_email
        user.ip = DATA.user.ip;

        return user;
        
    },//const {getUserData} = require(appRoot+'/utils/GetUser');

};
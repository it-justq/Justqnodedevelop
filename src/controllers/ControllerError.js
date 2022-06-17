const layout = '../../views/pages/error/';
const modules = 'modules/error/';

module.exports = {
    getErrorUnauthorized(req, res){
        const user = req.user.usuario_nombre;
        const msg = 'Lo sentimos, no tienes permisos para acceder al recurso';
        res.render(modules+'main', {layout: layout+'main.hbs', user, msg});
    },
    getErrorSecure(req, res){
        const user = req.user.usuario_nombre;
        const msg = 'El servidor no ha podido comprobar la integridad de los datos';
        res.render(modules+'main', {layout: layout+'main.hbs', user, msg});
    },

    getErrorControlGetData(req, res){
        const user = req.user.usuario_nombre;
        const msg = 'El servidor no ha podido obtener el apartado '+ req.params.route + ' del control con id: '+req.params.id;
        res.render(modules+'main', {layout: layout+'main.hbs', user, msg});
    },

    pageNotFound(req, res){
        res.send("<h2 style='width: 100%; display: block; text-align:center; margin-top: 10px;'>La página a la que intentas acceder no existe <a href='javascript:history.back(-1);' title='Ir la página anterior'>Volver</a><h2>");
    },
    getErrorUpload(req, res){
        res.send("<h2 style='width: 100%; display: block; text-align:center; margin-top: 10px;'>La página a la que intentas acceder no existe <a href='javascript:history.back(-1);' title='Ir la página anterior'>Volver</a><h2>");
    },

    getErrorNotAvailable(req, res){
        res.send("<h2 style='width: 100%; display: block; text-align:center; margin-top: 10px;'>La página a la que intentas acceder no está disponible actualmente <a href='javascript:history.back(-1);' title='Ir la página anterior'>Volver</a><h2>");
    },

    getErrorError(req,res){
        res.send("<h2 style='width: 100%; display: block; text-align:center; margin-top: 10px;'>Ocurrió un error <a href='javascript:history.back(-1);' title='Ir la página anterior'>Volver</a><h2>");

    },
    getErrorPericial(req,res){
        const user = req.user.usuario_nombre;
        const msg = 'El servidor no ha podido obtener el apartado '+ req.params.route + ' del pericial con id: '+req.params.id;
        res.render(modules+'main', {layout: layout+'main.hbs', user, msg});
    }

};
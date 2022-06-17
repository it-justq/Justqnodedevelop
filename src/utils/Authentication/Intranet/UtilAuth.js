module.exports = {

    isLoggedIn(req, res, next){

        if(req.isAuthenticated()){
            return next();
        }else{
            req.session.returnTo = req.originalUrl;
            return res.redirect('/intranet/login');
        }
    },

    isNotLoggedIn(req, res, next){
        
        if(!req.isAuthenticated()){
            return next();
        }else{
            return res.redirect('/intranet');
        }
    },

    isLoggedInIntranet(req, res, next){

        if(req.isAuthenticated()){
            
            if(req.user.usuario_rol_id === 1 || req.user.usuario_rol_id === 2){
                return next();
            }else if(req.user.usuario_rol_id === 3){
                return res.redirect('/clientes');
            }else{
                return res.redirect('/ERROR/unauthorized')
            }

        }else{
            return res.redirect('/intranet/login');
        }
    },

    isLoggedInClientes(req, res, next){

        if(req.isAuthenticated()){
            
            if(req.user.usuario_rol_id === 3){
                return next();
            }else if(req.user.usuario_rol_id === 1 || req.user.usuario_rol_id === 2){
                return res.redirect('/intranet');
            }else{
                return res.redirect('/ERROR/unauthorized')
            }

        }else{
            return res.redirect('/intranet/login');
        }
    },


    isLoggedInAdmin(req, res, next){

        if(req.isAuthenticated()){
            
            if(req.user.usuario_rol_id === 1){
                return next();
            }else{
                return res.redirect('/intranet');
            }

        }else{
            return res.redirect('/intranet/login');
        }
    }


};
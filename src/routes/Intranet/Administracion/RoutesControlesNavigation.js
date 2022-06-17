const express = require ('express');
const router = express.Router();
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

const {isLoggedInIntranet, isLoggedInAdmin} = require(appRoot+'/utils/Authentication/Intranet/UtilAuth');

const {getControles, getControlesSearch, getTipoControl, postTipoControl, postEditarTipoControl, postNuevoGrupoControl, postNuevoPuntoControl} = require(appRoot+'/controllers/ControllerIntranet/Administracion/Controles/ControllerAdminControles');
const {getControlesEn, getControlesSearchEn, getTipoControlEn, postTipoControlEn, postEditarTipoControlEn, postNuevoGrupoControlEn, postNuevoPuntoControlEn} = require(appRoot+'/controllers/ControllerIntranet/Administracion/Controles/en/ControllerAdminControlesEn');

const {getNuevoTipoControl, postNuevoTipoControl} = require(appRoot+'/controllers/ControllerIntranet/Administracion/Controles/ControllerControlesNuevo');
const {getNuevoTipoControlEn, postNuevoTipoControlEn} = require(appRoot+'/controllers/ControllerIntranet/Administracion/Controles/en/ControllerControlesNuevoEn');
/*
router.get('/:pagina', isLoggedInAdmin, (req, res) => {
	res.redirect('/intranet/administracion/controles');
});
*/

router.get('/', isLoggedInIntranet, getControles);
router.get('/en', isLoggedInIntranet, getControlesEn);

router.post('/search', isLoggedInIntranet, csrfProtection, getControlesSearch);
router.post('/en/search', isLoggedInIntranet, csrfProtection, getControlesSearchEn);

router.get('/nuevo', isLoggedInIntranet, getNuevoTipoControl);
router.post('/nuevo', isLoggedInIntranet, csrfProtection, postNuevoTipoControl);

router.get('/en/nuevo', isLoggedInIntranet, getNuevoTipoControlEn);
router.post('/en/nuevo', isLoggedInIntranet, csrfProtection, postNuevoTipoControlEn);

router.get('/tipo-control/:id', isLoggedInIntranet, getTipoControl);
router.post('/tipo-control/:id', isLoggedInIntranet, csrfProtection, postTipoControl);

router.get('/en/tipo-control/:id', isLoggedInIntranet, getTipoControlEn);
router.post('/en/tipo-control/:id', isLoggedInIntranet, csrfProtection, postTipoControlEn);

router.post('/tipo-control/:id/editar', isLoggedInIntranet, csrfProtection, postEditarTipoControl);

router.post('/en/tipo-control/:id/editar', isLoggedInIntranet, csrfProtection, postEditarTipoControlEn);

router.post('/tipo-control/:id/grupos-control/nuevo', isLoggedInIntranet, csrfProtection, postNuevoGrupoControl);

router.post('/en/tipo-control/:id/grupos-control/nuevo', isLoggedInIntranet, csrfProtection, postNuevoGrupoControlEn);

router.post('/tipo-control/:id/grupos-control/:idGC/puntos-control/nuevo', isLoggedInIntranet, csrfProtection, postNuevoPuntoControl);

router.post('/en/tipo-control/:id/grupos-control/:idGC/puntos-control/nuevo', isLoggedInIntranet, csrfProtection, postNuevoPuntoControlEn);





module.exports = router;
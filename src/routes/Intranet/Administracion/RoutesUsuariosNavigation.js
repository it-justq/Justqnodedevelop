const express = require ('express');
const router = express.Router();
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

const {isLoggedInAdmin} = require(appRoot+'/utils/Authentication/Intranet/UtilAuth');

const {getUsuarios, getUsuariosSearch, getUsuario} = require(appRoot+'/controllers/ControllerIntranet/Administracion/Usuarios/ControllerAdminUsuarios');
const {getDatosUsuario, postDatosUsuario} = require(appRoot+'/controllers/ControllerIntranet/Administracion/Usuarios/Usuario/ControllerUsuarioDatos');
const {getPermisosUsuario, postPermisosUsuario, postDeletePermisosUsuario} = require(appRoot+'/controllers/ControllerIntranet/Administracion/Usuarios/Usuario/ControllerUsuarioPermisos');
const {getControlesUsuario, postControlesUsuario} = require(appRoot+'/controllers/ControllerIntranet/Administracion/Usuarios/Usuario/ControllerUsuarioControles');
const {getFamiliasUsuario, postFamiliasUsuario} = require(appRoot+'/controllers/ControllerIntranet/Administracion/Usuarios/Usuario/ControllerUsuarioFamilias');
const {getClientesUsuario, postClientesUsuario} = require(appRoot+'/controllers/ControllerIntranet/Administracion/Usuarios/Usuario/ControllerUsuarioClientes');
const {getPreferenciasUsuario, postPreferenciasUsuario} = require(appRoot+'/controllers/ControllerIntranet/Administracion/Usuarios/Usuario/ControllerUsuarioPreferencias');
const {getNuevoUsuario, postNuevoUsuario} = require(appRoot+'/controllers/ControllerIntranet/Administracion/Usuarios/ControllerUsuarioNuevo');

const {getUsuariosEn, getUsuariosSearchEn, getUsuarioEn} = require(appRoot+'/controllers/ControllerIntranet/Administracion/Usuarios/en/ControllerAdminUsuariosEn');
const {getDatosUsuarioEn, postDatosUsuarioEn} = require(appRoot+'/controllers/ControllerIntranet/Administracion/Usuarios/Usuario/en/ControllerUsuarioDatosEn');
const {getPermisosUsuarioEn, postPermisosUsuarioEn, postDeletePermisosUsuarioEn} = require(appRoot+'/controllers/ControllerIntranet/Administracion/Usuarios/Usuario/en/ControllerUsuarioPermisosEn');
const {getControlesUsuarioEn, postControlesUsuarioEn} = require(appRoot+'/controllers/ControllerIntranet/Administracion/Usuarios/Usuario/en/ControllerUsuarioControlesEn');
const {getFamiliasUsuarioEn, postFamiliasUsuarioEn} = require(appRoot+'/controllers/ControllerIntranet/Administracion/Usuarios/Usuario/en/ControllerUsuarioFamiliasEn');
const {getClientesUsuarioEn, postClientesUsuarioEn} = require(appRoot+'/controllers/ControllerIntranet/Administracion/Usuarios/Usuario/en/ControllerUsuarioClientesEn');
const {getPreferenciasUsuarioEn, postPreferenciasUsuarioEn} = require(appRoot+'/controllers/ControllerIntranet/Administracion/Usuarios/Usuario/en/ControllerUsuarioPreferenciasEn');
const {getNuevoUsuarioEn, postNuevoUsuarioEn} = require(appRoot+'/controllers/ControllerIntranet/Administracion/Usuarios/en/ControllerUsuarioNuevoEn');


/*router.get('/', isLoggedInAdmin, (req, res) => {
	res.redirect('/intranet/administracion/usuarios/1');
});*/

router.get('/nuevo', isLoggedInAdmin, getNuevoUsuario);
router.post('/nuevo', isLoggedInAdmin, csrfProtection, postNuevoUsuario);
router.get('/en/nuevo', isLoggedInAdmin, getNuevoUsuarioEn);
router.post('/en/nuevo', isLoggedInAdmin, csrfProtection, postNuevoUsuarioEn);

//router.get('/:pagina', isLoggedInAdmin, getUsuarios);
router.get('/', isLoggedInAdmin, getUsuarios);
router.post('/search', isLoggedInAdmin, csrfProtection, getUsuariosSearch);
router.get('/en', isLoggedInAdmin, getUsuariosEn);
router.post('/en/search', isLoggedInAdmin, csrfProtection, getUsuariosSearchEn);

router.get('/usuario/:id', isLoggedInAdmin, getUsuario);
router.get('/en/usuario/:id', isLoggedInAdmin, getUsuarioEn);

router.get('/usuario/:id/datos', isLoggedInAdmin, getDatosUsuario);
router.post('/usuario/:id/datos', isLoggedInAdmin, csrfProtection, postDatosUsuario);
router.get('/en/usuario/:id/datos', isLoggedInAdmin, getDatosUsuarioEn);
router.post('/en/usuario/:id/datos', isLoggedInAdmin, csrfProtection, postDatosUsuarioEn);

router.get('/usuario/:id/permisos', isLoggedInAdmin, getPermisosUsuario);
router.post('/usuario/:id/permisos', isLoggedInAdmin, csrfProtection, postPermisosUsuario);
router.get('/en/usuario/:id/permisos', isLoggedInAdmin, getPermisosUsuarioEn);
router.post('/en/usuario/:id/permisos', isLoggedInAdmin, csrfProtection, postPermisosUsuarioEn);

router.post('/usuario/:id/permisos/eliminar', isLoggedInAdmin, csrfProtection, postDeletePermisosUsuario);
router.post('/en/usuario/:id/permisos/eliminar', isLoggedInAdmin, csrfProtection, postDeletePermisosUsuarioEn);

router.get('/usuario/:id/controles', isLoggedInAdmin, getControlesUsuario);
router.post('/usuario/:id/controles', isLoggedInAdmin, csrfProtection, postControlesUsuario);
router.get('/en/usuario/:id/controles', isLoggedInAdmin, getControlesUsuarioEn);
router.post('/en/usuario/:id/controles', isLoggedInAdmin, csrfProtection, postControlesUsuarioEn);

router.get('/usuario/:id/familias', isLoggedInAdmin, getFamiliasUsuario);
router.post('/usuario/:id/familias', isLoggedInAdmin, csrfProtection, postFamiliasUsuario);
router.get('/en/usuario/:id/familias', isLoggedInAdmin, getFamiliasUsuarioEn);
router.post('/en/usuario/:id/familias', isLoggedInAdmin, csrfProtection, postFamiliasUsuarioEn);

router.get('/usuario/:id/clientes', isLoggedInAdmin, getClientesUsuario);
router.post('/usuario/:id/clientes', isLoggedInAdmin, csrfProtection, postClientesUsuario);
router.get('/en/usuario/:id/clientes', isLoggedInAdmin, getClientesUsuarioEn);
router.post('/en/usuario/:id/clientes', isLoggedInAdmin, csrfProtection, postClientesUsuarioEn);

router.get('/usuario/:id/preferencias', isLoggedInAdmin, getPreferenciasUsuario);
router.post('/usuario/:id/preferencias', isLoggedInAdmin, csrfProtection, postPreferenciasUsuario);
router.get('/en/usuario/:id/preferencias', isLoggedInAdmin, getPreferenciasUsuarioEn);
router.post('/en/usuario/:id/preferencias', isLoggedInAdmin, csrfProtection, postPreferenciasUsuarioEn);


module.exports = router;
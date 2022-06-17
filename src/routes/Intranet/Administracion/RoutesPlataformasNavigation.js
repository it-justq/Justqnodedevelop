const express = require ('express');
const router = express.Router();
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

const {isLoggedInIntranet, isLoggedInAdmin} = require(appRoot+'/utils/Authentication/Intranet/UtilAuth');

const {getPlataformas, getPlataformasSearch, getPlataforma, postEditarPlataforma} = require(appRoot+'/controllers/ControllerIntranet/Administracion/Plataformas/ControllerAdminPlataformas');
const {getPlataformasEn, getPlataformasSearchEn, getPlataformaEn, postEditarPlataformaEn} = require(appRoot+'/controllers/ControllerIntranet/Administracion/Plataformas/en/ControllerAdminPlataformasEn');

const {postNuevoPlataforma, getNuevoPlataforma} = require(appRoot+'/controllers/ControllerIntranet/Administracion/Plataformas/ControllerPlataformaNuevo');
const {postNuevoPlataformaEn, getNuevoPlataformaEn} = require(appRoot+'/controllers/ControllerIntranet/Administracion/Plataformas/en/ControllerPlataformaNuevoEn');

/*
router.get('/:pagina', isLoggedInIntranet, (req, res) => {
	res.redirect('/intranet/administracion/plataformas');
});*/


router.get('/', isLoggedInIntranet, getPlataformas);
router.post('/search', isLoggedInIntranet, csrfProtection, getPlataformasSearch);

router.get('/en', isLoggedInIntranet, getPlataformasEn);
router.post('/en/search', isLoggedInIntranet, csrfProtection, getPlataformasSearchEn);

router.get('/plataforma/editar-plataforma', isLoggedInIntranet, getPlataforma);
router.post('/plataforma/editar-plataforma', isLoggedInIntranet, csrfProtection, postEditarPlataforma);

router.get('/en/plataforma/editar-plataforma', isLoggedInIntranet, getPlataformaEn);
router.post('/en/plataforma/editar-plataforma', isLoggedInIntranet, csrfProtection, postEditarPlataformaEn);

router.get('/nuevo', isLoggedInIntranet, getNuevoPlataforma);
router.post('/nuevo', isLoggedInIntranet, csrfProtection, postNuevoPlataforma);

router.get('/en/nuevo', isLoggedInIntranet, getNuevoPlataformaEn);
router.post('/en/nuevo', isLoggedInIntranet, csrfProtection, postNuevoPlataformaEn);



module.exports = router;
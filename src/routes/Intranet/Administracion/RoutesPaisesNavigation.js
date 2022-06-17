const express = require ('express');
const router = express.Router();
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

const {isLoggedInAdmin} = require(appRoot+'/utils/Authentication/Intranet/UtilAuth');

const {getPaises, getPaisesSearch, getPaisesNuevo, postPaisesNuevo} = require(appRoot+'/controllers/ControllerIntranet/Administracion/Paises/ControllerAdminPaises');
const {getPaisesEn, getPaisesSearchEn, getPaisesNuevoEn, postPaisesNuevoEn} = require(appRoot+'/controllers/ControllerIntranet/Administracion/Paises/en/ControllerAdminPaisesEn');


/*
router.get('/:pagina', isLoggedInAdmin, (req, res) => {
	res.redirect('/intranet/administracion/paises');
});*/

router.get('/', isLoggedInAdmin, getPaises);
router.post('/search', isLoggedInAdmin, csrfProtection, getPaisesSearch);

router.get('/en', isLoggedInAdmin, getPaisesEn);
router.post('/en/search', isLoggedInAdmin, csrfProtection, getPaisesSearchEn);

router.get('/nuevo', isLoggedInAdmin, getPaisesNuevo);
router.post('/nuevo', isLoggedInAdmin, csrfProtection, postPaisesNuevo);

router.get('/en/nuevo', isLoggedInAdmin, getPaisesNuevoEn);
router.post('/en/nuevo', isLoggedInAdmin, csrfProtection, postPaisesNuevoEn);

module.exports = router;
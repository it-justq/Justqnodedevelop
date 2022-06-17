const express = require ('express');
const router = express.Router();
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

const {isLoggedInIntranet} = require(appRoot+'/utils/Authentication/Intranet/UtilAuth');
const {getControles, getControlesSearch, getControlesFinalizados, getControlesPendientes} = require(appRoot+'/controllers/ControllerIntranet/Controles/ControllerNavigationControles');
const {getControlesEn, getControlesSearchEn, getControlesFinalizadosEn, getControlesPendientesEn} = require(appRoot+'/controllers/ControllerIntranet/Controles/en/ControllerNavigationControlesEn');
const {getPericiales} = require(appRoot+'/controllers/ControllerIntranet/Periciales/ControllerNavigationPericiales');

/*router.get('/', isLoggedInIntranet, getControles);
router.post('/search', isLoggedInIntranet, csrfProtection, getControlesSearch);

router.get('/en', isLoggedInIntranet, getControlesEn);
router.post('/en/search', isLoggedInIntranet, csrfProtection, getControlesSearchEn);*/

router.post('/en/search', isLoggedInIntranet, csrfProtection, getControlesSearchEn);
router.get('/en/pendientes', isLoggedInIntranet, getControlesPendientesEn);
router.get('/en/finalizados/:pagina', isLoggedInIntranet, getControlesFinalizadosEn);
router.get('/en/:pagina', isLoggedInIntranet, getControlesEn);

router.get('/en', isLoggedInIntranet, (req, res) => {
	res.redirect('/intranet/controles/en/1');
});

router.get('/pendientes', isLoggedInIntranet, getControlesPendientes);
router.get('/finalizados/:pagina', isLoggedInIntranet, getControlesFinalizados);
router.post('/search', isLoggedInIntranet, csrfProtection, getControlesSearch);
router.get('/:pagina', isLoggedInIntranet, getControles);


/*router.post('/en/search', isLoggedInIntranet, (req, res) => {
	res.redirect(307, '/intranet/controles/en/search/1');
});

router.post('/search', isLoggedInIntranet, (req, res) => {
	res.redirect(307, '/intranet/controles/search/1');
});*/


router.get('/', isLoggedInIntranet, (req, res) => {
	res.redirect('/intranet/controles/1');
});


module.exports = router;
const express = require ('express');
const router = express.Router();
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

const {isLoggedInIntranet} = require(appRoot+'/utils/Authentication/Intranet/UtilAuth');
const {getPlantillas, postNuevoControlPlantilla} = require(appRoot+'/controllers/ControllerIntranet/Plantillas/ControllerNavigationPlantillas');
const {getPlantillasEn, postNuevoControlPlantillaEn} = require(appRoot+'/controllers/ControllerIntranet/Plantillas/en/ControllerNavigationPlantillasEn');


router.get('/:pagina', isLoggedInIntranet, getPlantillas);
router.post('/:id/nuevo/control', isLoggedInIntranet, postNuevoControlPlantilla);

router.get('/en/:pagina', isLoggedInIntranet, getPlantillasEn);
router.post('/en/:id/nuevo/control', isLoggedInIntranet, postNuevoControlPlantillaEn);


router.get('/en', isLoggedInIntranet, (req, res) => {
	res.redirect('/intranet/plantillas/en/1');
});

router.get('/', isLoggedInIntranet, (req, res) => {
	res.redirect('/intranet/plantillas/1');
});



//router.post('/search', isLoggedInIntranet, csrfProtection, getPlantillasSearch);


module.exports = router;
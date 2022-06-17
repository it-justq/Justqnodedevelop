//INTRANET NAVIGATOR
const express = require ('express');
const router = express.Router();

const {isLoggedInClientes} = require(appRoot+'/utils/Authentication/Intranet/UtilAuth');

const {getControles, getControlesSearch} = require(appRoot+'/controllers/ControllerClientes/Controles/ControllerNavigationControles');
const {getControlesEn, getControlesSearchEn} = require(appRoot+'/controllers/ControllerClientes/Controles/en/ControllerNavigationControlesEn');


router.get('/en/:pagina', isLoggedInClientes, getControlesEn);
router.post('/en/search/', isLoggedInClientes, getControlesSearchEn);


router.get('/en', isLoggedInClientes, (req, res) => {
	res.redirect('/clientes/controles/en/1');
});

router.get('/:pagina', isLoggedInClientes, getControles);
router.post('/search/', isLoggedInClientes, getControlesSearch);

router.get('/', isLoggedInClientes, (req, res) => {
	res.redirect('/clientes/controles/1');
});


module.exports = router;
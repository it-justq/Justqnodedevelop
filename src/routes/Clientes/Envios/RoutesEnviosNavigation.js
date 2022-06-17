//INTRANET NAVIGATOR
const express = require ('express');
const router = express.Router();

const {isLoggedInClientes} = require(appRoot+'/utils/Authentication/Intranet/UtilAuth');

const {getEnvios} = require(appRoot+'/controllers/ControllerClientes/Envios/ControllerNavigationEnvios');
const {getEnviosEn} = require(appRoot+'/controllers/ControllerClientes/Envios/en/ControllerNavigationEnviosEn');


//router.get('/en/:pagina', isLoggedInClientes, getEnviosEn);
//router.post('/en/search/', isLoggedInClientes, getEnviosSearchEn);


/*router.get('/en', isLoggedInClientes, (req, res) => {
	res.redirect('/clientes/envios/en/1');
});*/

router.get('/:pagina', isLoggedInClientes, getEnvios);
//router.post('/search/', isLoggedInClientes, getEnviosSearch);

router.get('/', isLoggedInClientes, (req, res) => {
	res.redirect('/clientes/envios/1');
});



module.exports = router;
const express = require ('express');
const router = express.Router();
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

const {isLoggedInClientes} = require(appRoot+'/utils/Authentication/Intranet/UtilAuth');
//Datos
const {getDatos} = require(appRoot+'/controllers/ControllerClientes/Envios/ControllerNavigationEnvio');
router.get('/:envioId', isLoggedInClientes, csrfProtection, getDatos);

router.get('/:envioId/datos', isLoggedInClientes, csrfProtection, getDatos);
//en
/*const {getDatosEn} = require(appRoot+'/controllers/ControllerClientes/Envios/ControllerNavigationEnvio');
router.get('/en/:envioId', isLoggedInIntranet, csrfProtection, getDatosEn);

router.get('/en/:envioId/datos', isLoggedInIntranet, csrfProtection, getDatosEn);*/

//Precarga
const {getPrecarga} = require(appRoot+'/controllers/ControllerClientes/Envios/ControllerNavigationEnvio');
router.get('/:envioId/inspeccion-precarga', isLoggedInClientes, csrfProtection, getPrecarga);


//en
/*const {getPrecargaEn} = require(appRoot+'/controllers/ControllerClientes/Envios/ControllerNavigationEnvio');
router.get('/en/:envioId/inspeccion-precarga', isLoggedInIntranet, csrfProtection, getPrecargaEn);*/

//Termógrafo
const {getTermografo} = require(appRoot+'/controllers/ControllerClientes/Envios/ControllerNavigationEnvio');
router.get('/:envioId/termografo', isLoggedInClientes, csrfProtection, getTermografo);
//en
/*const {getTermografoEn} = require(appRoot+'/controllers/ControllerClientes/Envios/ControllerNavigationEnvio');
router.get('/en/:envioId/termografo', isLoggedInIntranet, csrfProtection, getTermografoEn);*/

//Tracking
const {getTracking} = require(appRoot+'/controllers/ControllerClientes/Envios/ControllerNavigationEnvio');
router.get('/:envioId/tracking', isLoggedInClientes, csrfProtection, getTracking);
//en
/*const {getTrackingEn} = require(appRoot+'/controllers/ControllerClientes/Envios/ControllerNavigationEnvio');
router.get('/en/:envioId/tracking', isLoggedInIntranet, csrfProtection, getTrackingEn);*/

//Destino
const {getDestino} = require(appRoot+'/controllers/ControllerClientes/Envios/ControllerNavigationEnvio');
router.get('/:envioId/inspeccion-destino', isLoggedInClientes, csrfProtection, getDestino);
//en
/*const {getDestinoEn} = require(appRoot+'/controllers/ControllerClientes/Envios/ControllerNavigationEnvio');
router.get('/en/:envioId/inspeccion-destino', isLoggedInIntranet, csrfProtection, getDestinoEn);*/

//Reclamaciones
const {getReclamaciones} = require(appRoot+'/controllers/ControllerClientes/Envios/ControllerNavigationEnvio');
router.get('/:envioId/reclamaciones', isLoggedInClientes, csrfProtection, getReclamaciones);
//en
/*const {getgetReclamacionesEn} = require(appRoot+'/controllers/ControllerClientes/Envios/ControllerNavigationEnvio');
router.get('/en/:envioId/reclamaciones', isLoggedInIntranet, csrfProtection, getgetReclamacionesEn);*/

//Modificar datos
const {getModDatos, postDatos} = require(appRoot+'/controllers/ControllerClientes/Envios/ControllerNavigationEnvio');
router.get('/:envioId/mod-datos', isLoggedInClientes, csrfProtection, getModDatos);
router.post('/:envioId/mod-datos', isLoggedInClientes, csrfProtection, postDatos);

module.exports = router;
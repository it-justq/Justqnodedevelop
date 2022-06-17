const express = require ('express');
const router = express.Router();
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

const {isLoggedInIntranet} = require(appRoot+'/utils/Authentication/Intranet/UtilAuth');


//INFORMACION
const {getInformacion, postInformacion} = require(appRoot+'/controllers/ControllerIntranet/Periciales/Pericial/ControllerPericialInformacion');
router.get('/:controlId', isLoggedInIntranet, csrfProtection, getInformacion);

router.get('/:controlId/informacion', isLoggedInIntranet, csrfProtection, getInformacion);
router.post('/:controlId/informacion/mod', isLoggedInIntranet, csrfProtection, postInformacion);

//DATOS
const {getDatos, postDatos} = require(appRoot+'/controllers/ControllerIntranet/Periciales/Pericial/ControllerPericialDatos');
router.get('/:controlId/datos', isLoggedInIntranet, csrfProtection, getDatos);
router.post('/:controlId/datos/mod', isLoggedInIntranet, csrfProtection, postDatos);


//GRUPOS DE CONTROL
const {getGruposControl, postGruposControl, getPuntoControlFotos, postPuntoControlFotos, deleteFotosPc, deleteFotoPc} = require(appRoot+'/controllers/ControllerIntranet/Periciales/Pericial/ControllerPericialGruposControl');
router.get('/:controlId/grupos-control', isLoggedInIntranet, csrfProtection, getGruposControl);
router.post('/:controlId/grupos-control', isLoggedInIntranet, csrfProtection, postGruposControl);
//PUNTO DE CONTROL FOTOS
router.get('/:controlId/punto-control/:id/fotos', isLoggedInIntranet, csrfProtection, getPuntoControlFotos);
router.post('/:controlId/punto-control/:id/fotos', isLoggedInIntranet, csrfProtection, postPuntoControlFotos);
router.delete('/:controlId/punto-control/:id/fotos', isLoggedInIntranet, csrfProtection, deleteFotosPc);
router.delete('/:controlId/punto-control/:id/foto/:subId', isLoggedInIntranet, csrfProtection, deleteFotoPc);



//NOTIFICACIONES DEL CONTROL
const {sendMailPericialCliente} = require(appRoot+'/controllers/ControllerIntranet/Periciales/Pericial/ControllerPericialNotificaciones');
router.post('/:controlId/enviar/email/cliente', isLoggedInIntranet, csrfProtection, sendMailPericialCliente);



const {deleteInforme} = require(appRoot+'/controllers/ControllerIntranet/Periciales/Pericial/ControllerPericialConfiguracion');
router.post('/:controlId/eliminar', isLoggedInIntranet, csrfProtection, deleteInforme);



module.exports = router;
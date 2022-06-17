//INTRANET NAVIGATOR
const express = require ('express');
const router = express.Router();

const {isLoggedIn} = require(appRoot+'/utils/Authentication/Intranet/UtilAuth');

const {getInformeWeb} = require(appRoot+'/controllers/ControllerInformes/ControllerWeb');
const {getInformePdf, getInformeControlPdf} = require(appRoot+'/controllers/ControllerInformes/ControllerPdf');
const {getRegistro, postRegistro} = require(appRoot+'/controllers/ControllerInformes/ControllerRegistro');
const {getRegistroEn, postRegistroEn} = require(appRoot+'/controllers/ControllerInformes/en/ControllerRegistroEn');


router.get('/web/:controlId/:idioma', isLoggedIn, getInformeWeb);

router.get('/pdf/:idioma/:controlId', getInformePdf);
router.get('/pdf/control/:controlId/:idioma', getInformeControlPdf); //Generador de la web para el pdf

router.get('/registro', isLoggedIn, getRegistro);
router.post('/registro', isLoggedIn, postRegistro);

router.get('/registro/en', isLoggedIn, getRegistroEn);
router.post('/registro/en', isLoggedIn, postRegistroEn);


module.exports = router;
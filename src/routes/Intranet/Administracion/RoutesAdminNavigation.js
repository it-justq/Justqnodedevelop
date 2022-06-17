//ADMIN NAVIGATOR
const express = require ('express');
const router = express.Router();


const {isLoggedInIntranet, isLoggedInAdmin} = require(appRoot+'/utils/Authentication/Intranet/UtilAuth');

const {getAdministracion} = require(appRoot+'/controllers/ControllerIntranet/Administracion/ControllerAdminNavigation');
const {getAdministracionEn} = require(appRoot+'/controllers/ControllerIntranet/Administracion/en/ControllerAdminNavigationEn');


router.get('/', isLoggedInAdmin, getAdministracion);
router.get('/en', isLoggedInAdmin, getAdministracionEn);


module.exports = router;
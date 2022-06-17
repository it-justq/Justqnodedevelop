const express = require ('express');
const router = express.Router();
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

const {isLoggedInIntranet} = require(appRoot+'/utils/Authentication/Intranet/UtilAuth');

const {getControlNuevo, postControlNuevo} = require(appRoot+'/controllers/ControllerIntranet/Controles/ControllerNuevoControl');
const {getControlNuevoEn, postControlNuevoEn} = require(appRoot+'/controllers/ControllerIntranet/Controles/en/ControllerNuevoControlEn');


router.get('/', isLoggedInIntranet, csrfProtection, getControlNuevo);
router.post('/', isLoggedInIntranet, csrfProtection, postControlNuevo);

router.get('/en', isLoggedInIntranet, csrfProtection, getControlNuevoEn);
router.post('/en', isLoggedInIntranet, csrfProtection, postControlNuevoEn);


module.exports = router;
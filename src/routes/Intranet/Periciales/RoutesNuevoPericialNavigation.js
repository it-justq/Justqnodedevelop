const express = require ('express');
const router = express.Router();
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

const {isLoggedInIntranet} = require(appRoot+'/utils/Authentication/Intranet/UtilAuth');

const {getPericialNuevo, postPericialNuevo} = require(appRoot+'/controllers/ControllerIntranet/Periciales/ControllerNuevoPericial');


router.get('/', isLoggedInIntranet, csrfProtection, getPericialNuevo);
router.post('/', isLoggedInIntranet, csrfProtection, postPericialNuevo);


module.exports = router;
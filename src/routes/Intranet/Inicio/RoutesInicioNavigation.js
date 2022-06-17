//INTRANET NAVIGATOR
const express = require ('express');
const router = express.Router();

const {isLoggedInIntranet} = require(appRoot+'/utils/Authentication/Intranet/UtilAuth');

const {getInicio} = require(appRoot+'/controllers/ControllerIntranet/Inicio/ControllerInicio');


router.get('/', isLoggedInIntranet, getInicio);




module.exports = router;
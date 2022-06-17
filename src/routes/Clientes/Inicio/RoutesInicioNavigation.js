//INTRANET NAVIGATOR
const express = require ('express');
const router = express.Router();

const {isLoggedInClientes} = require(appRoot+'/utils/Authentication/Intranet/UtilAuth');

const {getInicio} = require(appRoot+'/controllers/ControllerClientes/Inicio/ControllerInicio');


router.get('/', isLoggedInClientes, getInicio);




module.exports = router;
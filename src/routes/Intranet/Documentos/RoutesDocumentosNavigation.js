//INTRANET NAVIGATOR
const express = require ('express');
const router = express.Router();

const {isLoggedInIntranet} = require(appRoot+'/utils/Authentication/Intranet/UtilAuth');

const {getDocumentos} = require(appRoot+'/controllers/ControllerIntranet/Documentos/ControllerDocumentos');


router.get('/', isLoggedInIntranet, getDocumentos);




module.exports = router;
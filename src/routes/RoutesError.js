//INTRANET NAVIGATOR
const express = require ('express');
const router = express.Router();

const {isLoggedIn, isLoggedInIntranet} = require(appRoot+'/utils/Authentication/Intranet/UtilAuth');

const {getErrorUnauthorized, getErrorUpload, getErrorSecure, getErrorControlGetData, getErrorNotAvailable, getErrorError, getErrorPericial} = require(appRoot+'/controllers/ControllerError');



//ERRORES
router.get('/unauthorized', isLoggedIn, getErrorUnauthorized);
router.get('/secure', isLoggedIn, getErrorSecure);
router.get('/pdf', isLoggedIn, getErrorUnauthorized);
router.get('/informe-web', isLoggedIn, getErrorUnauthorized);
router.get('/upload', isLoggedIn, getErrorUpload);
router.get('/not-available', isLoggedIn, getErrorNotAvailable);
router.get('/error', isLoggedIn, getErrorError);


router.get('/pericial/:id/:route', isLoggedIn, getErrorPericial);


router.get('/control/:id/:route', isLoggedInIntranet, getErrorControlGetData);



module.exports = router;
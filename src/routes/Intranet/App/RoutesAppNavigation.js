//INTRANET NAVIGATOR
const express = require ('express');
const router = express.Router();

const {isLoggedInIntranet} = require(appRoot+'/utils/Authentication/Intranet/UtilAuth');

const {getApp} = require(appRoot+'/controllers/ControllerIntranet/App/ControllerApp');


router.get('/', isLoggedInIntranet, getApp);


module.exports = router;
const express = require ('express');
const router = express.Router();
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

const {isLoggedInIntranet} = require(appRoot+'/utils/Authentication/Intranet/UtilAuth');
const {getPericiales, getPericialesSearch} = require(appRoot+'/controllers/ControllerIntranet/Periciales/ControllerNavigationPericiales');


router.get('/', isLoggedInIntranet, getPericiales);
router.post('/search', isLoggedInIntranet, csrfProtection, getPericialesSearch);

module.exports = router;
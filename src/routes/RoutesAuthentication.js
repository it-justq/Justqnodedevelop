const express = require ('express');
const router = express.Router();
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

const {getLogin, postLogin, getLogout} = require(appRoot+'/controllers/ControllerAuthentication');
const {isLoggedIn, isNotLoggedIn} = require(appRoot+'/utils/Authentication/Intranet/UtilAuth');


router.get('/login', isNotLoggedIn, csrfProtection, getLogin);

router.post('/login', isNotLoggedIn, csrfProtection,  (req, res, next) => {
    postLogin(req, res, next);
});

router.get('/logout', isLoggedIn, csrfProtection, getLogout);

module.exports = router;
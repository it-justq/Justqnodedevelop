const express = require ('express');
const router = express.Router();

const {isLoggedIn} = require(appRoot+'/utils/Authentication/Intranet/UtilAuth');

const {getPerfil, postPerfil} = require(appRoot+'/controllers/ControllerIntranet/Perfil/ControllerPerfil');
const {getPerfilEn, postPerfilEn} = require(appRoot+'/controllers/ControllerIntranet/Perfil/en/ControllerPerfilEn');


router.get('/', isLoggedIn, getPerfil);
router.post('/', isLoggedIn, postPerfil);

router.get('/en', isLoggedIn, getPerfilEn);
router.post('/en', isLoggedIn, postPerfilEn);


module.exports = router;
const express = require ('express');
const router = express.Router();
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

const {isLoggedInAdmin} = require(appRoot+'/utils/Authentication/Intranet/UtilAuth');

const {getFamilias, getFamiliasSearch, getFamilia, postEditarFamilia, postEditarVariedad, postNuevoVariedad} = require(appRoot+'/controllers/ControllerIntranet/Administracion/Familias/ControllerAdminFamilias');
const {getFamiliasEn, getFamiliasSearchEn, getFamiliaEn, postEditarFamiliaEn, postEditarVariedadEn, postNuevoVariedadEn} = require(appRoot+'/controllers/ControllerIntranet/Administracion/Familias/en/ControllerAdminFamiliasEn');

const {getNuevoFamilia, postNuevoFamilia} = require(appRoot+'/controllers/ControllerIntranet/Administracion/Familias/ControllerFamiliaNuevo');
const {getNuevoFamiliaEn, postNuevoFamiliaEn} = require(appRoot+'/controllers/ControllerIntranet/Administracion/Familias/en/ControllerFamiliaNuevoEn');


router.get('/', isLoggedInAdmin, getFamilias);
router.post('/search', isLoggedInAdmin, csrfProtection, getFamiliasSearch);
router.get('/en', isLoggedInAdmin, getFamiliasEn);
router.post('/en/search', isLoggedInAdmin, csrfProtection, getFamiliasSearchEn);

router.get('/nuevo', isLoggedInAdmin, getNuevoFamilia);
router.post('/nuevo', isLoggedInAdmin, csrfProtection, postNuevoFamilia);
router.get('/en/nuevo', isLoggedInAdmin, getNuevoFamiliaEn);
router.post('/en/nuevo', isLoggedInAdmin, csrfProtection, postNuevoFamiliaEn);

router.get('/familia/:id', isLoggedInAdmin, getFamilia);
router.get('/en/familia/:id', isLoggedInAdmin, getFamiliaEn);

router.post('/familia/editar', isLoggedInAdmin, csrfProtection, postEditarFamilia);
router.post('/familia/nueva-variedad', isLoggedInAdmin, csrfProtection, postNuevoVariedad);
router.post('/en/familia/editar', isLoggedInAdmin, csrfProtection, postEditarFamiliaEn);
router.post('/en/familia/nueva-variedad', isLoggedInAdmin, csrfProtection, postNuevoVariedadEn);

//router.get('/familia/editar-variedad', isLoggedInAdmin, csrfProtection, getFamilia);
router.post('/familia/editar-variedad', isLoggedInAdmin, csrfProtection, postEditarVariedad);
router.post('/en/familia/editar-variedad', isLoggedInAdmin, csrfProtection, postEditarVariedadEn);

module.exports = router;
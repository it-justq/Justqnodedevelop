const express = require ('express');
const router = express.Router();

const {isLoggedInIntranet} = require(appRoot+'/utils/Authentication/Intranet/UtilAuth');


const {getDatos, postDatos} = require(appRoot+'/controllers/ControllerIntranet/Controles/ControlSqls/ControllerControlDatos');
/*const {getPrecarga, postPrecarga} = require(appRoot+'/controllers/ControllerIntranet/Controles/ControlSqls/ControllerControlPrecarga');
const {getGruposControl, postGruposControl, getPuntoControlFotos} = require(appRoot+'/controllers/ControllerIntranet/Controles/ControlSqls/ControllerControlGruposControl');
const {getAcciones, postAcciones, putAcciones, deleteAcciones} = require(appRoot+'/controllers/ControllerIntranet/Controles/ControlSqls/ControllerControlAcciones');
const {getPesos, postPesos} = require(appRoot+'/controllers/ControllerIntranet/Controles/ControlSqls/ControllerControlPesos');
const {getCajas, postCajas} = require(appRoot+'/controllers/ControllerIntranet/Controles/ControlSqls/ControllerControlCajas');
const {getPallets, postPallets} = require(appRoot+'/controllers/ControllerIntranet/Controles/ControlSqls/ControllerControlPallets');
const {getFotos, postFotos} = require(appRoot+'/controllers/ControllerIntranet/Controles/ControlSqls/ControllerControlFotos');*/



router.get('/:id', isLoggedInIntranet, getDatos);


router.get('/:id/datos', isLoggedInIntranet, getDatos);
router.post('/:id/datos', isLoggedInIntranet, postDatos);

/*
router.get('/:id/precarga', isLoggedInIntranet, getPrecarga);
router.post('/:id/precarga', isLoggedInIntranet, postPrecarga);

router.get('/:id/grupos-control', isLoggedInIntranet, getGruposControl);
router.post('/:id/grupos-control', isLoggedInIntranet, postGruposControl);
router.get('/:id/punto-control/:fotosId/fotos', isLoggedInIntranet, getPuntoControlFotos);

router.get('/:id/acciones', isLoggedInIntranet, getAcciones);
router.post('/:id/acciones', isLoggedInIntranet, postAcciones);
router.put('/:id/acciones', isLoggedInIntranet, putAcciones);
router.delete('/:id/acciones', isLoggedInIntranet, deleteAcciones);

router.get('/:id/pesos/', isLoggedInIntranet, getPesos);
router.post('/:id/pesos/', isLoggedInIntranet, postPesos);
router.get('/:id/pesos/:pesoid/fotos', isLoggedInIntranet, getPesos);

router.get('/:id/cajas', isLoggedInIntranet, getCajas);
router.post('/:id/cajas', isLoggedInIntranet, postCajas);
router.get('/:id/cajas/:fotosId/fotos', isLoggedInIntranet, getCajas);

router.get('/:id/pallets', isLoggedInIntranet, getPallets);
router.post('/:id/pallets', isLoggedInIntranet, postPallets);
router.get('/:id/pallets/:fotosId/fotos', isLoggedInIntranet, getPallets);

router.get('/:id/fotos', isLoggedInIntranet, getFotos);
router.post('/:id/fotos', isLoggedInIntranet, postFotos);
*/
module.exports = router;
const express = require ('express');
const router = express.Router();
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

const {isLoggedInIntranet} = require(appRoot+'/utils/Authentication/Intranet/UtilAuth');

const {getMenu, postMenu} = require(appRoot+'/controllers/ControllerIntranet/Controles/ControlMysql/ControllerControlMenu');



//INFORMACION
const {getInformacion, postInformacion} = require(appRoot+'/controllers/ControllerIntranet/Controles/ControlMysql/ControllerControlInformacion');
router.get('/:controlId', isLoggedInIntranet, csrfProtection, getInformacion);

router.get('/:controlId/informacion', isLoggedInIntranet, csrfProtection, getInformacion);
router.post('/:controlId/informacion/mod', isLoggedInIntranet, csrfProtection, postInformacion);
//en
const {getInformacionEn, postInformacionEn} = require(appRoot+'/controllers/ControllerIntranet/Controles/ControlMysql/en/ControllerControlInformacionEn');
router.get('/en/:controlId', isLoggedInIntranet, csrfProtection, getInformacionEn);

router.get('/en/:controlId/informacion', isLoggedInIntranet, csrfProtection, getInformacionEn);
router.post('/en/:controlId/informacion/mod', isLoggedInIntranet, csrfProtection, postInformacionEn);

//DATOS
const {getDatos, postDatos} = require(appRoot+'/controllers/ControllerIntranet/Controles/ControlMysql/ControllerControlDatos');
router.get('/:controlId/datos', isLoggedInIntranet, csrfProtection, getDatos);
router.post('/:controlId/datos/mod', isLoggedInIntranet, csrfProtection, postDatos);
//en
const {getDatosEn, postDatosEn} = require(appRoot+'/controllers/ControllerIntranet/Controles/ControlMysql/en/ControllerControlDatosEn');
router.get('/en/:controlId/datos', isLoggedInIntranet, csrfProtection, getDatosEn);
router.post('/en/:controlId/datos/mod', isLoggedInIntranet, csrfProtection, postDatosEn);

//PRECARGA
const {getPrecarga, postPrecarga} = require(appRoot+'/controllers/ControllerIntranet/Controles/ControlMysql/ControllerControlPrecarga');
router.get('/:controlId/precarga', isLoggedInIntranet, csrfProtection, getPrecarga);
router.post('/:controlId/precarga/mod/:id', isLoggedInIntranet, csrfProtection, postPrecarga);
//en
const {getPrecargaEn, postPrecargaEn} = require(appRoot+'/controllers/ControllerIntranet/Controles/ControlMysql/en/ControllerControlPrecargaEn');
router.get('/en/:controlId/precarga', isLoggedInIntranet, csrfProtection, getPrecargaEn);
router.post('/en/:controlId/precarga/mod/:id', isLoggedInIntranet, csrfProtection, postPrecargaEn);

//GRUPOS DE CONTROL
const {getGruposControl, postGruposControl, postAddedGruposControl, addPuntoControl, deleteAddedGruposControl, getPuntoControlFotos, postPuntoControlFotos, deleteFotosPc, deleteFotoPc} = require(appRoot+'/controllers/ControllerIntranet/Controles/ControlMysql/ControllerControlGruposControl');
router.get('/:controlId/grupos-control', isLoggedInIntranet, csrfProtection, getGruposControl);
router.post('/:controlId/grupos-control/mod', isLoggedInIntranet, csrfProtection, postGruposControl);
router.post('/:controlId/grupos-control/add/pc/:id', isLoggedInIntranet, csrfProtection, addPuntoControl);
router.post('/:controlId/grupos-control-added/mod/:id', isLoggedInIntranet, csrfProtection, postAddedGruposControl);
router.post('/:controlId/grupos-control-added/delete/pc/:id', isLoggedInIntranet, csrfProtection, deleteAddedGruposControl);
//PUNTO DE CONTROL FOTOS
router.get('/:controlId/punto-control/:id/fotos', isLoggedInIntranet, csrfProtection, getPuntoControlFotos);
router.post('/:controlId/punto-control/:id/fotos', isLoggedInIntranet, csrfProtection, postPuntoControlFotos);
router.delete('/:controlId/punto-control/:id/fotos', isLoggedInIntranet, csrfProtection, deleteFotosPc);
router.delete('/:controlId/punto-control/:id/foto/:subId', isLoggedInIntranet, csrfProtection, deleteFotoPc);
//en
const {getGruposControlEn, postGruposControlEn, postAddedGruposControlEn, addPuntoControlEn, deleteAddedGruposControlEn, getPuntoControlFotosEn, postPuntoControlFotosEn, deleteFotosPcEn, deleteFotoPcEn} = require(appRoot+'/controllers/ControllerIntranet/Controles/ControlMysql/en/ControllerControlGruposControlEn');
router.get('/en/:controlId/grupos-control', isLoggedInIntranet, csrfProtection, getGruposControlEn);
router.post('/en/:controlId/grupos-control/mod', isLoggedInIntranet, csrfProtection, postGruposControlEn);
router.post('/en/:controlId/grupos-control/add/pc/:id', isLoggedInIntranet, csrfProtection, addPuntoControlEn);
router.post('/en/:controlId/grupos-control-added/mod/:id', isLoggedInIntranet, csrfProtection, postAddedGruposControlEn);
router.post('/en/:controlId/grupos-control-added/delete/pc/:id', isLoggedInIntranet, csrfProtection, deleteAddedGruposControlEn);

router.get('/en/:controlId/punto-control/:id/fotos', isLoggedInIntranet, csrfProtection, getPuntoControlFotosEn);
router.post('/en/:controlId/punto-control/:id/fotos', isLoggedInIntranet, csrfProtection, postPuntoControlFotosEn);
router.delete('/en/:controlId/punto-control/:id/fotos', isLoggedInIntranet, csrfProtection, deleteFotosPcEn);
router.delete('/en/:controlId/punto-control/:id/foto/:subId', isLoggedInIntranet, csrfProtection, deleteFotoPcEn);

//PUNTO DE CONTROL AÑADIDOS FOTOS
const {getPuntoControlAddFotos, postPuntoControlAddFotos, deleteFotosPcAdd, deleteFotoPcAdd} = require(appRoot+'/controllers/ControllerIntranet/Controles/ControlMysql/ControllerControlPuntosControlAdd');
router.get('/:controlId/punto-control-add/:id/fotos', isLoggedInIntranet, csrfProtection, getPuntoControlAddFotos);
router.post('/:controlId/punto-control-add/:id/fotos', isLoggedInIntranet, csrfProtection, postPuntoControlAddFotos);
router.delete('/:controlId/punto-control-add/:id/fotos', isLoggedInIntranet, csrfProtection, deleteFotosPcAdd);
router.delete('/:controlId/punto-control-add/:id/foto/:subId', isLoggedInIntranet, csrfProtection, deleteFotoPcAdd);
//en
const {getPuntoControlAddFotosEn, postPuntoControlAddFotosEn, deleteFotosPcAddEn, deleteFotoPcAddEn} = require(appRoot+'/controllers/ControllerIntranet/Controles/ControlMysql/en/ControllerControlPuntosControlAddEn');
router.get('/en/:controlId/punto-control-add/:id/fotos', isLoggedInIntranet, csrfProtection, getPuntoControlAddFotosEn);
router.post('/en/:controlId/punto-control-add/:id/fotos', isLoggedInIntranet, csrfProtection, postPuntoControlAddFotosEn);
router.delete('/en/:controlId/punto-control-add/:id/fotos', isLoggedInIntranet, csrfProtection, deleteFotosPcAddEn);
router.delete('/en/:controlId/punto-control-add/:id/foto/:subId', isLoggedInIntranet, csrfProtection, deleteFotoPcAddEn);

//ACCIONES
const {getAcciones, modAcciones, addAcciones, deleteAcciones} = require(appRoot+'/controllers/ControllerIntranet/Controles/ControlMysql/ControllerControlAcciones');
router.get('/:controlId/acciones', isLoggedInIntranet, csrfProtection, getAcciones);
router.post('/:controlId/accion/mod/:id', isLoggedInIntranet, csrfProtection, modAcciones);
router.post('/:controlId/accion/add/:type', isLoggedInIntranet, csrfProtection, addAcciones);
router.delete('/:controlId/accion/:id/:type', isLoggedInIntranet, csrfProtection, deleteAcciones);
//en
const {getAccionesEn, modAccionesEn, addAccionesEn, deleteAccionesEn} = require(appRoot+'/controllers/ControllerIntranet/Controles/ControlMysql/en/ControllerControlAccionesEn');
router.get('/en/:controlId/acciones', isLoggedInIntranet, csrfProtection, getAccionesEn);
router.post('/en/:controlId/accion/mod/:id', isLoggedInIntranet, csrfProtection, modAccionesEn);
router.post('/en/:controlId/accion/add/:type', isLoggedInIntranet, csrfProtection, addAccionesEn);
router.delete('/en/:controlId/accion/:id/:type', isLoggedInIntranet, csrfProtection, deleteAccionesEn);

//PESOS
const {getPesos, modPesos, addPesos, delPeso, getPesoFotos, postPesoFotos, deleteFotosPeso, deleteFotoPeso} = require(appRoot+'/controllers/ControllerIntranet/Controles/ControlMysql/ControllerControlPesos');
router.get('/:controlId/pesos/', isLoggedInIntranet, csrfProtection, getPesos); 
router.post('/:controlId/peso/mod/:id', isLoggedInIntranet, csrfProtection, modPesos);
router.post('/:controlId/peso/add', isLoggedInIntranet, csrfProtection, addPesos);
router.delete('/:controlId/peso/:id', isLoggedInIntranet, csrfProtection, delPeso);
//PESO FOTOS
router.get('/:controlId/peso/:id/fotos', isLoggedInIntranet, csrfProtection, getPesoFotos);
router.post('/:controlId/peso/:id/fotos', isLoggedInIntranet, csrfProtection, postPesoFotos);
router.delete('/:controlId/peso/:id/fotos', isLoggedInIntranet, csrfProtection, deleteFotosPeso);
router.delete('/:controlId/peso/:id/foto/:subId', isLoggedInIntranet, csrfProtection, deleteFotoPeso);
//en
const {getPesosEn, modPesosEn, addPesosEn, delPesoEn, getPesoFotosEn, postPesoFotosEn, deleteFotosPesoEn, deleteFotoPesoEn} = require(appRoot+'/controllers/ControllerIntranet/Controles/ControlMysql/en/ControllerControlPesosEn');
router.get('/en/:controlId/pesos/', isLoggedInIntranet, csrfProtection, getPesosEn); 
router.post('/en/:controlId/peso/mod/:id', isLoggedInIntranet, csrfProtection, modPesosEn);
router.post('/en/:controlId/peso/add', isLoggedInIntranet, csrfProtection, addPesosEn);
router.delete('/en/:controlId/peso/:id', isLoggedInIntranet, csrfProtection, delPesoEn);

router.get('/en/:controlId/peso/:id/fotos', isLoggedInIntranet, csrfProtection, getPesoFotosEn);
router.post('/en/:controlId/peso/:id/fotos', isLoggedInIntranet, csrfProtection, postPesoFotosEn);
router.delete('/en/:controlId/peso/:id/fotos', isLoggedInIntranet, csrfProtection, deleteFotosPesoEn);
router.delete('/en/:controlId/peso/:id/foto/:subId', isLoggedInIntranet, csrfProtection, deleteFotoPesoEn);

//CAJAS
const {getCajas, modCajas, addCajas, delCaja, getCajaFotos, postCajaFotos, deleteFotosCaja, deleteFotoCaja} = require(appRoot+'/controllers/ControllerIntranet/Controles/ControlMysql/ControllerControlCajas');
router.get('/:controlId/cajas', isLoggedInIntranet, csrfProtection, getCajas);
router.post('/:controlId/caja/mod/:id', isLoggedInIntranet, csrfProtection, modCajas);
router.post('/:controlId/caja/add', isLoggedInIntranet, csrfProtection, addCajas);
router.delete('/:controlId/caja/:id', isLoggedInIntranet, csrfProtection, delCaja);
//CAJA FOTOS
router.get('/:controlId/caja/:id/fotos', isLoggedInIntranet, csrfProtection, getCajaFotos);
router.post('/:controlId/caja/:id/fotos', isLoggedInIntranet, csrfProtection, postCajaFotos);
router.delete('/:controlId/caja/:id/fotos', isLoggedInIntranet, csrfProtection, deleteFotosCaja);
router.delete('/:controlId/caja/:id/foto/:subId', isLoggedInIntranet, csrfProtection, deleteFotoCaja);
//en
const {getCajasEn, modCajasEn, addCajasEn, delCajaEn, getCajaFotosEn, postCajaFotosEn, deleteFotosCajaEn, deleteFotoCajaEn} = require(appRoot+'/controllers/ControllerIntranet/Controles/ControlMysql/en/ControllerControlCajasEn');
router.get('/en/:controlId/cajas', isLoggedInIntranet, csrfProtection, getCajasEn);
router.post('/en/:controlId/caja/mod/:id', isLoggedInIntranet, csrfProtection, modCajasEn);
router.post('/en/:controlId/caja/add', isLoggedInIntranet, csrfProtection, addCajasEn);
router.delete('/en/:controlId/caja/:id', isLoggedInIntranet, csrfProtection, delCajaEn);

router.get('/en/:controlId/caja/:id/fotos', isLoggedInIntranet, csrfProtection, getCajaFotosEn);
router.post('/en/:controlId/caja/:id/fotos', isLoggedInIntranet, csrfProtection, postCajaFotosEn);
router.delete('/en/:controlId/caja/:id/fotos', isLoggedInIntranet, csrfProtection, deleteFotosCajaEn);
router.delete('/en/:controlId/caja/:id/foto/:subId', isLoggedInIntranet, csrfProtection, deleteFotoCajaEn);

//PALLETS
const {getPallets, modPallets, delPallet, addPallets, getPalletFotos, postPalletFotos, deleteFotosPallet, deleteFotoPallet} = require(appRoot+'/controllers/ControllerIntranet/Controles/ControlMysql/ControllerControlPallets');
router.get('/:controlId/pallets', isLoggedInIntranet, csrfProtection, getPallets);
router.post('/:controlId/pallet/mod/:id', isLoggedInIntranet, csrfProtection, modPallets);
router.post('/:controlId/pallet/add', isLoggedInIntranet, csrfProtection, addPallets);
router.delete('/:controlId/pallet/:id', isLoggedInIntranet, csrfProtection, delPallet);
//PALLET FOTOS
router.get('/:controlId/pallet/:id/fotos', isLoggedInIntranet, csrfProtection, getPalletFotos);
router.post('/:controlId/pallet/:id/fotos', isLoggedInIntranet, csrfProtection, postPalletFotos);
router.delete('/:controlId/pallet/:id/fotos', isLoggedInIntranet, csrfProtection, deleteFotosPallet);
router.delete('/:controlId/pallet/:id/foto/:subId', isLoggedInIntranet, csrfProtection, deleteFotoPallet);
//en
const {getPalletsEn, modPalletsEn, delPalletEn, addPalletsEn, getPalletFotosEn, postPalletFotosEn, deleteFotosPalletEn, deleteFotoPalletEn} = require(appRoot+'/controllers/ControllerIntranet/Controles/ControlMysql/en/ControllerControlPalletsEn');
router.get('/en/:controlId/pallets', isLoggedInIntranet, csrfProtection, getPalletsEn);
router.post('/en/:controlId/pallet/mod/:id', isLoggedInIntranet, csrfProtection, modPalletsEn);
router.post('/en/:controlId/pallet/add', isLoggedInIntranet, csrfProtection, addPalletsEn);
router.delete('/en/:controlId/pallet/:id', isLoggedInIntranet, csrfProtection, delPalletEn);

router.get('/en/:controlId/pallet/:id/fotos', isLoggedInIntranet, csrfProtection, getPalletFotosEn);
router.post('/en/:controlId/pallet/:id/fotos', isLoggedInIntranet, csrfProtection, postPalletFotosEn);
router.delete('/en/:controlId/pallet/:id/fotos', isLoggedInIntranet, csrfProtection, deleteFotosPalletEn);
router.delete('/en/:controlId/pallet/:id/foto/:subId', isLoggedInIntranet, csrfProtection, deleteFotoPalletEn);

//DOCUMENTACION
const {getDocumentacion, postDocumentacion, deleteAllDocumentacion, deleteDocumentacion} = require(appRoot+'/controllers/ControllerIntranet/Controles/ControlMysql/ControllerControlDocumentacion');
router.get('/:controlId/documentacion', isLoggedInIntranet, csrfProtection, getDocumentacion);
router.post('/:controlId/documentacion/add', isLoggedInIntranet, csrfProtection, postDocumentacion);
router.delete('/:controlId/documentacion', isLoggedInIntranet, csrfProtection, deleteAllDocumentacion);
router.delete('/:controlId/documentacion/:id', isLoggedInIntranet, csrfProtection, deleteDocumentacion);
//en
const {getDocumentacionEn, postDocumentacionEn, deleteAllDocumentacionEn, deleteDocumentacionEn} = require(appRoot+'/controllers/ControllerIntranet/Controles/ControlMysql/en/ControllerControlDocumentacionEn');
router.get('/en/:controlId/documentacion', isLoggedInIntranet, csrfProtection, getDocumentacionEn);
router.post('/en/:controlId/documentacion/add', isLoggedInIntranet, csrfProtection, postDocumentacionEn);
router.delete('/en/:controlId/documentacion', isLoggedInIntranet, csrfProtection, deleteAllDocumentacionEn);
router.delete('/en/:controlId/documentacion/:id', isLoggedInIntranet, csrfProtection, deleteDocumentacionEn);

//FOTOS
const {getFotos, postFotos, deleteAllFotos, deleteFoto} = require(appRoot+'/controllers/ControllerIntranet/Controles/ControlMysql/ControllerControlFotos');
router.get('/:controlId/fotos', isLoggedInIntranet, csrfProtection, getFotos);
router.post('/:controlId/fotos/add', isLoggedInIntranet, csrfProtection, postFotos);
router.delete('/:controlId/fotos', isLoggedInIntranet, csrfProtection, deleteAllFotos);
router.delete('/:controlId/foto/:id', isLoggedInIntranet, csrfProtection,  deleteFoto);
//en
const {getFotosEn, postFotosEn, deleteAllFotosEn, deleteFotoEn} = require(appRoot+'/controllers/ControllerIntranet/Controles/ControlMysql/en/ControllerControlFotosEn');
router.get('/en/:controlId/fotos', isLoggedInIntranet, csrfProtection, getFotosEn);
router.post('/en/:controlId/fotos/add', isLoggedInIntranet, csrfProtection, postFotosEn);
router.delete('/en/:controlId/fotos', isLoggedInIntranet, csrfProtection, deleteAllFotosEn);
router.delete('/en/:controlId/foto/:id', isLoggedInIntranet, csrfProtection,  deleteFotoEn);


//NOTIFICACIONES DEL CONTROL
const {sendMailControlCliente} = require(appRoot+'/controllers/ControllerIntranet/Controles/ControlMysql/ControllerControlNotificaciones');
router.post('/:controlId/enviar/email/cliente', isLoggedInIntranet, csrfProtection, sendMailControlCliente);



const {deleteControl, createPlantilla, deletePlantilla} = require(appRoot+'/controllers/ControllerIntranet/Controles/ControlMysql/ControllerControlConfiguracion');
router.post('/:controlId/eliminar', isLoggedInIntranet, csrfProtection, deleteControl);
router.post('/:controlId/nueva/plantilla', isLoggedInIntranet, csrfProtection, createPlantilla);
router.delete('/:controlId/delete/plantilla/:subId', isLoggedInIntranet, csrfProtection, deletePlantilla);
//en
const {deleteControlEn, createPlantillaEn, deletePlantillaEn} = require(appRoot+'/controllers/ControllerIntranet/Controles/ControlMysql/en/ControllerControlConfiguracionEn');
router.post('/en/:controlId/eliminar', isLoggedInIntranet, csrfProtection, deleteControlEn);
router.post('/en/:controlId/nueva/plantilla', isLoggedInIntranet, csrfProtection, createPlantillaEn);
router.delete('/en/:controlId/delete/plantilla/:subId', isLoggedInIntranet, csrfProtection, deletePlantillaEn);


module.exports = router;
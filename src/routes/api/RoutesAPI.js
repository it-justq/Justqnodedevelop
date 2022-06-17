const express = require ('express');
const router = express.Router();

const layout_es = appRoot+'/views/pages/api/main.hbs';
const ApiController = require(appRoot+'/controllers/ControllerAPI/sanllo');
const HController = require(appRoot+'/controllers/ControllerAPI/hispatec');
router.get('/', (req, res) => {
    res.render('modules/api/main', {layout: layout_es});
});
router.get('hispatec/prueba', HController.getToken);
router.post('envio/nuevo', ApiController.Sanllo);
router.post('usuario/nuevo', ApiController.NuevoUser);
module.exports = router;

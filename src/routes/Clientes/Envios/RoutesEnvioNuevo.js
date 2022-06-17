const express = require ('express');
const router = express.Router();
const csrf = require('csurf');
//const { pool } = require('mssql');
const csrfProtection = csrf({ cookie: true });
const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');

const {isLoggedInClientes} = require(appRoot+'/utils/Authentication/Intranet/UtilAuth');
const {getUserData} = require(appRoot+'/utils/GetUser');



const {postEnvioNuevo} = require(appRoot+'/controllers/ControllerClientes/Envios/ControllerNuevoEnvio');
const layout_es = appRoot+'/views/pages/intranet/envios/';
const modules = appRoot+'/views/modules/intranet/envios/';

router.get('/', isLoggedInClientes, csrfProtection, async (req, res) => {
	let user = getUserData(req);
	let paises = await pool.query('SELECT pais_id, pais_nombre FROM pais ORDER BY pais_nombre ASC');
	let familias = await pool.query('SELECT familia_id, familia_nombre FROM familia ORDER BY familia_nombre ASC');
    let data = {paises: paises, familias: familias};
	res.render(modules+'nuevo', {layout: layout_es+'nuevo.hbs', csrfToken: req.csrfToken(), user, data});
});


router.post('/', isLoggedInClientes, csrfProtection, postEnvioNuevo);

module.exports = router;
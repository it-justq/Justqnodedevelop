const express = require ('express');
const morgan = require ('morgan');
const exphbs = require ('express-handlebars');
const session = require ('express-session');
const MySQLStore = require ('express-mysql-session');
const passport = require ('passport');
const helmet = require("helmet");
const path = require ('path');
const bodyParser = require('body-parser')
const nocache = require("nocache");
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const xXssProtection = require("x-xss-protection");

const timeout = require('connect-timeout');
const rateLimit = require("express-rate-limit");
const fileUpload = require('express-fileupload');

// INICIALIZACIONES
const app = express();
require('dotenv').config()  

const database_jq = {
  host : process.env.DB_HOST,
  user : process.env.DB_USER,
  password : process.env.DB_PASS,
  database : process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  connectionLimit: 5000000,
  queueLimit: 5000000,
  acquireTimeout: 5000000
};

require('./utils/Authentication/Intranet/UtilPassport');



//CONFIGURACIONES
app.set('port', process.env.PORT || 4041);

app.set('views', path.join(__dirname, 'views'));

app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'pages'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
  helpers: require('./utils/Handlebars')
}))

app.set('view engine', '.hbs');

global.appRoot = path.resolve(__dirname);
global.appDir = path.join(__dirname, '../');

//MIDDLEWARES
app.use(cookieParser());
app.use(session({
  secret: 'nodesession',
  resave: false,
  saveUninitialized: false,
  store: new MySQLStore(database_jq),
  maxAge: 28800000
}));


app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());



app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());

app.use(nocache());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(fileUpload());
//pruebas de API
var api = createApiRouter();
app.use('/api', api);

app.use(csrf({ cookie: true }))

/*app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5000, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: false, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: 'Has efectuado mas de 1700 peticiones en 15 minutos'
  })
);*/

app.use(xXssProtection());

//VARIABLES GLOBALES
app.use((req, res, next) => {
  app.locals.user = req.user;
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
})

function createApiRouter () {
  var router = new express.Router()
  const ApiController = require(appRoot+'/controllers/ControllerAPI/sanllo');

  router.post('/usuario/nuevo', ApiController.NuevoUser)
  router.post('/envio/nuevo', ApiController.Sanllo);

  return router
}


//RUTAS
//app.use(require('./routes'));

app.use('/', require('./routes/Corporative/RoutesCorporative'));

app.use('/intranet', require('./routes/RoutesAuthentication'));

app.use('/intranet', require('./routes/Intranet/Inicio/RoutesInicioNavigation'));

app.use('/intranet/controles', require('./routes/Intranet/Controles/RoutesControlesNavigation'));
app.use('/intranet/control', require('./routes/Intranet/Controles/RoutesControlNavigation')); 
app.use('/intranet/control/app', require('./routes/Intranet/Controles/RoutesControlAppNavigation'));
app.use('/intranet/nuevo/control', require('./routes/Intranet/Controles/RoutesNuevoControlNavigation'));


app.use('/intranet/periciales', require('./routes/Intranet/Periciales/RoutesPericialesNavigation'));
app.use('/intranet/nuevo/pericial', require('./routes/Intranet/Periciales/RoutesNuevoPericialNavigation'));
app.use('/intranet/pericial', require('./routes/Intranet/Periciales/RoutesPericialNavigation'));



app.use('/intranet/plantillas', require('./routes/Intranet/Plantillas/RoutesPlantillasNavigation'));


app.use('/intranet/perfil', require('./routes/Intranet/Perfil/RoutesPerfilNavigation'));

app.use('/intranet/documentos', require('./routes/Intranet/Documentos/RoutesDocumentosNavigation'));

app.use('/intranet/app', require('./routes/Intranet/App/RoutesAppNavigation'));

app.use('/intranet/administracion', require('./routes/Intranet/Administracion/RoutesAdminNavigation'));
app.use('/intranet/administracion/usuarios', require('./routes/Intranet/Administracion/RoutesUsuariosNavigation'));
app.use('/intranet/administracion/plataformas', require('./routes/Intranet/Administracion/RoutesPlataformasNavigation'));
app.use('/intranet/administracion/familias', require('./routes/Intranet/Administracion/RoutesFamiliasNavigation'));
app.use('/intranet/administracion/controles', require('./routes/Intranet/Administracion/RoutesControlesNavigation'));
app.use('/intranet/administracion/paises', require('./routes/Intranet/Administracion/RoutesPaisesNavigation'));


app.use('/clientes', require('./routes/Clientes/Inicio/RoutesInicioNavigation.js')); 
app.use('/clientes/controles', require('./routes/Clientes/Controles/RoutesControlesNavigation.js'));
app.use('/clientes/envios', require('./routes/Clientes/Envios/RoutesEnviosNavigation.js'));
app.use('/clientes/envio', require('./routes/Clientes/Envios/RoutesEnvioNavigation.js'));
app.use('/clientes/nuevo/envio', require('./routes/Clientes/Envios/RoutesEnvioNuevo.js'));

app.use('/informe', require('./routes/Informes/RoutesInformesNavigation'));



app.use('/ERROR', require('./routes/RoutesError'));

app.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err)

  // handle CSRF token errors here
  res.status(403)
  res.send('Fatal error')
  res.redirect('/ERROR/secure')
})

//ARCHIVOS PÚBLICOS
app.use(express.static(path.join(__dirname, 'public')));

//INICIALIZACIÓN DEL SERVIDOR
app.listen(app.get('port'), () => {
    console.log('Servidor en el puerto', app.get('port'));
});

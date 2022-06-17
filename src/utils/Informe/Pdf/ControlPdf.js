const {getDatos} = require(appRoot+'/utils/Informe/Pdf/ControlPdf/Datos');
const {getGruposControl} = require(appRoot+'/utils/Informe/Pdf/ControlPdf/GruposControl');
const {getPrecarga} = require(appRoot+'/utils/Informe/Pdf/ControlPdf/Precarga');
const {getAcciones} = require(appRoot+'/utils/Informe/Pdf/ControlPdf/Acciones');
const {getPesos} = require(appRoot+'/utils/Informe/Pdf/ControlPdf/Pesos');
const {getCajas} = require(appRoot+'/utils/Informe/Pdf/ControlPdf/Cajas');
const {getPallets} = require(appRoot+'/utils/Informe/Pdf/ControlPdf/Pallets');
const {getDocumentacion} = require(appRoot+'/utils/Informe/Pdf/ControlPdf/Documentacion');
const {getFotos} = require(appRoot+'/utils/Informe/Pdf/ControlPdf/Fotos');
const {getConfiguracion} = require(appRoot+'/utils/Informe/Pdf/ControlPdf/Configuracion');


module.exports = {

    async getControlPdf(VALUES){

        try{
            const control = VALUES.control;
            const idioma = VALUES.idioma;

            let DATA = {};
            
            let datos = await getDatos(control, idioma);
            DATA.datos = datos.data[0];

            DATA.grupos_control = await getGruposControl(control, idioma);
            DATA.precarga = await getPrecarga(control, idioma);
            DATA.acciones = await getAcciones(control, idioma);
            DATA.pesos = await getPesos(control, idioma);
            DATA.cajas = await getCajas(control, idioma);
            DATA.pallets = await getPallets(control, idioma);
            DATA.documentacion = await getDocumentacion(control, idioma);
            DATA.fotos = await getFotos(control, idioma);
            DATA.configuracion = await getConfiguracion(control, idioma);

            return {status: 'ok', data: DATA};

        }catch(error){
            return {status: 'error', code: 'Error al generar el control PDF'};
        }

    },



};

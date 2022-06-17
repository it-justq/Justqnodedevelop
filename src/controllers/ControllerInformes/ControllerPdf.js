const layout = '../../views/pages/informes/pdf/';
const modules = 'modules/informes/pdf/';

const {requested} = require(appRoot+'/utils/Informe/UtilRequested');

const {getPdf} = require(appRoot+'/utils/Informe/Pdf/Pdf');
const {getControlPdf} = require(appRoot+'/utils/Informe/Pdf/ControlPdf');

const puppeteer = require("puppeteer");
const pool = require(appRoot+'/utils/Conexion/UtilDatabase_jq');



module.exports = {

    async getInformeControlPdf(req, res){
        
        const cnf = await requested(req);
        const data = await getControlPdf(cnf);

        if(data.status === 'ok'){
            let DATA = data.data;

            if(cnf.idioma === 'es'){
            res.render(modules+'pdf-control-es', {layout: layout+'pdf-control.hbs', DATA});

            }else if(cnf.idioma === 'en'){
            res.render(modules+'pdf-control-en', {layout: layout+'pdf-control.hbs', DATA});

            }else{
                res.redirect('/ERROR/pdf')
            }


        }else{
            res.redirect('/ERROR/pdf')
        }

    },

	async getInformePdf(req, res){
        const cnf = await requested(req);

        let control = cnf.control;
        let control_hash = cnf.control_hash;
        let idioma = cnf.idioma;

        try{

            const url = "https://www.justq.eu/informe/pdf/control/"+control_hash+"/"+idioma;
            const browser = await puppeteer.launch({headless: true});
            const webPage = await browser.newPage();
            await webPage.goto(url, {waitUntil: 'networkidle0'});
            



            let cliente_id = await pool.query('SELECT control_cliente_id FROM control WHERE control_id = ?',[control]);
            cliente_id = cliente_id[0].control_cliente_id;

            const cliente = await pool.query('SELECT * FROM cliente WHERE cliente_id = ?',[cliente_id]);

            let logo = "";
            if(cliente[0].cliente_logo === 'null' || cliente[0].cliente_logo === null){
                logo = '';
            }

            if(cliente[0].cliente_logo_activo === 1){
                logo = '<img class="logo" style="width:100%;" src="data:image/png;base64,'+cliente[0].cliente_logo+'"/>';

            }else{
                logo = '';
            }

            const subheaderMpg = `  <tr>
                                        <td colspan='3' style="width: 100%;">
                                            <p style='font-size:6px; text-align:center; border-top: 1px solid #595959; border-bottom: 1px solid #595959; padding: 2px; color:#00b300;'>TRANSPORTE MARITIMO, TERRESTRE Y AEREO - ASISTENCIA ASESORAMIENTO – CONTROL DE CALIDAD - SERVICIO DE ALMACENAJE - SEGURO DE TRANSPORTE</p>
                                        </td>
                                    </tr>`;


            const headerPredefEs = `<div id='header' style='width: 100%; margin-top: -20px;'>
                
                <table style="margin-left: 25px; margin-right: 25px;">
                    <tr>
                        <td style="width: 25%;">
                            <img class="logo" style='width:100%;' src='data:image/png;base64,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'/>
                        </td>
                        <td style="width: 50%;">
                            <table style="margin-left: 40px;">
                                <tr>
                                    <th style='text-align:left; font-size:8px;'>Compañía:</th>
                                    <td style='font-size:10px; font-size:8px;'>Just Quality Systems SL</td>
                                </tr>
                                <tr>
                                    <th style='text-align:left; font-size:8px;'>Registro:</th>
                                    <td style='font-size:10px; font-size:8px;'>B73801201</td>
                                </tr>
                                <tr>
                                    <th style='text-align:left; font-size:8px;'>Datos de contacto:</th>
                                    <td style='font-size:8px;'>+34 868 081 454 info@justq.eu</td>
                                </tr>
                                <tr>
                                    <th style='text-align:left; font-size:8px;'>Director ejecutivo:</th>
                                    <td style='font-size:8px;'>Carmen Nicolás</td>
                                </tr>
                            </table>
                        </td>
                        <td style="width: 25%;">
                            `+logo+`
                        </td>
                    </tr>
                    `+ (cliente_id === 12 ? subheaderMpg : "") +`
                </table>

        </div>`;

            const headerPredefEn = `<div id='header' style='width: 100%; margin-top: -20px;'>
                
                <table style="margin-left: 25px; margin-right: 25px;">
                    <tr>
                        <td style="width: 25%;">
                            <img class="logo" style='width:100%;' src='data:image/png;base64,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'/>
                        </td>
                        <td style="width: 50%;">
                            <table style="margin-left: 40px;">
                                <tr>
                                    <th style='text-align:left; font-size:8px;'>Company:</th>
                                    <td style='font-size:10px; font-size:8px;'>Just Quality Systems SL</td>
                                </tr>
                                <tr>
                                    <th style='text-align:left; font-size:8px;'>Register:</th>
                                    <td style='font-size:10px; font-size:8px;'>B73801201</td>
                                </tr>
                                <tr>
                                    <th style='text-align:left; font-size:8px;'>Contact:</th>
                                    <td style='font-size:8px;'>+34 868 081 454 info@justq.eu</td>
                                </tr>
                                <tr>
                                    <th style='text-align:left; font-size:8px;'>Chief executive:</th>
                                    <td style='font-size:8px;'>Carmen Nicolás</td>
                                </tr>
                            </table>
                        </td>
                        <td style="width: 25%;">
                            `+logo+`
                        </td>
                    </tr>
                    `+ (cliente_id === 12 ? subheaderMpg : "") +`
                </table>

        </div>`;





            const headerEurovetCultivar = `<div id='header' style='width: 100%; margin-top: -20px;'>
                
                <table style="margin-left: 25px; margin-right: 25px;">
                    <tr>
                        <td style="width: 25%;">
                            `+logo+`
                        </td>
                        <td style="width: 50%;">
                            <table style="margin-left: 40px;">
                                <tr>
                                    <td style='font-size:10px; font-size:8px; color: #387839;'>ASESORIA TECNICO ALIMENTARIA <label style='font-weight: bold;'>EUROVET</label></td>
                                </tr>
                            </table>
                        </td>
                        <td style="width: 25%;">
                            <table style="width: 100%;">
                                <tr>
                                    <td style='font-size:10px; font-size:8px; color: #387839; text-align: right;'>C/ Cronos, 26<br>Portal 3, 3ºE37<br>28037 MADRID, SPAIN<br>Tel.: (+34) 91 388 04 92<br>Fax.: (+34) 91 300 57 76<br>email: eurovet@eurovet.es</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>

        </div>`;

            const footerPredefEs = `<div style="text-align: center; width: 100%; margin-bottom: -15px;">
                                    <p style="font-size:6px; text-align:center; margin-bottom: 1px; display: block; width: 90%; margin-left: auto; margin-right: auto; ">El presente reporte se emite bajo las Condiciones Generales de APCAS. La emisión del mismo no exonera a los compradores o vendedores de ejercer todos sus derechos y descargar todas lasresponsabilidades bajo el contrato de venta pactado entre ambas partes.</p>
                                    <span style="color: black; font-size: 7px;" class="pageNumber"></span>
                                </div>`;

            const footerPredefEn = `<div style="text-align: center; width: 100%; margin-bottom: -15px;">
                                    <p style="font-size:6px; text-align:center; margin-bottom: 1px; display: block; width: 90%; margin-left: auto; margin-right: auto; ">This Certificate is issued under General Conditions of the International Federation of Inspection Agencies. The issuance of this Certificate does
        not exonerate buyers or sellers from exercising all their rights and discharging all their liabilities under the Contract of Sales.</p>
                                    <span style="color: black; font-size: 7px;" class="pageNumber"></span>
                                </div>`;


            let footer;
            let header;
            if(idioma === 'es'){
                if(cliente_id === 59 || cliente_id === 164){
                    footer = footerPredefEs;
                    header = headerEurovetCultivar;
                }else{
                    footer = footerPredefEs;
                    header = headerPredefEs;
                }

            }else if(idioma === 'en'){
                if(cliente_id === 59 || cliente_id === 164){        
                    footer = footerPredefEn;
                    header = headerEurovetCultivar;
                }else{
                    footer = footerPredefEn;
                    header = headerPredefEn;
                }
            }


            const pdf = await webPage.pdf({
                printBackground: true,
                format: 'A4',
                margin: {
                        bottom: 28,
                        left: 40,
                        right: 40,
                        top: 150
                    },
                headerTemplate: header,
                footerTemplate: footer,
                displayHeaderFooter: true,
            });

            await browser.close();

            res.contentType("application/pdf");
            res.send(pdf);

        }catch(error){
            console.log(error)
            res.redirect('/ERROR/pdf')
        }


    },

   

};
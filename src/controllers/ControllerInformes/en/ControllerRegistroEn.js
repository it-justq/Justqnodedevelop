const excelJS = require("exceljs");

const layout = '../../views/pages/informes/registro/';
const modules = 'modules/informes/registro/';

const {getUserData} = require(appRoot+'/utils/GetUser');
const {postRegistro, getRegistro} = require(appRoot+'/utils/Informe/Registro/RegistroData');

const nav = 'registro';

module.exports = {

	async getRegistroEn(req, res){
        const user = await getUserData(req);
        const data = await getRegistro();
        res.render(modules+'en/registro', {layout: layout+'en/registro.hbs', csrfToken: req.csrfToken(), user, nav, data});
    },

    async postRegistroEn(req, res){
        let DATA = await postRegistro(req.body, req.session.passport.user);
        if(DATA){
            const workbook = new excelJS.Workbook();
            const worksheet = workbook.addWorksheet("Exported data");
            
            worksheet.columns = [   
                { header: "Client", key: "control_cliente_nombre", width: 20 },
                { header: "Control No.", key: "control_codigo", width: 20 }, 
                { header: "Date", key: "control_fecha", width: 15 },
                { header: "Reference", key: "control_referencia", width: 20 },
                { header: "Place of control", key: "control_plataforma_nombre", width: 30 },
                { header: "From", key: "control_pais_origen_nombre", width: 20 },
                { header: "To", key: "control_pais_destino_nombre", width: 20 },
                { header: "Container No.", key: "control_expedicion_contenedor", width: 20 },
                { header: "Surveyor", key: "control_tecnico_nombre", width: 20 },
                { header: "Family", key: "control_producto_familia_nombre", width: 15 },
                { header: "Pallets No.", key: "control_packaging_pallets", width: 10 },
                { header: "Assessment", key: "control_valoracion_nombre", width: 20 },
            ];          
    
            for(let i=0; i<DATA.controles.length; i++){
                worksheet.addRow(DATA.controles[i]); 
            }
                
            worksheet.getRow(1).eachCell((cell) => {  
                cell.font = { bold: true };
            });
            
            try {  
                const data = await workbook.xlsx.writeFile('E:/registro_download/'+DATA.user_requested+'.xlsx').then(() => {
                    res.download('E:/registro_download/'+DATA.user_requested+'.xlsx');
                });
            } catch (err) {    
                res.redirect('/informe/registro/en');
            }
        }else{
            res.redirect('/informe/registro/en');
        }

       
    }

};
const excelJS = require("exceljs");

const layout = '../../views/pages/informes/registro/';
const modules = 'modules/informes/registro/';

const {getUserData} = require(appRoot+'/utils/GetUser');
const {postRegistro, getRegistro} = require(appRoot+'/utils/Informe/Registro/RegistroData');

const nav = 'registro';

module.exports = {

	async getRegistro(req, res){
        const user = await getUserData(req);
        const data = await getRegistro();
        res.render(modules+'registro', {layout: layout+'registro.hbs', csrfToken: req.csrfToken(), user, nav, data});
    },

    async postRegistro(req, res){
        let DATA = await postRegistro(req.body, req.session.passport.user);
        if(DATA){
            const workbook = new excelJS.Workbook();
            const worksheet = workbook.addWorksheet("Exported data");
    
            worksheet.columns = [   
                { header: "Cliente", key: "control_cliente_nombre", width: 20 },
                { header: "Nº Control", key: "control_codigo", width: 20 }, 
                { header: "Fecha", key: "control_fecha", width: 15 },
                { header: "Referencia", key: "control_referencia", width: 20 },
                { header: "Lugar del control", key: "control_plataforma_nombre", width: 30 },
                { header: "País de origen", key: "control_pais_origen_nombre", width: 20 },
                { header: "País de destino", key: "control_pais_destino_nombre", width: 20 },
                { header: "Nº Contenedor", key: "control_expedicion_contenedor", width: 20 },
                { header: "Técnico", key: "control_tecnico_nombre", width: 20 },
                { header: "Familia", key: "control_producto_familia_nombre", width: 15 },
                { header: "Nº Pallets", key: "control_packaging_pallets", width: 10 },
                { header: "Valoración", key: "control_valoracion_nombre", width: 20 },
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
                res.redirect('/informe/registro');
            }
        }else{
            res.redirect('/informe/registro');
        }

       
    }

};
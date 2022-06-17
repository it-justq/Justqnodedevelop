const config = require(appRoot+'/utils/Conexion/UtilDatabase_sqls');
const sql = require('mssql');

const {redateSqls} = require(appRoot+'/utils/Date');

module.exports = {

    async getControlDatos(control){

        try{
            const mssql = await sql.connect(config);


        //------DATOS DEL CONTROL
                let datos_control = await mssql.query("SELECT Plataforma_idGuid AS plataforma_id, Fecha_Control AS fecha_control, Cliente_idGuid AS cliente_id, Referencia_Cliente AS referencia, Tecnico_idGuid AS tecnico_id, Valoracion_idGuid AS valoracion_id FROM Control WHERE Control_idGuid = '"+control+"'");
                datos_control = datos_control.recordset[0];

               
                if(datos_control.valoracion_id != null){
                        let valoracion_nombre = await mssql.query("SELECT Nombre FROM VALORACION WHERE Valoracion_idGuid = '"+datos_control.valoracion_id+"'");
                        datos_control.valoracion_nombre = valoracion_nombre.recordset[0].Nombre;
                }else{
                        datos_control.valoracion_nombre = null;
                }

                if(datos_control.plataforma_id != null){
                        let plataforma_nombre = await mssql.query("SELECT Nombre FROM PLATAFORMAS WHERE Plataforma_idGuid = '"+datos_control.plataforma_id+"'");
                        datos_control.plataforma_nombre = plataforma_nombre.recordset[0].Nombre;
                }else{
                        datos_control.plataforma_nombre = null;
                }

                if(datos_control.cliente_id != null){
                        let cliente_nombre = await mssql.query("SELECT Nombre FROM CLIENTES WHERE Cliente_idGuid = '"+datos_control.cliente_id+"'");
                        datos_control.cliente_nombre = cliente_nombre.recordset[0].Nombre;
                }else{
                        datos_control.cliente_nombre = null;
                }

                if(datos_control.tecnico_id != null){
                        let tecnico_nombre = await mssql.query("SELECT Nombre FROM USUARIOS WHERE Usuario_idGuid = '"+datos_control.tecnico_id+"'");
                        datos_control.tecnico_nombre = tecnico_nombre.recordset[0].Nombre;
                }else{
                        datos_control.tecnico_nombre = null;
                }

                if(datos_control.fecha_control != null){
                        datos_control.fecha_control = redateSqls(datos_control.fecha_control);
                }
                
        //------DATOS DE LA EXPEDICION
                let datos_expedicion = await mssql.query("SELECT Fecha_Llegada AS fecha_llegada, Fecha_Salida AS fecha_salida, Numero_Contenedor AS numero_contenedor, Numero_Placa AS numero_placa, Puc_Proveedor AS puc_proveedor, Pais_Origen_idGuid AS pais_origen_id, Pais_Destino_idGuid AS pais_destino_id FROM control WHERE Control_idGuid = '"+control+"'");
                datos_expedicion = datos_expedicion.recordset[0];

                if(datos_expedicion.pais_origen_id != null){
                        let pais_origen_nombre = await mssql.query("SELECT Nombre FROM PAISES WHERE Pais_idGuid = '"+datos_expedicion.pais_origen_id+"'");
                        datos_expedicion.pais_origen_nombre = pais_origen_nombre.recordset[0].Nombre;
                }else{
                        datos_expedicion.pais_origen_nombre = null;
                }

                if(datos_expedicion.pais_destino_id != null){
                        let pais_destino_nombre = await mssql.query("SELECT Nombre FROM PAISES WHERE Pais_idGuid = '"+datos_expedicion.pais_destino_id+"'");
                        datos_expedicion.pais_destino_nombre = pais_destino_nombre.recordset[0].Nombre;
                }else{
                        datos_expedicion.pais_destino_nombre = null;
                }

                if(datos_expedicion.fecha_llegada != null){
                        datos_expedicion.fecha_llegada = redateSqls(datos_expedicion.fecha_llegada);
                }

                if(datos_expedicion.fecha_salida != null){
                        datos_expedicion.fecha_salida = redateSqls(datos_expedicion.fecha_salida);
                }


                //------DATOS DEL PRODUCTO
                let datos_producto = await mssql.query("SELECT Familia_idGuid AS familia_id, Variedad_idGuid AS variedad_id, Calibre_idGuid AS calibre_id, Embalaje_idGuid AS embalaje_id, Confeccion_idGuid AS confeccion_id, Fecha_Confeccion AS fecha_confeccion, Marca AS marca, Numero_Lote AS numero_lote FROM control WHERE Control_idGuid = '"+control+"'");
                datos_producto = datos_producto.recordset[0];

                if(datos_producto.familia_id != null){
                        let familia_nombre = await mssql.query("SELECT Nombre FROM FAMILIA WHERE Familia_idGuid = '"+datos_producto.familia_id+"'");
                        datos_producto.familia_nombre = familia_nombre.recordset[0].Nombre;
                }else{
                        datos_producto.familia_nombre = null;
                }

                if(datos_producto.variedad_id != null){
                        let variedad_nombre = await mssql.query("SELECT Nombre FROM VARIEDAD WHERE Variedad_idGuid = '"+datos_producto.variedad_id+"'");
                        datos_producto.variedad_nombre = variedad_nombre.recordset[0].Nombre;
                }else{
                        datos_producto.variedad_nombre = null;
                }

                if(datos_producto.calibre_id != null){
                        let calibre_nombre = await mssql.query("SELECT Nombre FROM CALIBRE WHERE Calibre_idGuid = '"+datos_producto.calibre_id+"'");
                        datos_producto.calibre_nombre = calibre_nombre.recordset[0].Nombre;
                }else{
                        datos_producto.calibre_nombre = null;
                }
                
                
                if(datos_producto.embalaje_id != null){
                        let embalaje_nombre = await mssql.query("SELECT Nombre FROM EMBALAJE WHERE Embalaje_idGuid = '"+datos_producto.embalaje_id+"'");
                        datos_producto.embalaje_nombre = embalaje_nombre.recordset[0].Nombre;
                }else{
                        datos_producto.embalaje_nombre = null;
                }

                if(datos_producto.confeccion_id != null){
                        let confeccion_nombre = await mssql.query("SELECT Nombre FROM CONFECCION WHERE Confeccion_idGuid = '"+datos_producto.confeccion_id+"'");
                        datos_producto.confeccion_nombre = confeccion_nombre.recordset[0].Nombre;
                }else{
                        datos_producto.confeccion_nombre = null;
                }

                if(datos_producto.fecha_confeccion != null){
                        datos_producto.fecha_confeccion = redateSqls(datos_producto.fecha_confeccion);
                }
                

        //------DATOS DEL EMBALAJE
                let datos_embalaje = await mssql.query("SELECT Cajas_Pallet AS cajas_pallet, Numero_Pallets AS numero_pallets, Peso_Embalaje AS peso_embalaje FROM CONTROL WHERE Control_idGuid = '"+control+"'");
                datos_embalaje = datos_embalaje.recordset[0];

        //------NOTAS
                let data_notas = await mssql.query("SELECT Notas AS notas FROM CONTROL WHERE Control_idGuid = '"+control+"'");
                data_notas = data_notas.recordset[0];



                let util_valoraciones = await mssql.query('SELECT Valoracion_idGuid AS valoracion_id, Nombre AS valoracion_nombre FROM VALORACION ORDER BY Nombre ASC');
                util_valoraciones = util_valoraciones.recordset;

                let util_plataformas = await mssql.query('SELECT Plataforma_idGuid AS plataforma_id, Nombre AS plataforma_nombre FROM PLATAFORMAS ORDER BY Nombre ASC');
                util_plataformas = util_plataformas.recordset;

                let util_paises = await mssql.query('SELECT Pais_idGuid AS pais_id, Nombre AS pais_nombre FROM PAISES ORDER BY Nombre ASC');
                util_paises = util_paises.recordset;

                let util_familias = await mssql.query('SELECT Familia_idGuid AS familia_id, Nombre AS familia_nombre FROM FAMILIA ORDER BY Nombre ASC');
                util_familias = util_familias.recordset;

                let util_variedades = await mssql.query("SELECT Variedad_idGuid AS variedad_id, Nombre AS variedad_nombre FROM VARIEDAD WHERE Familia_idGuid = '"+datos_producto.familia_id+"' ORDER BY Nombre ASC");
                util_variedades = util_variedades.recordset;                

                let util_confecciones = await mssql.query("SELECT Familia_idGuid AS familia_id, Confeccion_idGuid AS confeccion_id FROM FAMILIAS_CONFECCIONES WHERE Familia_idGuid = '"+datos_producto.familia_id+"'");
                util_confecciones = util_confecciones.recordset;

                for(let i = 0; i < util_confecciones.length; i ++){
                        let confeccion_nombre = await mssql.query("SELECT Nombre FROM CONFECCION WHERE Confeccion_idGuid = '"+util_confecciones[i].confeccion_id+"' ORDER BY Nombre ASC");
                        util_confecciones[i].confeccion_nombre = confeccion_nombre.recordset[0].Nombre;
                }

                
                let result = {status: "ok", datos: datos_control, expedicion: datos_expedicion, producto: datos_producto, embalaje: datos_embalaje, notas: data_notas, valoraciones: util_valoraciones, plataformas: util_plataformas, paises: util_paises, familias: util_familias, variedades: util_variedades, confecciones: util_confecciones};

                return result;
        }catch(error){
            console.log(error)
                return {status:'error', code: error};
        }
    },

    async postControlDatos(VALUES){

        try {
            const mssql = await sql.connect(config);

            let name = VALUES.data.name;
            let control_id = parseInt(VALUES.data.controlId);
            let value = VALUES.data.value;
            await pool.query('UPDATE control SET '+name+' = ? WHERE control_id = ?', [value, control_id]);

            return {'status':'ok'};
        } catch (error) {
                return {'status':'error', 'code': error.code};
        }


    },


};
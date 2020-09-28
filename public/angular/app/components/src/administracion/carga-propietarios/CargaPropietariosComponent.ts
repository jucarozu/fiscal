import { Component, Input, OnInit } from '@angular/core';

import { CanActivate, ComponentInstruction, ROUTER_DIRECTIVES, Router } from '@angular/router-deprecated';
import { IsLoggedIn } from '../../../../constants/IsLoggedIn';

import { IOpcion } from "../../../../interfaces/IOpcion";
import { IUsuario } from "../../../../interfaces/IUsuario";

import { AuthService } from '../../../../services/AuthService';
import { CargaPropietariosService } from "../../../../services/CargaPropietariosService";
import { AuditoriaService } from "../../../../services/AuditoriaService";

import { NotificationsService } from 'angular2-notifications/components';
import { SimpleNotificationsComponent } from 'angular2-notifications/components';

import { FILE_UPLOAD_DIRECTIVES, FileUploader } from 'ng2-file-upload';

import { DataTable, Column } from 'primeng/primeng';

declare var jQuery : any;
 
@Component({
    selector: 'carga-propietarios-view',
    templateUrl: './app/components/src/administracion/carga-propietarios/carga-propietarios-view.html',
    bindings: [AuthService, CargaPropietariosService, AuditoriaService, NotificationsService],
    directives: [
        SimpleNotificationsComponent, FILE_UPLOAD_DIRECTIVES
    ]
})

@CanActivate((next: ComponentInstruction, previous: ComponentInstruction) => {
    return IsLoggedIn(next, previous);
})

export class CargaPropietariosComponent implements OnInit
{
	isLoading: boolean = false;

    accionAudit: number = 1; // Consultar

    userLogin: IUsuario;
    opcion: IOpcion;

    camposValidos: Array<Object> = [];
    campos: Array<Object> = [];

    encabezados: Array<Object> = [];
    filas: Array<Object> = [];
    filasView: Array<Object> = [];

    caracteres: Array<Object> = [];

    separador: string = ",";
    tieneEncabezados: boolean = false;

    advertencias: Array<Object> = [];
    errores: Array<Object> = [];
    
    notificationsOptions = {
        timeOut: 5000,
        lastOnBottom: false,
        clickToClose: true,
        maxLength: 0,
        maxStack: 7,
        showProgressBar: false,
        pauseOnHover: true,
        preventDuplicates: true,
        preventLastDuplicates: false
    };

    uploader: FileUploader = new FileUploader({ url: "" });

    constructor(private router: Router,
                private authService: AuthService,
                private cargaPropietariosService: CargaPropietariosService,
                private auditoriaService: AuditoriaService,
                private notificationService: NotificationsService) {}

    ngOnInit()
    {
        if (!this.authService.authorize())
            this.router.navigate(['Perfil']);

        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));

        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
        
        this.agregarEventos();
        this.cargarCombos();

        this.auditoriaService.insert(this.opcion.opcion, this.accionAudit);
    }

    private agregarEventos()
    {
        // Limpiar el campo del archivo cargado en caso de que no se haya seleccionado ninguno.
        document.getElementById('input-plano').addEventListener('change', function() {
            
            if (this.files.length == 0)
            {
                jQuery('#btn-reset-uploader').click();
            }

        }, false);
    }

    private cargarCombos()
    {
        this.caracteres = [
            { "nombre" : ",", "valor" : "," },
            { "nombre" : ";", "valor" : ";" },
            { "nombre" : "|", "valor" : "|" },
            { "nombre" : "Tabulador", "valor" : "\t" }
        ];

        this.camposValidos = [
            { "nombre" : "Placa", "valor" : "placa" },
            { "nombre" : "Tipo documento", "valor" : "tipo_doc" },
            { "nombre" : "Numero documento", "valor" : "numero_doc" },
            { "nombre" : "Nombres", "valor" : "nombres" },
            { "nombre" : "Apellidos", "valor" : "apellidos" },
            { "nombre" : "Direccion", "valor" : "direccion" },
            { "nombre" : "Ciudad", "valor" : "ciudad" },
            { "nombre" : "Telefono", "valor" : "telefono" },
            { "nombre" : "Fecha direccion", "valor" : "fecha_direccion" },
            { "nombre" : "Fecha propietario", "valor" : "fecha_propietario" }
        ];
    }

    private cargarPlano()
    {
        // Se obtiene el archivo cargado.
        let inputFile = jQuery('#input-plano')[0];
        let file = inputFile.files.length > 0 ? inputFile.files[0] : null;

        // Se verifica que se haya cargado un archivo.
        if (file == null)
        {
            this.notificationService.error("Carga de archivo", "Debe seleccionar un archivo para cargar la información.");
            return;
        }
        
        // Se obtiene la extensión del archivo cargado.
        let arrayFile = file.name.split('.');
        let tipo = arrayFile[arrayFile.length - 1];

        // Se valida que el archivo sea de tipo CSV.
        if (tipo != "csv")
        {
            this.notificationService.error("Tipo de archivo", "El archivo debe ser de tipo CSV.");
            return;
        }
        
        let reader = new FileReader();

        // Se añade un evento que procese la carga y visualización del archivo plano.
        reader.onload = function() {
            document.getElementById('div-contenido-plano').innerHTML = this.result;
            jQuery('#btn-visualizar-plano').click();
        }

        reader.readAsBinaryString(file);
    }

    private visualizarContenidoPlano()
    {
        let contenido = document.getElementById('div-contenido-plano').innerHTML;

        // Se valida que el archivo plano tenga información por cargar.
        if (contenido.length == 0)
        {
            this.notificationService.error("Validación", "No existe información por cargar en el archivo plano.");
            return;
        }

        let lineas = contenido.split(/\r\n|\n/);
        let lineaInicial = 0;

        this.encabezados = [];
        this.filas = [];
        this.filasView = [];

        // Si el archivo tiene encabezados, se generan los nombres de columna a partir de éstos.
        if (this.tieneEncabezados)
        {
            this.encabezados = lineas[0].split(this.separador);
            lineaInicial = 1;
        }

        // Se obtiene la información a cargar desde el archivo plano.
        for (let i = lineaInicial; i < lineas.length; i++)
        {
            let data = lineas[i].split(this.separador);
            let fila = [];

            for (let j = 0; j < data.length; j++)
            {
                // Si se encuentra en la primera fila y el archivo no tiene encabezados, se generan nombres de columna genéricos.
                if (i == lineaInicial && !this.tieneEncabezados)
                {
                    this.encabezados.push("COLUMNA_" + (j + 1));
                }

                fila.push(data[j]);
            }

            this.filas.push(fila);

            if (i < lineaInicial + 20)
            {
                this.filasView.push(fila);
            }
        }
    }

    private procesarInformacion()
    {
        // Se realizan validaciones de los nombres de las columnas del archivo plano.
        if (!this.validarCampos())
        {
            return;
        }

        this.isLoading = true;

        let cargaPropietariosString = this.generarCargaPropietariosString(this.campos, this.filas);
 
        this.cargaPropietariosService.insert(cargaPropietariosString).then(
            (res) => {
                this.advertencias = res.advertencias;
                this.errores = res.errores;

                this.descargarResultado();

                this.isLoading = false;

                this.notificationService.success("Operación exitosa", "La información fue cargada correctamente.");
                this.resetFormulario();
            },
            (error) => {
                this.isLoading = false;
                this.notificationService.error("Error", "Ha ocurrido un error al cargar la información. Por favor, verifique que la información de los campos del archivo plano sea correcta.");
            }
        );
    }

    private validarCampos() : boolean
    {
        // Se obtienen los nombres de columna indicados por el usuario para cada campo del archivo plano.
        let campos = jQuery(".select-campo");

        for (let i = 0; i < campos.length; i++)
        {
            // Se valida que se haya indicado el tipo de información de cada columna del archivo plano.
            if (campos[i].value == "")
            {
                this.notificationService.error("Validación", "Debe indicar a qué tipo de información pertenece cada columna del archivo plano.");
                return false;
            }

            for (let j = 0; j < campos.length; j++)
            {
                // Se valida que no existan dos o más columnas que hagan referencia al mismo tipo de información.
                if (i != j && campos[i].value == campos[j].value)
                {
                    this.notificationService.error("Validación", "No puede haber más de una columna que haga referencia al mismo tipo de información.");
                    return false;
                }
            }
        }

        // Si se cumplen las validaciones, se almacena la información de los campos indicados en una variable global de campos del archivo plano.
        this.campos = campos;

        return true;
    }

    private generarCargaPropietariosString(campos, filas) : string
    {
        var i = 0,
            j = 0,
            keys = [],
            fila, cargaInfoJson = [];

        // Se obtienen los nombres de los campos del archivo plano y se almacenan en un array.
        for (i = 0; i < campos.length; i++)
        {
            keys.push(campos[i].value);
        }

        // Se recorren las filas del archivo plano y se agregan a un JSON donde el nombre del campo es la clave y el contenido del campo es su valor.
        for (i = 0; i < filas.length; i++)
        {
            fila = {};

            for (j = 0; j < campos.length; j++) {
                fila[keys[j]] = filas[i][j];
            }

            cargaInfoJson.push(fila);
        }

        return '&informacion=' + JSON.stringify(cargaInfoJson).replace(/"/g, '\\"') +
               '&tiene_encabezados=' + (this.tieneEncabezados ? 'true' : 'false') +
               '&usuario_registra=' + this.userLogin.usuario;
    }

    private descargarResultado()
    {
        let csvInformacion = this.exportInformacionToCSV(this.encabezados, this.filas);
        let csvAdvertencias = this.exportAdvertenciasToCSV(this.advertencias);
        let csvErrores = this.exportErroresToCSV(this.errores);

        let zip = new JSZip();
        zip.file("informacion.csv", csvInformacion);
        zip.file("advertencias.csv", csvAdvertencias);
        zip.file("errores.csv", csvErrores);
        
        zip.generateAsync({ type: "base64" }).then(function (base64) {
            var encodedUri = "data:application/zip;base64," + base64;
            var link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "resultado.zip");
            document.body.appendChild(link);
            link.click();
        });
    }

    private exportInformacionToCSV(jsonEncabezados, jsonFilas)
    {
        let data = [];
        let csvContent = "";

        if (this.tieneEncabezados)
        {
            data.push([ jsonEncabezados ]);
        }

        for (let i in jsonFilas)
        {
            data.push([ jsonFilas[i] ]);
        }

        data.forEach(function(infoArray, index) {
            let dataString = infoArray.join(",");
            csvContent += index < data.length ? dataString + "\n" : dataString;
        });

        return csvContent;
    }

    private exportAdvertenciasToCSV(jsonAdvertencias)
    {
        let data = [];
        let csvContent = "";

        data.push([ 'LINEA', 'CAMPO', 'MENSAJE' ]);

        for (let i in jsonAdvertencias)
        {
            data.push([ jsonAdvertencias[i]['linea'], jsonAdvertencias[i]['campo'], jsonAdvertencias[i]['mensaje'] ]);
        }

        data.forEach(function(infoArray, index) {
            let dataString = infoArray.join(",");
            csvContent += index < data.length ? dataString + "\n" : dataString;
        });

        return csvContent;
    }

    private exportErroresToCSV(jsonErrores)
    {
        let data = [];
        let csvContent = "";

        data.push([ 'LINEA', 'MENSAJE' ]);

        for (let i in jsonErrores)
        {
            data.push([ jsonErrores[i]['linea'], jsonErrores[i]['mensaje'] ]);
        }

        data.forEach(function(infoArray, index) {
            let dataString = infoArray.join(",");
            csvContent += index < data.length ? dataString + "\n" : dataString;
        });

        return csvContent;
    }

    private resetFormulario()
    {
        jQuery("#input-plano").val(null);
        this.resetUploader();

        this.separador = ",";
        this.tieneEncabezados = false;

        this.encabezados = [];
        this.filas = [];
        this.filasView = [];
    }

    private resetUploader()
    {
        this.uploader.clearQueue();
    }

    private loading() : boolean
    {
        return this.isLoading;
    }
}
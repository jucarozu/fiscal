"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var router_deprecated_1 = require('@angular/router-deprecated');
var IsLoggedIn_1 = require('../../../../constants/IsLoggedIn');
var AuthService_1 = require('../../../../services/AuthService');
var CargaPropietariosService_1 = require("../../../../services/CargaPropietariosService");
var AuditoriaService_1 = require("../../../../services/AuditoriaService");
var components_1 = require('angular2-notifications/components');
var components_2 = require('angular2-notifications/components');
var ng2_file_upload_1 = require('ng2-file-upload');
var CargaPropietariosComponent = (function () {
    function CargaPropietariosComponent(router, authService, cargaPropietariosService, auditoriaService, notificationService) {
        this.router = router;
        this.authService = authService;
        this.cargaPropietariosService = cargaPropietariosService;
        this.auditoriaService = auditoriaService;
        this.notificationService = notificationService;
        this.isLoading = false;
        this.accionAudit = 1; // Consultar
        this.camposValidos = [];
        this.campos = [];
        this.encabezados = [];
        this.filas = [];
        this.filasView = [];
        this.caracteres = [];
        this.separador = ",";
        this.tieneEncabezados = false;
        this.advertencias = [];
        this.errores = [];
        this.notificationsOptions = {
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
        this.uploader = new ng2_file_upload_1.FileUploader({ url: "" });
    }
    CargaPropietariosComponent.prototype.ngOnInit = function () {
        if (!this.authService.authorize())
            this.router.navigate(['Perfil']);
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
        this.agregarEventos();
        this.cargarCombos();
        this.auditoriaService.insert(this.opcion.opcion, this.accionAudit);
    };
    CargaPropietariosComponent.prototype.agregarEventos = function () {
        // Limpiar el campo del archivo cargado en caso de que no se haya seleccionado ninguno.
        document.getElementById('input-plano').addEventListener('change', function () {
            if (this.files.length == 0) {
                jQuery('#btn-reset-uploader').click();
            }
        }, false);
    };
    CargaPropietariosComponent.prototype.cargarCombos = function () {
        this.caracteres = [
            { "nombre": ",", "valor": "," },
            { "nombre": ";", "valor": ";" },
            { "nombre": "|", "valor": "|" },
            { "nombre": "Tabulador", "valor": "\t" }
        ];
        this.camposValidos = [
            { "nombre": "Placa", "valor": "placa" },
            { "nombre": "Tipo documento", "valor": "tipo_doc" },
            { "nombre": "Numero documento", "valor": "numero_doc" },
            { "nombre": "Nombres", "valor": "nombres" },
            { "nombre": "Apellidos", "valor": "apellidos" },
            { "nombre": "Direccion", "valor": "direccion" },
            { "nombre": "Ciudad", "valor": "ciudad" },
            { "nombre": "Telefono", "valor": "telefono" },
            { "nombre": "Fecha direccion", "valor": "fecha_direccion" },
            { "nombre": "Fecha propietario", "valor": "fecha_propietario" }
        ];
    };
    CargaPropietariosComponent.prototype.cargarPlano = function () {
        // Se obtiene el archivo cargado.
        var inputFile = jQuery('#input-plano')[0];
        var file = inputFile.files.length > 0 ? inputFile.files[0] : null;
        // Se verifica que se haya cargado un archivo.
        if (file == null) {
            this.notificationService.error("Carga de archivo", "Debe seleccionar un archivo para cargar la información.");
            return;
        }
        // Se obtiene la extensión del archivo cargado.
        var arrayFile = file.name.split('.');
        var tipo = arrayFile[arrayFile.length - 1];
        // Se valida que el archivo sea de tipo CSV.
        if (tipo != "csv") {
            this.notificationService.error("Tipo de archivo", "El archivo debe ser de tipo CSV.");
            return;
        }
        var reader = new FileReader();
        // Se añade un evento que procese la carga y visualización del archivo plano.
        reader.onload = function () {
            document.getElementById('div-contenido-plano').innerHTML = this.result;
            jQuery('#btn-visualizar-plano').click();
        };
        reader.readAsBinaryString(file);
    };
    CargaPropietariosComponent.prototype.visualizarContenidoPlano = function () {
        var contenido = document.getElementById('div-contenido-plano').innerHTML;
        // Se valida que el archivo plano tenga información por cargar.
        if (contenido.length == 0) {
            this.notificationService.error("Validación", "No existe información por cargar en el archivo plano.");
            return;
        }
        var lineas = contenido.split(/\r\n|\n/);
        var lineaInicial = 0;
        this.encabezados = [];
        this.filas = [];
        this.filasView = [];
        // Si el archivo tiene encabezados, se generan los nombres de columna a partir de éstos.
        if (this.tieneEncabezados) {
            this.encabezados = lineas[0].split(this.separador);
            lineaInicial = 1;
        }
        // Se obtiene la información a cargar desde el archivo plano.
        for (var i = lineaInicial; i < lineas.length; i++) {
            var data = lineas[i].split(this.separador);
            var fila = [];
            for (var j = 0; j < data.length; j++) {
                // Si se encuentra en la primera fila y el archivo no tiene encabezados, se generan nombres de columna genéricos.
                if (i == lineaInicial && !this.tieneEncabezados) {
                    this.encabezados.push("COLUMNA_" + (j + 1));
                }
                fila.push(data[j]);
            }
            this.filas.push(fila);
            if (i < lineaInicial + 20) {
                this.filasView.push(fila);
            }
        }
    };
    CargaPropietariosComponent.prototype.procesarInformacion = function () {
        var _this = this;
        // Se realizan validaciones de los nombres de las columnas del archivo plano.
        if (!this.validarCampos()) {
            return;
        }
        this.isLoading = true;
        var cargaPropietariosString = this.generarCargaPropietariosString(this.campos, this.filas);
        this.cargaPropietariosService.insert(cargaPropietariosString).then(function (res) {
            _this.advertencias = res.advertencias;
            _this.errores = res.errores;
            _this.descargarResultado();
            _this.isLoading = false;
            _this.notificationService.success("Operación exitosa", "La información fue cargada correctamente.");
            _this.resetFormulario();
        }, function (error) {
            _this.isLoading = false;
            _this.notificationService.error("Error", "Ha ocurrido un error al cargar la información. Por favor, verifique que la información de los campos del archivo plano sea correcta.");
        });
    };
    CargaPropietariosComponent.prototype.validarCampos = function () {
        // Se obtienen los nombres de columna indicados por el usuario para cada campo del archivo plano.
        var campos = jQuery(".select-campo");
        for (var i = 0; i < campos.length; i++) {
            // Se valida que se haya indicado el tipo de información de cada columna del archivo plano.
            if (campos[i].value == "") {
                this.notificationService.error("Validación", "Debe indicar a qué tipo de información pertenece cada columna del archivo plano.");
                return false;
            }
            for (var j = 0; j < campos.length; j++) {
                // Se valida que no existan dos o más columnas que hagan referencia al mismo tipo de información.
                if (i != j && campos[i].value == campos[j].value) {
                    this.notificationService.error("Validación", "No puede haber más de una columna que haga referencia al mismo tipo de información.");
                    return false;
                }
            }
        }
        // Si se cumplen las validaciones, se almacena la información de los campos indicados en una variable global de campos del archivo plano.
        this.campos = campos;
        return true;
    };
    CargaPropietariosComponent.prototype.generarCargaPropietariosString = function (campos, filas) {
        var i = 0, j = 0, keys = [], fila, cargaInfoJson = [];
        // Se obtienen los nombres de los campos del archivo plano y se almacenan en un array.
        for (i = 0; i < campos.length; i++) {
            keys.push(campos[i].value);
        }
        // Se recorren las filas del archivo plano y se agregan a un JSON donde el nombre del campo es la clave y el contenido del campo es su valor.
        for (i = 0; i < filas.length; i++) {
            fila = {};
            for (j = 0; j < campos.length; j++) {
                fila[keys[j]] = filas[i][j];
            }
            cargaInfoJson.push(fila);
        }
        return '&informacion=' + JSON.stringify(cargaInfoJson).replace(/"/g, '\\"') +
            '&tiene_encabezados=' + (this.tieneEncabezados ? 'true' : 'false') +
            '&usuario_registra=' + this.userLogin.usuario;
    };
    CargaPropietariosComponent.prototype.descargarResultado = function () {
        var csvInformacion = this.exportInformacionToCSV(this.encabezados, this.filas);
        var csvAdvertencias = this.exportAdvertenciasToCSV(this.advertencias);
        var csvErrores = this.exportErroresToCSV(this.errores);
        var zip = new JSZip();
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
    };
    CargaPropietariosComponent.prototype.exportInformacionToCSV = function (jsonEncabezados, jsonFilas) {
        var data = [];
        var csvContent = "";
        if (this.tieneEncabezados) {
            data.push([jsonEncabezados]);
        }
        for (var i in jsonFilas) {
            data.push([jsonFilas[i]]);
        }
        data.forEach(function (infoArray, index) {
            var dataString = infoArray.join(",");
            csvContent += index < data.length ? dataString + "\n" : dataString;
        });
        return csvContent;
    };
    CargaPropietariosComponent.prototype.exportAdvertenciasToCSV = function (jsonAdvertencias) {
        var data = [];
        var csvContent = "";
        data.push(['LINEA', 'CAMPO', 'MENSAJE']);
        for (var i in jsonAdvertencias) {
            data.push([jsonAdvertencias[i]['linea'], jsonAdvertencias[i]['campo'], jsonAdvertencias[i]['mensaje']]);
        }
        data.forEach(function (infoArray, index) {
            var dataString = infoArray.join(",");
            csvContent += index < data.length ? dataString + "\n" : dataString;
        });
        return csvContent;
    };
    CargaPropietariosComponent.prototype.exportErroresToCSV = function (jsonErrores) {
        var data = [];
        var csvContent = "";
        data.push(['LINEA', 'MENSAJE']);
        for (var i in jsonErrores) {
            data.push([jsonErrores[i]['linea'], jsonErrores[i]['mensaje']]);
        }
        data.forEach(function (infoArray, index) {
            var dataString = infoArray.join(",");
            csvContent += index < data.length ? dataString + "\n" : dataString;
        });
        return csvContent;
    };
    CargaPropietariosComponent.prototype.resetFormulario = function () {
        jQuery("#input-plano").val(null);
        this.resetUploader();
        this.separador = ",";
        this.tieneEncabezados = false;
        this.encabezados = [];
        this.filas = [];
        this.filasView = [];
    };
    CargaPropietariosComponent.prototype.resetUploader = function () {
        this.uploader.clearQueue();
    };
    CargaPropietariosComponent.prototype.loading = function () {
        return this.isLoading;
    };
    CargaPropietariosComponent = __decorate([
        core_1.Component({
            selector: 'carga-propietarios-view',
            templateUrl: './app/components/src/administracion/carga-propietarios/carga-propietarios-view.html',
            bindings: [AuthService_1.AuthService, CargaPropietariosService_1.CargaPropietariosService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService],
            directives: [
                components_2.SimpleNotificationsComponent, ng2_file_upload_1.FILE_UPLOAD_DIRECTIVES
            ]
        }),
        router_deprecated_1.CanActivate(function (next, previous) {
            return IsLoggedIn_1.IsLoggedIn(next, previous);
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.Router, AuthService_1.AuthService, CargaPropietariosService_1.CargaPropietariosService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService])
    ], CargaPropietariosComponent);
    return CargaPropietariosComponent;
}());
exports.CargaPropietariosComponent = CargaPropietariosComponent;
//# sourceMappingURL=CargaPropietariosComponent.js.map
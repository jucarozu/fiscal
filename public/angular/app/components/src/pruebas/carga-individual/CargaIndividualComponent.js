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
var DeteccionService_1 = require("../../../../services/DeteccionService");
var FuenteService_1 = require("../../../../services/FuenteService");
var InfraccionService_1 = require("../../../../services/InfraccionService");
var ParametroService_1 = require("../../../../services/ParametroService");
var AuditoriaService_1 = require("../../../../services/AuditoriaService");
var components_1 = require('angular2-notifications/components');
var components_2 = require('angular2-notifications/components');
var core_2 = require('angular2-google-maps/core');
var ng2_file_upload_1 = require('ng2-file-upload');
var CargaIndividualComponent = (function () {
    function CargaIndividualComponent(router, authService, deteccionService, fuenteService, infraccionService, parametroService, auditoriaService, notificationService) {
        this.router = router;
        this.authService = authService;
        this.deteccionService = deteccionService;
        this.fuenteService = fuenteService;
        this.infraccionService = infraccionService;
        this.parametroService = parametroService;
        this.auditoriaService = auditoriaService;
        this.notificationService = notificationService;
        this.isLoading = false;
        this.accionAudit = 2; // Adicionar
        this.gpEstado = 16;
        this.gpTipoVehiculo = 17;
        this.gpServicio = 18;
        this.gpNivel = 19;
        this.gpSentido = 20;
        this.gpUnidadVelocidad = 21;
        this.gpTipoEvidencia = 23;
        this.errores = [];
        this.estados = [];
        this.tiposVehiculo = [];
        this.servicios = [];
        this.niveles = [];
        this.sentidos = [];
        this.unidadesVelocidad = [];
        this.tiposEvidencia = [];
        this.fuentes = [];
        this.evidencias = [];
        this.infracciones = [];
        this.evidArrayBytes = [];
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
        this.zoom = 15;
        this.lat = 10.335733927654234;
        this.lng = -75.41285991668701;
        this.uploader = new ng2_file_upload_1.FileUploader({ url: "" });
    }
    CargaIndividualComponent.prototype.ngOnInit = function () {
        if (!this.authService.authorize())
            this.router.navigate(['Perfil']);
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
        this.resetFormulario();
        this.cargarCombos();
        this.agregarEventos();
    };
    CargaIndividualComponent.prototype.agregarEventos = function () {
        // Guardar la cadena de bytes de los archivos de evidencias en el array correspondiente.
        document.getElementById('input-evidencia-add').addEventListener('change', function () {
            var fileList = this.files;
            if (FileReader && fileList && fileList.length) {
                for (var i = 0; i < fileList.length; i++) {
                    var reader = new FileReader();
                    reader.onload = function () {
                        // btoa: Convierte el archivo binario a una cadena de bytes.
                        // encodeURIComponent: Codifica los caracteres especiales de la cadena de bytes.
                        var binaryString = encodeURIComponent(btoa(this.result));
                        document.getElementById('evid-array-bytes').innerHTML = binaryString;
                        jQuery('#btn-load-evidencia').click();
                    };
                    reader.readAsBinaryString(fileList[i]);
                }
            }
        }, false);
    };
    CargaIndividualComponent.prototype.getInfracciones = function () {
        var _this = this;
        this.isLoading = true;
        this.infraccionService.get().then(function (infracciones) {
            _this.infracciones = [];
            for (var i in infracciones) {
                _this.infracciones.push({
                    infraccion: infracciones[i]['infraccion'],
                    codigo: infracciones[i]['codigo'],
                    nombre_corto: infracciones[i]['nombre_corto'],
                    tiene_infraccion: infracciones[i]['tiene_infraccion'],
                    observacion: infracciones[i]['observacion'],
                });
            }
            _this.isLoading = false;
        });
    };
    CargaIndividualComponent.prototype.cargarCombos = function () {
        var _this = this;
        this.parametroService.getByGrupo(this.gpEstado).then(function (estados) { _this.estados = estados; });
        this.parametroService.getByGrupo(this.gpTipoVehiculo).then(function (tiposVehiculo) { _this.tiposVehiculo = tiposVehiculo; });
        this.parametroService.getByGrupo(this.gpServicio).then(function (servicios) { _this.servicios = servicios; });
        this.parametroService.getByGrupo(this.gpNivel).then(function (niveles) { _this.niveles = niveles; });
        this.parametroService.getByGrupo(this.gpSentido).then(function (sentidos) { _this.sentidos = sentidos; });
        this.parametroService.getByGrupo(this.gpUnidadVelocidad).then(function (unidadesVelocidad) { _this.unidadesVelocidad = unidadesVelocidad; });
        this.parametroService.getByGrupo(this.gpTipoEvidencia).then(function (tiposEvidencia) { _this.tiposEvidencia = tiposEvidencia; });
        this.fuenteService.get().then(function (fuentes) { _this.fuentes = fuentes; });
    };
    CargaIndividualComponent.prototype.cargarEvidencia = function () {
        this.evidArrayBytes.push(document.getElementById('evid-array-bytes').innerHTML);
        document.getElementById('evid-array-bytes').innerHTML = "";
    };
    CargaIndividualComponent.prototype.borrarEvidencia = function (item) {
        var index = this.uploader.queue.indexOf(item);
        this.evidArrayBytes.splice(index, 1);
        this.uploader.queue[index].remove();
    };
    CargaIndividualComponent.prototype.cargarUbicacionFuente = function () {
        var _this = this;
        if (this.deteccionForm.fuente != null) {
            this.fuenteService.getById(this.deteccionForm.fuente).then(function (fuente) {
                _this.deteccionForm.latitud = fuente.latitud != null ? parseFloat(fuente.latitud) : null;
                _this.deteccionForm.longitud = fuente.longitud != null ? parseFloat(fuente.longitud) : null;
                _this.deteccionForm.direccion = fuente.referencia_ubicacion;
            });
        }
    };
    CargaIndividualComponent.prototype.convertPlacaToUpper = function () {
        this.deteccionForm.placa = this.deteccionForm.placa.toUpperCase();
    };
    CargaIndividualComponent.prototype.insertar = function () {
        var _this = this;
        this.resetErrores();
        // Se valida que la fecha de detección no sea mayor a la fecha actual.
        if (Date.parse(this.deteccionForm.fecha) > new Date().getTime()) {
            this.errores.push("La fecha de la detección no puede ser mayor a la fecha actual.");
            return;
        }
        // Se valida que se haya indicado la ubicación geográfica de la detección.
        if (this.deteccionForm.latitud == null || this.deteccionForm.longitud == null) {
            this.errores.push("Debe indicar en el mapa la ubicación de la detección.");
            return;
        }
        // Se valida que se hayan cargado evidencias asociadas a la detección.
        if (!this.validarEvidencias()) {
            return;
        }
        // Se valida que se hayan cargado infracciones asociadas a la detección.
        var infraccionesSelected = this.validarInfracciones(this.infracciones);
        if (infraccionesSelected.length == 0) {
            this.errores.push("Debe seleccionar al menos una infracción para la detección.");
            return;
        }
        this.isLoading = true;
        var deteccionString = this.generarDeteccionString(this.deteccionForm, this.evidencias, infraccionesSelected);
        this.deteccionService.insert(deteccionString).then(function (res) {
            _this.deteccionForm.deteccion = res.deteccion;
            _this.auditar(_this.deteccionForm, _this.evidencias, infraccionesSelected);
            _this.isLoading = false;
            _this.notificationService.success("Operación exitosa", "La detección fue cargada correctamente.");
            _this.resetFormulario();
        }, function (error) {
            // Código de respuesta de Laravel cuando falla la validación
            if (error.status === 422) {
                var errores = error.json();
                for (var key in errores) {
                    _this.errores.push(errores[key]);
                }
            }
            else {
                _this.errores.push("Ha ocurrido un error al cargar la detección.");
            }
            _this.isLoading = false;
        });
    };
    CargaIndividualComponent.prototype.validarEvidencias = function () {
        this.evidencias = [];
        var items = this.uploader.queue;
        for (var item in items) {
            if (items[item].file.type == 'image/jpeg') {
                items[item].file.tipo_archivo = 1;
                items[item].file.extension = 'jpg';
            }
            else if (items[item].file.type == 'image/png') {
                items[item].file.tipo_archivo = 1;
                items[item].file.extension = 'png';
            }
            else if (items[item].file.type == 'video/mp4') {
                items[item].file.tipo_archivo = 2;
                items[item].file.extension = 'mp4';
            }
            else if (items[item].file.type == 'video/avi') {
                items[item].file.tipo_archivo = 2;
                items[item].file.extension = 'avi';
            }
            else {
                this.errores.push("Solo se aceptan archivos de tipo imagen (JPG/PNG) o video (MP4/AVI).");
                return false;
            }
            this.evidencias.push({
                nombre_archivo: items[item].file.name,
                tamano_kb: items[item].file.size / 1024,
                tipo_archivo: items[item].file.tipo_archivo,
                extension: items[item].file.extension,
                array_bytes: this.evidArrayBytes[item]
            });
        }
        if (this.evidencias.length == 0) {
            this.errores.push("Debe cargar al menos una evidencia para la detección.");
            return false;
        }
        return true;
    };
    CargaIndividualComponent.prototype.validarInfracciones = function (infracciones) {
        var infraccionesSelected = [];
        for (var i in infracciones) {
            if (infracciones[i]['tiene_infraccion']) {
                infraccionesSelected.push({
                    infraccion: infracciones[i]['infraccion'],
                    codigo: infracciones[i]['codigo'],
                    observacion: infracciones[i]['observacion']
                });
            }
        }
        return infraccionesSelected;
    };
    CargaIndividualComponent.prototype.generarDeteccionString = function (deteccion, evidencias, infracciones) {
        return '&fecha=' + (deteccion.fecha != null ? deteccion.fecha : '') +
            '&hora=' + (deteccion.hora != null ? deteccion.hora : '') +
            '&fuente=' + (deteccion.fuente != null ? deteccion.fuente : '') +
            '&referencia_disp=' + (deteccion.referencia_disp != null ? deteccion.referencia_disp : '') +
            '&latitud=' + (deteccion.latitud != null ? deteccion.latitud : '') +
            '&longitud=' + (deteccion.longitud != null ? deteccion.longitud : '') +
            '&direccion=' + (deteccion.direccion != null ? deteccion.direccion : '') +
            '&complemento_direccion=' + (deteccion.complemento_direccion != null ? deteccion.complemento_direccion : '') +
            '&placa=' + (deteccion.placa != null ? deteccion.placa : '') +
            '&tipo_vehiculo=' + (deteccion.tipo_vehiculo != null ? deteccion.tipo_vehiculo : '') +
            '&color=' + (deteccion.color != null ? deteccion.color : '') +
            '&servicio=' + (deteccion.servicio != null ? deteccion.servicio : '') +
            '&nivel=' + (deteccion.nivel != null ? deteccion.nivel : '') +
            '&carril=' + (deteccion.carril != null ? deteccion.carril : '') +
            '&sentido=' + (deteccion.sentido != null ? deteccion.sentido : '') +
            '&velocidad=' + (deteccion.velocidad != null ? deteccion.velocidad : '') +
            '&unidad_velocidad=' + (deteccion.unidad_velocidad != null ? deteccion.unidad_velocidad : '') +
            '&observaciones=' + (deteccion.observaciones != null ? deteccion.observaciones : '') +
            '&modo_carga=' + 1 +
            '&usuario=' + this.userLogin.usuario +
            '&evidencias=' + JSON.stringify(evidencias).replace(/"/g, '\\"') +
            '&infracciones=' + JSON.stringify(infracciones).replace(/"/g, '\\"');
    };
    CargaIndividualComponent.prototype.auditar = function (deteccion, evidencias, infracciones) {
        try {
            var deteccionAudit = this.generarDeteccionAudit(deteccion, evidencias, infracciones);
            this.auditoriaService.insert(this.opcion.opcion, this.accionAudit, deteccionAudit);
            return true;
        }
        catch (error) {
            return false;
        }
    };
    CargaIndividualComponent.prototype.generarDeteccionAudit = function (deteccion, evidencias, infracciones) {
        var array_evidencias = [];
        for (var i in evidencias) {
            array_evidencias.push({
                'nombre_archivo': evidencias[i]['nombre_archivo'],
                'tamano_kb': evidencias[i]['tamano_kb'],
                'tipo_archivo': evidencias[i]['tipo_archivo']
            });
        }
        var deteccionAudit = {
            deteccion: deteccion.deteccion,
            fecha: deteccion.fecha,
            hora: deteccion.hora,
            fuente: deteccion.fuente,
            referencia_disp: deteccion.referencia_disp,
            latitud: deteccion.latitud,
            longitud: deteccion.longitud,
            direccion: deteccion.direccion,
            complemento_direccion: deteccion.complemento_direccion,
            placa: deteccion.placa,
            tipo_vehiculo: deteccion.tipo_vehiculo,
            color: deteccion.color,
            servicio: deteccion.servicio,
            nivel: deteccion.nivel,
            carril: deteccion.carril,
            sentido: deteccion.sentido,
            velocidad: deteccion.velocidad,
            unidad_velocidad: deteccion.unidad_velocidad,
            observaciones: deteccion.observaciones,
            modo_carga: 1,
            usuario: this.userLogin.usuario,
            evidencias: JSON.stringify(array_evidencias).replace(/"/g, '\\"'),
            infracciones: JSON.stringify(infracciones).replace(/"/g, '\\"')
        };
        return JSON.stringify(deteccionAudit);
    };
    CargaIndividualComponent.prototype.resetEvidencias = function () {
        this.evidencias = [];
        this.evidArrayBytes = [];
        this.uploader.clearQueue();
        jQuery('#input-evidencia-add').val(null);
    };
    CargaIndividualComponent.prototype.resetErrores = function () {
        this.errores = [];
    };
    CargaIndividualComponent.prototype.resetFormulario = function () {
        this.deteccionForm = JSON.parse('{' +
            ' "fecha" : "",' +
            ' "hora" : "",' +
            ' "fuente" : null,' +
            ' "referencia_disp" : "",' +
            ' "latitud" : null,' +
            ' "longitud" : null,' +
            ' "direccion" : "",' +
            ' "complemento_direccion" : "",' +
            ' "placa" : "",' +
            ' "tipo_vehiculo" : null,' +
            ' "color" : "",' +
            ' "servicio" : null,' +
            ' "nivel" : null,' +
            ' "carril" : "",' +
            ' "sentido" : null,' +
            ' "velocidad" : null,' +
            ' "unidad_velocidad" : null,' +
            ' "observaciones" : ""' +
            '}');
        jQuery('#fecha').val("");
        this.getInfracciones();
        this.resetEvidencias();
        this.resetErrores();
    };
    CargaIndividualComponent.prototype.loading = function () {
        return this.isLoading;
    };
    CargaIndividualComponent.prototype.mapClicked = function ($event) {
        this.deteccionForm.latitud = $event.coords.lat;
        this.deteccionForm.longitud = $event.coords.lng;
    };
    CargaIndividualComponent.prototype.markerDragEnd = function ($event) {
        this.deteccionForm.latitud = $event.coords.lat;
        this.deteccionForm.longitud = $event.coords.lng;
    };
    CargaIndividualComponent = __decorate([
        core_1.Component({
            selector: 'carga-individual-view',
            templateUrl: './app/components/src/pruebas/carga-individual/carga-individual-view.html',
            bindings: [AuthService_1.AuthService, DeteccionService_1.DeteccionService, FuenteService_1.FuenteService, InfraccionService_1.InfraccionService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService],
            directives: [
                components_2.SimpleNotificationsComponent,
                core_2.GOOGLE_MAPS_DIRECTIVES,
                ng2_file_upload_1.FILE_UPLOAD_DIRECTIVES
            ]
        }),
        router_deprecated_1.CanActivate(function (next, previous) {
            return IsLoggedIn_1.IsLoggedIn(next, previous);
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.Router, AuthService_1.AuthService, DeteccionService_1.DeteccionService, FuenteService_1.FuenteService, InfraccionService_1.InfraccionService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService])
    ], CargaIndividualComponent);
    return CargaIndividualComponent;
}());
exports.CargaIndividualComponent = CargaIndividualComponent;
//# sourceMappingURL=CargaIndividualComponent.js.map
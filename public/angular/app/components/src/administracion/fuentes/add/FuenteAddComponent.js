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
var FuenteService_1 = require("../../../../../services/FuenteService");
var PersonaService_1 = require("../../../../../services/PersonaService");
var ParametroService_1 = require("../../../../../services/ParametroService");
var AuditoriaService_1 = require("../../../../../services/AuditoriaService");
var components_1 = require('angular2-notifications/components');
var components_2 = require('angular2-notifications/components');
var core_2 = require('angular2-google-maps/core');
var FuenteAddComponent = (function () {
    function FuenteAddComponent(fuenteService, personaService, parametroService, auditoriaService, notificationService) {
        this.fuenteService = fuenteService;
        this.personaService = personaService;
        this.parametroService = parametroService;
        this.auditoriaService = auditoriaService;
        this.notificationService = notificationService;
        this.isLoading = false;
        this.accionAudit = 2; // Adicionar
        this.gpTipoDocumento = 1;
        this.gpTipoFuente = 12;
        this.errores = [];
        this.documentos = [];
        this.tiposFuentes = [];
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
    }
    FuenteAddComponent.prototype.ngOnInit = function () {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
        this.resetFormulario();
        this.agregarEventos();
        this.cargarCombos();
    };
    FuenteAddComponent.prototype.agregarEventos = function () {
        jQuery('#add-fuente').on('shown.bs.modal', function () {
            jQuery('#btn-reset-add').click();
            jQuery('#btn-load-mapa-add').click();
        });
        jQuery('#add-persona').on('hide.bs.modal', function () {
            jQuery('#btn-load-persona').click();
        });
    };
    FuenteAddComponent.prototype.cargarCombos = function () {
        var _this = this;
        this.parametroService.getByGrupo(this.gpTipoDocumento).then(function (documentos) { _this.documentos = documentos; });
        this.parametroService.getByGrupo(this.gpTipoFuente).then(function (tiposFuentes) { _this.tiposFuentes = tiposFuentes; });
    };
    FuenteAddComponent.prototype.cargarPersona = function () {
        var _this = this;
        this.personaService.getByDocumento(this.fuenteForm.prov_tipo_doc, this.fuenteForm.prov_numero_doc)
            .then(function (persona) {
            if (persona != null) {
                _this.fuenteForm.proveedor = persona.persona;
                _this.fuenteForm.prov_nombre = persona.nombres_apellidos;
            }
        });
    };
    FuenteAddComponent.prototype.getPersonaByDocumento = function () {
        var _this = this;
        this.errores = [];
        if (this.fuenteForm.prov_tipo_doc == null)
            return;
        if (this.fuenteForm.prov_numero_doc == "")
            return;
        if (isNaN(Number(this.fuenteForm.prov_numero_doc))) {
            this.errores.push("El número de documento debe ser numérico.");
            return;
        }
        this.personaService.getByDocumento(this.fuenteForm.prov_tipo_doc, this.fuenteForm.prov_numero_doc)
            .then(function (persona) {
            _this.personaForm.tipo_doc = _this.fuenteForm.prov_tipo_doc;
            _this.personaForm.numero_doc = _this.fuenteForm.prov_numero_doc;
            if (persona != null) {
                _this.fuenteForm.proveedor = persona.persona;
                _this.fuenteForm.prov_nombre = persona.nombres_apellidos;
            }
            else {
                _this.fuenteForm.proveedor = null;
                _this.fuenteForm.prov_nombre = "";
                localStorage.setItem('input-persona', JSON.stringify(_this.personaForm));
                jQuery('#add-persona').modal({ backdrop: 'static' });
            }
        });
    };
    FuenteAddComponent.prototype.insertar = function () {
        var _this = this;
        this.isLoading = true;
        this.resetErrores();
        var fuenteString = this.generarFuenteString(this.fuenteForm);
        this.fuenteService.insert(fuenteString).then(function (res) {
            _this.auditar(res.fuente);
            _this.isLoading = false;
            _this.notificationService.success("Operación exitosa", "La fuente de evidencias fue creada correctamente.");
            _this.resetFormulario();
            _this.cerrarVentana();
        }, function (error) {
            // Código de respuesta de Laravel cuando falla la validación
            if (error.status === 422) {
                var errores = error.json();
                for (var key in errores) {
                    _this.errores.push(errores[key]);
                }
            }
            else {
                _this.errores.push("Ha ocurrido un error al crear la fuente de evidencias.");
            }
            _this.isLoading = false;
        });
    };
    FuenteAddComponent.prototype.generarFuenteString = function (fuente) {
        return '&tipo=' + (fuente.tipo != null ? fuente.tipo : '') +
            '&nombre=' + (fuente.nombre != null ? fuente.nombre : '') +
            '&proveedor=' + (fuente.proveedor != null ? fuente.proveedor : '') +
            '&desde=' + (fuente.desde != null ? fuente.desde : '') +
            '&hasta=' + (fuente.hasta != null ? fuente.hasta : '') +
            '&latitud=' + (fuente.latitud != null ? fuente.latitud : '') +
            '&longitud=' + (fuente.longitud != null ? fuente.longitud : '') +
            '&referencia_ubicacion=' + (fuente.referencia_ubicacion != null ? fuente.referencia_ubicacion : '') +
            '&observaciones=' + (fuente.observaciones != null ? fuente.observaciones : '') +
            '&ws=' + (fuente.ws ? 1 : 0) +
            '&ftp=' + (fuente.ftp ? 1 : 0) +
            '&usuario=' + this.userLogin.usuario;
    };
    FuenteAddComponent.prototype.auditar = function (fuente) {
        try {
            var fuenteAudit = this.generarFuenteAudit(fuente);
            this.auditoriaService.insert(this.opcion.opcion, this.accionAudit, fuenteAudit);
            return true;
        }
        catch (error) {
            return false;
        }
    };
    FuenteAddComponent.prototype.generarFuenteAudit = function (fuente) {
        var fuenteAudit = {
            fuente: fuente['fuente'],
            tipo: fuente['tipo'],
            nombre: fuente['nombre'],
            proveedor: fuente['proveedor'],
            desde: fuente['desde'],
            hasta: fuente['hasta'],
            latitud: fuente['latitud'],
            longitud: fuente['longitud'],
            referencia_ubicacion: fuente['referencia_ubicacion'],
            observaciones: fuente['observaciones'],
            ws: fuente['ws'],
            ftp: fuente['ftp'],
            usuario: fuente['usuario'],
            fecha_registra: fuente['fecha_registra']
        };
        return JSON.stringify(fuenteAudit);
    };
    FuenteAddComponent.prototype.resetErrores = function () {
        this.errores = [];
    };
    FuenteAddComponent.prototype.resetFormulario = function () {
        this.fuenteForm = JSON.parse('{' +
            ' "tipo" : null,' +
            ' "nombre" : "",' +
            ' "proveedor" : null,' +
            ' "prov_tipo_doc" : null,' +
            ' "prov_numero_doc" : "",' +
            ' "prov_nombre" : "",' +
            ' "desde" : "",' +
            ' "hasta" : "",' +
            ' "latitud" : null,' +
            ' "longitud" : null,' +
            ' "referencia_ubicacion" : "",' +
            ' "observaciones" : "",' +
            ' "ws" : null,' +
            ' "ftp" : null' +
            '}');
        jQuery('#desde, #hasta').val("");
        this.personaForm = JSON.parse('{' +
            ' "tipo_doc" : null,' +
            ' "numero_doc" : ""' +
            '}');
        this.resetErrores();
    };
    FuenteAddComponent.prototype.cerrarVentana = function () {
        jQuery('#add-fuente').modal('hide');
    };
    FuenteAddComponent.prototype.close = function () {
        this.resetErrores();
        this.resetFormulario();
        this.cerrarVentana();
    };
    FuenteAddComponent.prototype.loading = function () {
        return this.isLoading;
    };
    FuenteAddComponent.prototype.mapClicked = function ($event) {
        this.fuenteForm.latitud = $event.coords.lat;
        this.fuenteForm.longitud = $event.coords.lng;
    };
    FuenteAddComponent.prototype.markerDragEnd = function ($event) {
        this.fuenteForm.latitud = $event.coords.lat;
        this.fuenteForm.longitud = $event.coords.lng;
    };
    FuenteAddComponent = __decorate([
        core_1.Component({
            selector: 'fuente-add',
            templateUrl: './app/components/src/administracion/fuentes/add/fuente-add.html',
            bindings: [FuenteService_1.FuenteService, PersonaService_1.PersonaService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService],
            directives: [
                components_2.SimpleNotificationsComponent,
                core_2.GOOGLE_MAPS_DIRECTIVES
            ]
        }), 
        __metadata('design:paramtypes', [FuenteService_1.FuenteService, PersonaService_1.PersonaService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService])
    ], FuenteAddComponent);
    return FuenteAddComponent;
}());
exports.FuenteAddComponent = FuenteAddComponent;
//# sourceMappingURL=FuenteAddComponent.js.map
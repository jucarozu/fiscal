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
var FuenteEditComponent = (function () {
    function FuenteEditComponent(fuenteService, personaService, parametroService, auditoriaService, notificationService) {
        this.fuenteService = fuenteService;
        this.personaService = personaService;
        this.parametroService = parametroService;
        this.auditoriaService = auditoriaService;
        this.notificationService = notificationService;
        this.isLoading = false;
        this.accionAudit = 3; // Editar
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
    FuenteEditComponent.prototype.ngOnInit = function () {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
        this.agregarEventos();
        this.cargarCombos();
        this.fuenteForm.latitud = 0.0;
        this.fuenteForm.longitud = 0.0;
    };
    FuenteEditComponent.prototype.agregarEventos = function () {
        jQuery('#edit-fuente').on('shown.bs.modal', function () {
            jQuery('#btn-reset-edit').click();
            jQuery('#btn-load-mapa-edit').click();
        });
    };
    FuenteEditComponent.prototype.cargarCombos = function () {
        var _this = this;
        this.parametroService.getByGrupo(this.gpTipoDocumento).then(function (documentos) { _this.documentos = documentos; });
        this.parametroService.getByGrupo(this.gpTipoFuente).then(function (tiposFuentes) { _this.tiposFuentes = tiposFuentes; });
    };
    FuenteEditComponent.prototype.actualizar = function () {
        var _this = this;
        this.isLoading = true;
        this.resetErrores();
        var fuenteString = this.generarFuenteString(this.fuenteForm);
        this.fuenteService.update(fuenteString, this.fuenteForm.fuente).then(function (res) {
            _this.auditar(res.fuente);
            _this.isLoading = false;
            _this.notificationService.success("Operación exitosa", "La fuente de evidencias fue modificada correctamente.");
            _this.cerrarVentana();
        }, function (error) {
            _this.isLoading = false;
            // Código de respuesta de Laravel cuando falla la validación
            if (error.status === 422) {
                var errores = error.json();
                for (var key in errores) {
                    _this.errores.push(errores[key]);
                }
            }
            else {
                _this.errores.push("Ha ocurrido un error al modificar la fuente de evidencias.");
            }
        });
    };
    FuenteEditComponent.prototype.generarFuenteString = function (fuente) {
        return '&fuente=' + (fuente.fuente != null ? fuente.fuente : '') +
            '&desde=' + (fuente.desde != null ? fuente.desde : '') +
            '&hasta=' + (fuente.hasta != null ? fuente.hasta : '') +
            '&latitud=' + (fuente.latitud != null ? fuente.latitud : '') +
            '&longitud=' + (fuente.longitud != null ? fuente.longitud : '') +
            '&referencia_ubicacion=' + (fuente.referencia_ubicacion != null ? fuente.referencia_ubicacion : '') +
            '&observaciones=' + (fuente.observaciones != null ? fuente.observaciones : '') +
            '&ws=' + (fuente.ws ? 1 : 0) +
            '&ftp=' + (fuente.ftp ? 1 : 0);
    };
    FuenteEditComponent.prototype.auditar = function (fuente) {
        try {
            var fuenteAudit = this.generarFuenteAudit(fuente);
            this.auditoriaService.insert(this.opcion.opcion, this.accionAudit, fuenteAudit);
            return true;
        }
        catch (error) {
            return false;
        }
    };
    FuenteEditComponent.prototype.generarFuenteAudit = function (fuente) {
        var fuenteAudit = {
            fuente: fuente['fuente'],
            desde: fuente['desde'],
            hasta: fuente['hasta'],
            latitud: fuente['latitud'],
            longitud: fuente['longitud'],
            referencia_ubicacion: fuente['referencia_ubicacion'],
            observaciones: fuente['observaciones'],
            ws: fuente['ws'],
            ftp: fuente['ftp']
        };
        return JSON.stringify(fuenteAudit);
    };
    FuenteEditComponent.prototype.resetFormulario = function () {
        var _this = this;
        this.fuenteService.getById(this.fuenteForm.fuente).then(function (fuente) {
            _this.fuenteForm = fuente;
            if (_this.fuenteForm.latitud != null && _this.fuenteForm.longitud != null) {
                _this.fuenteForm.latitud = parseFloat(_this.fuenteForm.latitud);
                _this.fuenteForm.longitud = parseFloat(_this.fuenteForm.longitud);
            }
        });
    };
    FuenteEditComponent.prototype.resetErrores = function () {
        this.errores = [];
    };
    FuenteEditComponent.prototype.cerrarVentana = function () {
        jQuery('#edit-fuente').modal('hide');
    };
    FuenteEditComponent.prototype.close = function () {
        this.resetErrores();
        this.cerrarVentana();
    };
    FuenteEditComponent.prototype.loading = function () {
        return this.isLoading;
    };
    FuenteEditComponent.prototype.mapClicked = function ($event) {
        this.fuenteForm.latitud = $event.coords.lat;
        this.fuenteForm.longitud = $event.coords.lng;
    };
    FuenteEditComponent.prototype.markerDragEnd = function ($event) {
        this.fuenteForm.latitud = $event.coords.lat;
        this.fuenteForm.longitud = $event.coords.lng;
    };
    __decorate([
        core_1.Input('fuente'), 
        __metadata('design:type', Object)
    ], FuenteEditComponent.prototype, "fuenteForm", void 0);
    FuenteEditComponent = __decorate([
        core_1.Component({
            selector: 'fuente-edit',
            templateUrl: './app/components/src/administracion/fuentes/edit/fuente-edit.html',
            bindings: [FuenteService_1.FuenteService, PersonaService_1.PersonaService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService],
            directives: [
                components_2.SimpleNotificationsComponent,
                core_2.GOOGLE_MAPS_DIRECTIVES
            ]
        }), 
        __metadata('design:paramtypes', [FuenteService_1.FuenteService, PersonaService_1.PersonaService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService])
    ], FuenteEditComponent);
    return FuenteEditComponent;
}());
exports.FuenteEditComponent = FuenteEditComponent;
//# sourceMappingURL=FuenteEditComponent.js.map
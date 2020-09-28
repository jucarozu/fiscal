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
var NotifAvisoService_1 = require("../../../../../services/NotifAvisoService");
var NotificacionService_1 = require("../../../../../services/NotificacionService");
var NotifSeguimientoService_1 = require("../../../../../services/NotifSeguimientoService");
var ResponsableService_1 = require("../../../../../services/ResponsableService");
var AuditoriaService_1 = require("../../../../../services/AuditoriaService");
var components_1 = require('angular2-notifications/components');
var components_2 = require('angular2-notifications/components');
var EnviosFijarComponent = (function () {
    function EnviosFijarComponent(router, notifAvisoService, notificacionService, notifSeguimientoService, responsableService, auditoriaService, notificationService) {
        this.router = router;
        this.notifAvisoService = notifAvisoService;
        this.notificacionService = notificacionService;
        this.notifSeguimientoService = notifSeguimientoService;
        this.responsableService = responsableService;
        this.auditoriaService = auditoriaService;
        this.notificationService = notificationService;
        this.isLoading = false;
        this.accionAudit = 5; // Ejecutar
        this.funcionarios = [];
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
    }
    EnviosFijarComponent.prototype.ngOnInit = function () {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
        this.resetFormulario();
        this.cargarCombos();
    };
    EnviosFijarComponent.prototype.cargarCombos = function () {
        var _this = this;
        this.responsableService.get().then(function (funcionarios) { _this.funcionarios = funcionarios; });
    };
    EnviosFijarComponent.prototype.insertar = function () {
        var _this = this;
        this.isLoading = true;
        // Datos de notificación fijada.
        this.notifAvisoForm.notificacion = this.notificacionForm.notificacion;
        this.notifAvisoForm.usuario = this.userLogin.usuario;
        var notifAvisoString = this.generarNotifAvisoString(this.notifAvisoForm);
        this.notifAvisoService.insert(notifAvisoString).then(function (res) {
            // Datos de notificación.
            _this.notificacionForm.estado = 6; // Estado: Fijada
            var notificacionString = _this.generarNotificacionString(_this.notificacionForm);
            _this.notificacionService.update(notificacionString, _this.notificacionForm.notificacion).then(function (res) {
                // Datos de seguimiento de notificación.
                _this.notifSeguimientoForm.notificacion = _this.notificacionForm.notificacion;
                _this.notifSeguimientoForm.estado = 6; // Estado: Fijada
                _this.notifSeguimientoForm.usuario = _this.userLogin.usuario;
                _this.notifSeguimientoForm.observaciones = _this.notifAvisoForm.observaciones_fija;
                var notifSeguimientoString = _this.generarNotifSeguimientoString(_this.notifSeguimientoForm);
                _this.notifSeguimientoService.insert(notifSeguimientoString).then(function (res) {
                    _this.auditar(_this.notifAvisoForm);
                    _this.isLoading = false;
                    _this.notificationService.success("Operación exitosa", "La notificación ha sido marcada como Fijada.");
                    _this.close();
                }, function (error) {
                    _this.notificationService.error("Error", JSON.parse(error._body).mensaje);
                    _this.isLoading = false;
                });
            }, function (error) {
                _this.notificationService.error("Error", JSON.parse(error._body).mensaje);
                _this.isLoading = false;
            });
        }, function (error) {
            _this.notificationService.error("Error", JSON.parse(error._body).mensaje);
            _this.isLoading = false;
        });
    };
    EnviosFijarComponent.prototype.generarNotifAvisoString = function (notifAviso) {
        return '&notificacion=' + (notifAviso.notificacion != null ? notifAviso.notificacion : '') +
            '&fecha_fija=' + (notifAviso.fecha_fija != null ? notifAviso.fecha_fija : '') +
            '&funcionario_fija=' + (notifAviso.funcionario_fija != null ? notifAviso.funcionario_fija : '') +
            '&observaciones_fija=' + (notifAviso.observaciones_fija != null ? notifAviso.observaciones_fija : '') +
            '&usuario_fija=' + this.userLogin.usuario;
    };
    EnviosFijarComponent.prototype.generarNotificacionString = function (notificacion) {
        return '&notificacion=' + (notificacion.notificacion != null ? notificacion.notificacion : '') +
            '&estado=' + (notificacion.estado != null ? notificacion.estado : '') +
            '&fecha_hasta=' + (notificacion.notif_fecha_hasta != null ? notificacion.notif_fecha_hasta : '') +
            '&usuario=' + this.userLogin.usuario;
    };
    EnviosFijarComponent.prototype.generarNotifSeguimientoString = function (notifSeguimiento) {
        return '&notificacion=' + (notifSeguimiento.notificacion != null ? notifSeguimiento.notificacion : '') +
            '&estado=' + (notifSeguimiento.estado != null ? notifSeguimiento.estado : '') +
            '&usuario=' + this.userLogin.usuario +
            '&observaciones=' + (notifSeguimiento.observaciones != null ? notifSeguimiento.observaciones : '');
    };
    EnviosFijarComponent.prototype.auditar = function (notifAviso) {
        try {
            var notifAvisoAudit = this.generarNotifAvisoAudit(notifAviso);
            this.auditoriaService.insert(this.opcion.opcion, this.accionAudit, notifAvisoAudit);
            return true;
        }
        catch (error) {
            return false;
        }
    };
    EnviosFijarComponent.prototype.generarNotifAvisoAudit = function (notifAviso) {
        var notifAvisoAudit = {
            notificacion: notifAviso.notificacion,
            fecha_fija: notifAviso.fecha_fija,
            funcionario_fija: notifAviso.funcionario_fija,
            observaciones_fija: notifAviso.observaciones_fija,
            usuario_fija: this.userLogin.usuario
        };
        return JSON.stringify(notifAvisoAudit);
    };
    EnviosFijarComponent.prototype.resetFormulario = function () {
        this.notifAvisoForm = {
            aviso: null,
            notificacion: null,
            fecha_fija: "",
            funcionario_fija: null,
            observaciones_fija: "",
            fecha_desfija: "",
            funcionario_desfija: null,
            observaciones_desfija: "",
            fecha_registra: "",
            usuario: null,
            usuario_desc: ""
        };
        this.notifSeguimientoForm = {
            seguimiento: null,
            notificacion: null,
            fecha: "",
            estado: null,
            estado_desc: "",
            usuario: null,
            usuario_desc: "",
            observaciones: "",
        };
        this.resetErrores();
    };
    EnviosFijarComponent.prototype.resetErrores = function () {
        this.errores = [];
    };
    EnviosFijarComponent.prototype.cerrarVentana = function () {
        jQuery('#fijar-envios').modal('hide');
    };
    EnviosFijarComponent.prototype.close = function () {
        this.resetFormulario();
        this.cerrarVentana();
    };
    EnviosFijarComponent.prototype.loading = function () {
        return this.isLoading;
    };
    __decorate([
        core_1.Input('notificacion'), 
        __metadata('design:type', Object)
    ], EnviosFijarComponent.prototype, "notificacionForm", void 0);
    EnviosFijarComponent = __decorate([
        core_1.Component({
            selector: 'envios-fijar',
            templateUrl: './app/components/src/comparendos/envios/fijar/envios-fijar.html',
            bindings: [NotifAvisoService_1.NotifAvisoService, NotificacionService_1.NotificacionService, NotifSeguimientoService_1.NotifSeguimientoService, ResponsableService_1.ResponsableService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService],
            directives: [
                components_2.SimpleNotificationsComponent
            ]
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.Router, NotifAvisoService_1.NotifAvisoService, NotificacionService_1.NotificacionService, NotifSeguimientoService_1.NotifSeguimientoService, ResponsableService_1.ResponsableService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService])
    ], EnviosFijarComponent);
    return EnviosFijarComponent;
}());
exports.EnviosFijarComponent = EnviosFijarComponent;
//# sourceMappingURL=EnviosFijarComponent.js.map
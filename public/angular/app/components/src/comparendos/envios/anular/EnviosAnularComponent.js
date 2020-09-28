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
var NotificacionService_1 = require("../../../../../services/NotificacionService");
var NotifSeguimientoService_1 = require("../../../../../services/NotifSeguimientoService");
var AuditoriaService_1 = require("../../../../../services/AuditoriaService");
var components_1 = require('angular2-notifications/components');
var components_2 = require('angular2-notifications/components');
var EnviosAnularComponent = (function () {
    function EnviosAnularComponent(router, notificacionService, notifSeguimientoService, auditoriaService, notificationService) {
        this.router = router;
        this.notificacionService = notificacionService;
        this.notifSeguimientoService = notifSeguimientoService;
        this.auditoriaService = auditoriaService;
        this.notificationService = notificationService;
        this.isLoading = false;
        this.accionAudit = 4; // Eliminar
        this.poner_cola = false; // Poner en cola
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
    EnviosAnularComponent.prototype.ngOnInit = function () {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
        this.resetFormulario();
    };
    EnviosAnularComponent.prototype.anular = function () {
        var _this = this;
        this.isLoading = true;
        // Datos de notificación.
        this.notificacionForm.estado = 10; // Estado: Anulada
        var notificacionString = this.generarNotificacionString(this.notificacionForm);
        this.notificacionService.update(notificacionString, this.notificacionForm.notificacion).then(function (res) {
            // Datos de seguimiento de notificación.
            _this.notifSeguimientoForm.notificacion = _this.notificacionForm.notificacion;
            _this.notifSeguimientoForm.estado = 10; // Estado: Anulada
            _this.notifSeguimientoForm.usuario = _this.userLogin.usuario;
            var notifSeguimientoString = _this.generarNotifSeguimientoString(_this.notifSeguimientoForm);
            _this.notifSeguimientoService.insert(notifSeguimientoString).then(function (res) {
                _this.auditar(_this.notifSeguimientoForm);
                _this.isLoading = false;
                _this.notificationService.success("Operación exitosa", "La notificación ha sido marcada como Anulada.");
                if (_this.poner_cola) {
                    jQuery('#cola-envios').modal({ backdrop: 'static', keyboard: false });
                }
                _this.close();
            }, function (error) {
                _this.notificationService.error("Error", JSON.parse(error._body).mensaje);
                _this.isLoading = false;
            });
        }, function (error) {
            _this.notificationService.error("Error", JSON.parse(error._body).mensaje);
            _this.isLoading = false;
        });
    };
    EnviosAnularComponent.prototype.generarNotificacionString = function (notificacion) {
        return '&notificacion=' + (notificacion.notificacion != null ? notificacion.notificacion : '') +
            '&estado=' + (notificacion.estado != null ? notificacion.estado : '') +
            '&fecha_hasta=' + (notificacion.notif_fecha_hasta != null ? notificacion.notif_fecha_hasta : '') +
            '&usuario=' + this.userLogin.usuario;
    };
    EnviosAnularComponent.prototype.generarNotifSeguimientoString = function (notifSeguimiento) {
        return '&notificacion=' + (notifSeguimiento.notificacion != null ? notifSeguimiento.notificacion : '') +
            '&estado=' + (notifSeguimiento.estado != null ? notifSeguimiento.estado : '') +
            '&usuario=' + this.userLogin.usuario +
            '&observaciones=' + (notifSeguimiento.observaciones != null ? notifSeguimiento.observaciones : '');
    };
    EnviosAnularComponent.prototype.auditar = function (notifSeguimiento) {
        try {
            var notifSeguimientoAudit = this.generarNotifSeguimientoAudit(notifSeguimiento);
            this.auditoriaService.insert(this.opcion.opcion, this.accionAudit, notifSeguimientoAudit);
            return true;
        }
        catch (error) {
            return false;
        }
    };
    EnviosAnularComponent.prototype.generarNotifSeguimientoAudit = function (notifSeguimiento) {
        var notifSeguimientoAudit = {
            notificacion: notifSeguimiento.notificacion,
            estado: notifSeguimiento.estado,
            observaciones: notifSeguimiento.observaciones
        };
        return JSON.stringify(notifSeguimientoAudit);
    };
    EnviosAnularComponent.prototype.resetFormulario = function () {
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
    EnviosAnularComponent.prototype.resetErrores = function () {
        this.errores = [];
    };
    EnviosAnularComponent.prototype.cerrarVentana = function () {
        jQuery('#anular-envios').modal('hide');
    };
    EnviosAnularComponent.prototype.close = function () {
        this.resetFormulario();
        this.cerrarVentana();
    };
    EnviosAnularComponent.prototype.loading = function () {
        return this.isLoading;
    };
    __decorate([
        core_1.Input('notificacion'), 
        __metadata('design:type', Object)
    ], EnviosAnularComponent.prototype, "notificacionForm", void 0);
    EnviosAnularComponent = __decorate([
        core_1.Component({
            selector: 'envios-anular',
            templateUrl: './app/components/src/comparendos/envios/anular/envios-anular.html',
            bindings: [NotificacionService_1.NotificacionService, NotifSeguimientoService_1.NotifSeguimientoService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService],
            directives: [
                components_2.SimpleNotificationsComponent
            ]
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.Router, NotificacionService_1.NotificacionService, NotifSeguimientoService_1.NotifSeguimientoService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService])
    ], EnviosAnularComponent);
    return EnviosAnularComponent;
}());
exports.EnviosAnularComponent = EnviosAnularComponent;
//# sourceMappingURL=EnviosAnularComponent.js.map
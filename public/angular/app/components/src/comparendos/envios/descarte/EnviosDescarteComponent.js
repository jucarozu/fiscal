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
var NotifDescarteService_1 = require("../../../../../services/NotifDescarteService");
var NotificacionService_1 = require("../../../../../services/NotificacionService");
var NotifSeguimientoService_1 = require("../../../../../services/NotifSeguimientoService");
var EmpresaMensajeriaService_1 = require("../../../../../services/EmpresaMensajeriaService");
var ParametroService_1 = require("../../../../../services/ParametroService");
var AuditoriaService_1 = require("../../../../../services/AuditoriaService");
var components_1 = require('angular2-notifications/components');
var components_2 = require('angular2-notifications/components');
var EnviosDescarteComponent = (function () {
    function EnviosDescarteComponent(router, notifDescarteService, notificacionService, notifSeguimientoService, empresaMensajeriaService, parametroService, auditoriaService, notificationService) {
        this.router = router;
        this.notifDescarteService = notifDescarteService;
        this.notificacionService = notificacionService;
        this.notifSeguimientoService = notifSeguimientoService;
        this.empresaMensajeriaService = empresaMensajeriaService;
        this.parametroService = parametroService;
        this.auditoriaService = auditoriaService;
        this.notificationService = notificationService;
        this.isLoading = false;
        this.accionAudit = 5; // Ejecutar
        this.gpCausalDescarte = 43;
        this.causales = [];
        this.empresasMensajeria = [];
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
    EnviosDescarteComponent.prototype.ngOnInit = function () {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
        this.cargarCombos();
        this.resetFormulario();
    };
    EnviosDescarteComponent.prototype.cargarCombos = function () {
        var _this = this;
        this.parametroService.getByGrupo(this.gpCausalDescarte).then(function (causales) { _this.causales = causales; });
        this.empresaMensajeriaService.get().then(function (empresasMensajeria) { _this.empresasMensajeria = empresasMensajeria; });
    };
    EnviosDescarteComponent.prototype.insertar = function () {
        var _this = this;
        this.isLoading = true;
        // Datos de notificación descartada.
        this.notifDescarteForm.notificacion = this.notificacionForm.notificacion;
        this.notifDescarteForm.usuario = this.userLogin.usuario;
        var notifDescarteString = this.generarNotifDescarteString(this.notifDescarteForm);
        this.notifDescarteService.insert(notifDescarteString).then(function (res) {
            // Datos de notificación.
            _this.notificacionForm.estado = 5; // Estado: Descartada
            _this.notificacionForm.notif_fecha_hasta = _this.notifDescarteForm.fecha_descarte;
            _this.notificacionForm.notif_motivo_rechazo = _this.notifDescarteForm.causal_descarte;
            var notificacionString = _this.generarNotificacionString(_this.notificacionForm);
            _this.notificacionService.update(notificacionString, _this.notificacionForm.notificacion).then(function (res) {
                // Datos de seguimiento de notificación.
                _this.notifSeguimientoForm.notificacion = _this.notificacionForm.notificacion;
                _this.notifSeguimientoForm.estado = 5; // Estado: Descartada
                _this.notifSeguimientoForm.usuario = _this.userLogin.usuario;
                _this.notifSeguimientoForm.observaciones = _this.notifDescarteForm.observaciones;
                var notifSeguimientoString = _this.generarNotifSeguimientoString(_this.notifSeguimientoForm);
                _this.notifSeguimientoService.insert(notifSeguimientoString).then(function (res) {
                    _this.auditar(_this.notifDescarteForm);
                    _this.isLoading = false;
                    _this.notificationService.success("Operación exitosa", "La notificación ha sido marcada como Descartada.");
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
    EnviosDescarteComponent.prototype.generarNotifDescarteString = function (notifDescarte) {
        return '&notificacion=' + (notifDescarte.notificacion != null ? notifDescarte.notificacion : '') +
            '&empresa_mensajeria=' + (notifDescarte.empresa_mensajeria != null ? notifDescarte.empresa_mensajeria : '') +
            '&fecha_descarte=' + (notifDescarte.fecha_descarte != null ? notifDescarte.fecha_descarte : '') +
            '&causal_descarte=' + (notifDescarte.causal_descarte != null ? notifDescarte.causal_descarte : '') +
            '&observaciones=' + (notifDescarte.observaciones != null ? notifDescarte.observaciones : '') +
            '&usuario=' + this.userLogin.usuario;
    };
    EnviosDescarteComponent.prototype.generarNotificacionString = function (notificacion) {
        return '&notificacion=' + (notificacion.notificacion != null ? notificacion.notificacion : '') +
            '&estado=' + (notificacion.estado != null ? notificacion.estado : '') +
            '&fecha_hasta=' + (notificacion.notif_fecha_hasta != null ? notificacion.notif_fecha_hasta : '') +
            '&motivo_rechazo=' + (notificacion.notif_motivo_rechazo != null ? notificacion.notif_motivo_rechazo : '') +
            '&usuario=' + this.userLogin.usuario;
    };
    EnviosDescarteComponent.prototype.generarNotifSeguimientoString = function (notifSeguimiento) {
        return '&notificacion=' + (notifSeguimiento.notificacion != null ? notifSeguimiento.notificacion : '') +
            '&estado=' + (notifSeguimiento.estado != null ? notifSeguimiento.estado : '') +
            '&usuario=' + this.userLogin.usuario +
            '&observaciones=' + (notifSeguimiento.observaciones != null ? notifSeguimiento.observaciones : '');
    };
    EnviosDescarteComponent.prototype.auditar = function (notifDescarte) {
        try {
            var notifDescarteAudit = this.generarNotifDescarteAudit(notifDescarte);
            this.auditoriaService.insert(this.opcion.opcion, this.accionAudit, notifDescarteAudit);
            return true;
        }
        catch (error) {
            return false;
        }
    };
    EnviosDescarteComponent.prototype.generarNotifDescarteAudit = function (notifDescarte) {
        var notifDescarteAudit = {
            notificacion: notifDescarte.notificacion,
            empresa_mensajeria: notifDescarte.empresa_mensajeria,
            fecha_descarte: notifDescarte.fecha_descarte,
            causal_descarte: notifDescarte.causal_descarte,
            observaciones: notifDescarte.observaciones,
            usuario: this.userLogin.usuario
        };
        return JSON.stringify(notifDescarteAudit);
    };
    EnviosDescarteComponent.prototype.resetFormulario = function () {
        this.notifDescarteForm = {
            descarte: null,
            notificacion: null,
            empresa_mensajeria: null,
            fecha_descarte: "",
            causal_descarte: null,
            observaciones: "",
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
    EnviosDescarteComponent.prototype.resetErrores = function () {
        this.errores = [];
    };
    EnviosDescarteComponent.prototype.cerrarVentana = function () {
        jQuery('#descarte-envios').modal('hide');
    };
    EnviosDescarteComponent.prototype.close = function () {
        this.resetFormulario();
        this.cerrarVentana();
    };
    EnviosDescarteComponent.prototype.loading = function () {
        return this.isLoading;
    };
    __decorate([
        core_1.Input('notificacion'), 
        __metadata('design:type', Object)
    ], EnviosDescarteComponent.prototype, "notificacionForm", void 0);
    EnviosDescarteComponent = __decorate([
        core_1.Component({
            selector: 'envios-descarte',
            templateUrl: './app/components/src/comparendos/envios/descarte/envios-descarte.html',
            bindings: [NotifDescarteService_1.NotifDescarteService, NotificacionService_1.NotificacionService, NotifSeguimientoService_1.NotifSeguimientoService, EmpresaMensajeriaService_1.EmpresaMensajeriaService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService],
            directives: [
                components_2.SimpleNotificationsComponent
            ]
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.Router, NotifDescarteService_1.NotifDescarteService, NotificacionService_1.NotificacionService, NotifSeguimientoService_1.NotifSeguimientoService, EmpresaMensajeriaService_1.EmpresaMensajeriaService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService])
    ], EnviosDescarteComponent);
    return EnviosDescarteComponent;
}());
exports.EnviosDescarteComponent = EnviosDescarteComponent;
//# sourceMappingURL=EnviosDescarteComponent.js.map
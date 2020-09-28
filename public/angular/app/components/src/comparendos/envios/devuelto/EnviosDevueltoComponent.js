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
var NotifDevueltaService_1 = require("../../../../../services/NotifDevueltaService");
var NotificacionService_1 = require("../../../../../services/NotificacionService");
var NotifSeguimientoService_1 = require("../../../../../services/NotifSeguimientoService");
var EmpresaMensajeriaService_1 = require("../../../../../services/EmpresaMensajeriaService");
var ParametroService_1 = require("../../../../../services/ParametroService");
var AuditoriaService_1 = require("../../../../../services/AuditoriaService");
var components_1 = require('angular2-notifications/components');
var components_2 = require('angular2-notifications/components');
var EnviosDevueltoComponent = (function () {
    function EnviosDevueltoComponent(router, notifDevueltaService, notificacionService, notifSeguimientoService, empresaMensajeriaService, parametroService, auditoriaService, notificationService) {
        this.router = router;
        this.notifDevueltaService = notifDevueltaService;
        this.notificacionService = notificacionService;
        this.notifSeguimientoService = notifSeguimientoService;
        this.empresaMensajeriaService = empresaMensajeriaService;
        this.parametroService = parametroService;
        this.auditoriaService = auditoriaService;
        this.notificationService = notificationService;
        this.isLoading = false;
        this.accionAudit = 5; // Ejecutar
        this.gpCausalDevolucion = 43;
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
    EnviosDevueltoComponent.prototype.ngOnInit = function () {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
        this.cargarCombos();
        this.resetFormulario();
    };
    EnviosDevueltoComponent.prototype.cargarCombos = function () {
        var _this = this;
        this.parametroService.getByGrupo(this.gpCausalDevolucion).then(function (causales) { _this.causales = causales; });
        this.empresaMensajeriaService.get().then(function (empresasMensajeria) { _this.empresasMensajeria = empresasMensajeria; });
    };
    EnviosDevueltoComponent.prototype.insertar = function () {
        var _this = this;
        this.isLoading = true;
        // Datos de notificación entregada.
        this.notifDevueltaForm.notificacion = this.notificacionForm.notificacion;
        this.notifDevueltaForm.usuario = this.userLogin.usuario;
        var notifDevueltaString = this.generarNotifDevueltaString(this.notifDevueltaForm);
        this.notifDevueltaService.insert(notifDevueltaString).then(function (res) {
            // Datos de notificación.
            _this.notificacionForm.estado = 4; // Estado: Devuelta
            _this.notificacionForm.notif_fecha_hasta = _this.notifDevueltaForm.fecha_novedad;
            _this.notificacionForm.notif_motivo_rechazo = _this.notifDevueltaForm.causal_devolucion;
            var notificacionString = _this.generarNotificacionString(_this.notificacionForm);
            _this.notificacionService.update(notificacionString, _this.notificacionForm.notificacion).then(function (res) {
                // Datos de seguimiento de notificación.
                _this.notifSeguimientoForm.notificacion = _this.notificacionForm.notificacion;
                _this.notifSeguimientoForm.estado = 4; // Estado: Devuelta
                _this.notifSeguimientoForm.usuario = _this.userLogin.usuario;
                _this.notifSeguimientoForm.observaciones = _this.notifDevueltaForm.observaciones;
                var notifSeguimientoString = _this.generarNotifSeguimientoString(_this.notifSeguimientoForm);
                _this.notifSeguimientoService.insert(notifSeguimientoString).then(function (res) {
                    _this.auditar(_this.notifDevueltaForm);
                    _this.isLoading = false;
                    _this.notificationService.success("Operación exitosa", "La notificación ha sido marcada como Devuelta.");
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
    EnviosDevueltoComponent.prototype.generarNotifDevueltaString = function (notifDevuelta) {
        return '&notificacion=' + (notifDevuelta.notificacion != null ? notifDevuelta.notificacion : '') +
            '&empresa_mensajeria=' + (notifDevuelta.empresa_mensajeria != null ? notifDevuelta.empresa_mensajeria : '') +
            '&numero_guia=' + (notifDevuelta.numero_guia != null ? notifDevuelta.numero_guia : '') +
            '&fecha_novedad=' + (notifDevuelta.fecha_novedad != null ? notifDevuelta.fecha_novedad : '') +
            '&causal_devolucion=' + (notifDevuelta.causal_devolucion != null ? notifDevuelta.causal_devolucion : '') +
            '&observaciones=' + (notifDevuelta.observaciones != null ? notifDevuelta.observaciones : '') +
            '&usuario=' + this.userLogin.usuario;
    };
    EnviosDevueltoComponent.prototype.generarNotificacionString = function (notificacion) {
        return '&notificacion=' + (notificacion.notificacion != null ? notificacion.notificacion : '') +
            '&estado=' + (notificacion.estado != null ? notificacion.estado : '') +
            '&fecha_hasta=' + (notificacion.notif_fecha_hasta != null ? notificacion.notif_fecha_hasta : '') +
            '&motivo_rechazo=' + (notificacion.notif_motivo_rechazo != null ? notificacion.notif_motivo_rechazo : '') +
            '&usuario=' + this.userLogin.usuario;
    };
    EnviosDevueltoComponent.prototype.generarNotifSeguimientoString = function (notifSeguimiento) {
        return '&notificacion=' + (notifSeguimiento.notificacion != null ? notifSeguimiento.notificacion : '') +
            '&estado=' + (notifSeguimiento.estado != null ? notifSeguimiento.estado : '') +
            '&usuario=' + this.userLogin.usuario +
            '&observaciones=' + (notifSeguimiento.observaciones != null ? notifSeguimiento.observaciones : '');
    };
    EnviosDevueltoComponent.prototype.auditar = function (notifDevuelta) {
        try {
            var notifDevueltaAudit = this.generarNotifDevueltaAudit(notifDevuelta);
            this.auditoriaService.insert(this.opcion.opcion, this.accionAudit, notifDevueltaAudit);
            return true;
        }
        catch (error) {
            return false;
        }
    };
    EnviosDevueltoComponent.prototype.generarNotifDevueltaAudit = function (notifDevuelta) {
        var notifDevueltaAudit = {
            notificacion: notifDevuelta.notificacion,
            empresa_mensajeria: notifDevuelta.empresa_mensajeria,
            numero_guia: notifDevuelta.numero_guia,
            fecha_novedad: notifDevuelta.fecha_novedad,
            causal_devolucion: notifDevuelta.causal_devolucion,
            observaciones: notifDevuelta.observaciones,
            usuario: this.userLogin.usuario
        };
        return JSON.stringify(notifDevueltaAudit);
    };
    EnviosDevueltoComponent.prototype.resetFormulario = function () {
        this.notifDevueltaForm = {
            devuelta: null,
            notificacion: null,
            empresa_mensajeria: null,
            numero_guia: "",
            fecha_novedad: "",
            causal_devolucion: null,
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
    EnviosDevueltoComponent.prototype.resetErrores = function () {
        this.errores = [];
    };
    EnviosDevueltoComponent.prototype.cerrarVentana = function () {
        jQuery('#devuelto-envios').modal('hide');
    };
    EnviosDevueltoComponent.prototype.close = function () {
        this.resetFormulario();
        this.cerrarVentana();
    };
    EnviosDevueltoComponent.prototype.loading = function () {
        return this.isLoading;
    };
    __decorate([
        core_1.Input('notificacion'), 
        __metadata('design:type', Object)
    ], EnviosDevueltoComponent.prototype, "notificacionForm", void 0);
    EnviosDevueltoComponent = __decorate([
        core_1.Component({
            selector: 'envios-devuelto',
            templateUrl: './app/components/src/comparendos/envios/devuelto/envios-devuelto.html',
            bindings: [NotifDevueltaService_1.NotifDevueltaService, NotificacionService_1.NotificacionService, NotifSeguimientoService_1.NotifSeguimientoService, EmpresaMensajeriaService_1.EmpresaMensajeriaService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService],
            directives: [
                components_2.SimpleNotificationsComponent
            ]
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.Router, NotifDevueltaService_1.NotifDevueltaService, NotificacionService_1.NotificacionService, NotifSeguimientoService_1.NotifSeguimientoService, EmpresaMensajeriaService_1.EmpresaMensajeriaService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService])
    ], EnviosDevueltoComponent);
    return EnviosDevueltoComponent;
}());
exports.EnviosDevueltoComponent = EnviosDevueltoComponent;
//# sourceMappingURL=EnviosDevueltoComponent.js.map
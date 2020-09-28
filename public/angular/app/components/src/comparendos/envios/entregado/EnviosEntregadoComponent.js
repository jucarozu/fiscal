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
var NotifEntregadaService_1 = require("../../../../../services/NotifEntregadaService");
var NotificacionService_1 = require("../../../../../services/NotificacionService");
var NotifSeguimientoService_1 = require("../../../../../services/NotifSeguimientoService");
var EmpresaMensajeriaService_1 = require("../../../../../services/EmpresaMensajeriaService");
var ParametroService_1 = require("../../../../../services/ParametroService");
var AuditoriaService_1 = require("../../../../../services/AuditoriaService");
var components_1 = require('angular2-notifications/components');
var components_2 = require('angular2-notifications/components');
var EnviosEntregadoComponent = (function () {
    function EnviosEntregadoComponent(router, notifEntregadaService, notificacionService, notifSeguimientoService, empresaMensajeriaService, parametroService, auditoriaService, notificationService) {
        this.router = router;
        this.notifEntregadaService = notifEntregadaService;
        this.notificacionService = notificacionService;
        this.notifSeguimientoService = notifSeguimientoService;
        this.empresaMensajeriaService = empresaMensajeriaService;
        this.parametroService = parametroService;
        this.auditoriaService = auditoriaService;
        this.notificationService = notificationService;
        this.isLoading = false;
        this.accionAudit = 5; // Ejecutar
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
    EnviosEntregadoComponent.prototype.ngOnInit = function () {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
        this.cargarCombos();
        this.resetFormulario();
    };
    EnviosEntregadoComponent.prototype.cargarCombos = function () {
        var _this = this;
        this.empresaMensajeriaService.get().then(function (empresasMensajeria) { _this.empresasMensajeria = empresasMensajeria; });
    };
    EnviosEntregadoComponent.prototype.insertar = function () {
        var _this = this;
        this.isLoading = true;
        // Datos de notificación entregada.
        this.notifEntregadaForm.notificacion = this.notificacionForm.notificacion;
        this.notifEntregadaForm.usuario = this.userLogin.usuario;
        var notifEntregadaString = this.generarNotifEntregadaString(this.notifEntregadaForm);
        this.notifEntregadaService.insert(notifEntregadaString).then(function (res) {
            // Datos de notificación.
            _this.notificacionForm.estado = 3; // Estado: Entregada
            _this.notificacionForm.notif_fecha_hasta = _this.notifEntregadaForm.fecha_entrega;
            var notificacionString = _this.generarNotificacionString(_this.notificacionForm);
            _this.notificacionService.update(notificacionString, _this.notificacionForm.notificacion).then(function (res) {
                // Datos de seguimiento de notificación.
                _this.notifSeguimientoForm.notificacion = _this.notificacionForm.notificacion;
                _this.notifSeguimientoForm.estado = 3; // Estado: Entregada
                _this.notifSeguimientoForm.usuario = _this.userLogin.usuario;
                _this.notifSeguimientoForm.observaciones = _this.notifEntregadaForm.observaciones;
                var notifSeguimientoString = _this.generarNotifSeguimientoString(_this.notifSeguimientoForm);
                _this.notifSeguimientoService.insert(notifSeguimientoString).then(function (res) {
                    _this.auditar(_this.notifEntregadaForm);
                    _this.isLoading = false;
                    _this.notificationService.success("Operación exitosa", "La notificación ha sido marcada como Entregada.");
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
    EnviosEntregadoComponent.prototype.generarNotifEntregadaString = function (notifEntregada) {
        return '&notificacion=' + (notifEntregada.notificacion != null ? notifEntregada.notificacion : '') +
            '&empresa_mensajeria=' + (notifEntregada.empresa_mensajeria != null ? notifEntregada.empresa_mensajeria : '') +
            '&numero_guia=' + (notifEntregada.numero_guia != null ? notifEntregada.numero_guia : '') +
            '&fecha_entrega=' + (notifEntregada.fecha_entrega != null ? notifEntregada.fecha_entrega : '') +
            '&nombre_recibe=' + (notifEntregada.nombre_recibe != null ? notifEntregada.nombre_recibe : '') +
            '&observaciones=' + (notifEntregada.observaciones != null ? notifEntregada.observaciones : '') +
            '&usuario=' + this.userLogin.usuario;
    };
    EnviosEntregadoComponent.prototype.generarNotificacionString = function (notificacion) {
        return '&notificacion=' + (notificacion.notificacion != null ? notificacion.notificacion : '') +
            '&fecha_hasta=' + (notificacion.notif_fecha_hasta != null ? notificacion.notif_fecha_hasta : '') +
            '&estado=' + (notificacion.estado != null ? notificacion.estado : '') +
            '&usuario=' + this.userLogin.usuario;
    };
    EnviosEntregadoComponent.prototype.generarNotifSeguimientoString = function (notifSeguimiento) {
        return '&notificacion=' + (notifSeguimiento.notificacion != null ? notifSeguimiento.notificacion : '') +
            '&estado=' + (notifSeguimiento.estado != null ? notifSeguimiento.estado : '') +
            '&usuario=' + this.userLogin.usuario +
            '&observaciones=' + (notifSeguimiento.observaciones != null ? notifSeguimiento.observaciones : '');
    };
    EnviosEntregadoComponent.prototype.auditar = function (notifEntregada) {
        try {
            var notifEntregadaAudit = this.generarNotifEntregadaAudit(notifEntregada);
            this.auditoriaService.insert(this.opcion.opcion, this.accionAudit, notifEntregadaAudit);
            return true;
        }
        catch (error) {
            return false;
        }
    };
    EnviosEntregadoComponent.prototype.generarNotifEntregadaAudit = function (notifEntregada) {
        var notifEntregadaAudit = {
            notificacion: notifEntregada.notificacion,
            empresa_mensajeria: notifEntregada.empresa_mensajeria,
            numero_guia: notifEntregada.numero_guia,
            fecha_entrega: notifEntregada.fecha_entrega,
            nombre_recibe: notifEntregada.nombre_recibe,
            observaciones: notifEntregada.observaciones,
            usuario: this.userLogin.usuario
        };
        return JSON.stringify(notifEntregadaAudit);
    };
    EnviosEntregadoComponent.prototype.resetFormulario = function () {
        this.notifEntregadaForm = {
            entregada: null,
            notificacion: null,
            empresa_mensajeria: null,
            numero_guia: "",
            fecha_entrega: "",
            nombre_recibe: "",
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
            observaciones: ""
        };
        this.resetErrores();
    };
    EnviosEntregadoComponent.prototype.resetErrores = function () {
        this.errores = [];
    };
    EnviosEntregadoComponent.prototype.cerrarVentana = function () {
        jQuery('#entregado-envios').modal('hide');
    };
    EnviosEntregadoComponent.prototype.close = function () {
        this.resetFormulario();
        this.cerrarVentana();
    };
    EnviosEntregadoComponent.prototype.loading = function () {
        return this.isLoading;
    };
    __decorate([
        core_1.Input('notificacion'), 
        __metadata('design:type', Object)
    ], EnviosEntregadoComponent.prototype, "notificacionForm", void 0);
    EnviosEntregadoComponent = __decorate([
        core_1.Component({
            selector: 'envios-entregado',
            templateUrl: './app/components/src/comparendos/envios/entregado/envios-entregado.html',
            bindings: [NotifEntregadaService_1.NotifEntregadaService, NotificacionService_1.NotificacionService, NotifSeguimientoService_1.NotifSeguimientoService, EmpresaMensajeriaService_1.EmpresaMensajeriaService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService],
            directives: [
                components_2.SimpleNotificationsComponent
            ]
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.Router, NotifEntregadaService_1.NotifEntregadaService, NotificacionService_1.NotificacionService, NotifSeguimientoService_1.NotifSeguimientoService, EmpresaMensajeriaService_1.EmpresaMensajeriaService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService])
    ], EnviosEntregadoComponent);
    return EnviosEntregadoComponent;
}());
exports.EnviosEntregadoComponent = EnviosEntregadoComponent;
//# sourceMappingURL=EnviosEntregadoComponent.js.map
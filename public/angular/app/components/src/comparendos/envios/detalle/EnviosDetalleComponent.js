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
var NotifSeguimientoService_1 = require("../../../../../services/NotifSeguimientoService");
var NotifEntregadaService_1 = require("../../../../../services/NotifEntregadaService");
var NotifDevueltaService_1 = require("../../../../../services/NotifDevueltaService");
var NotifDescarteService_1 = require("../../../../../services/NotifDescarteService");
var NotifColaService_1 = require("../../../../../services/NotifColaService");
var AuditoriaService_1 = require("../../../../../services/AuditoriaService");
var components_1 = require('angular2-notifications/components');
var components_2 = require('angular2-notifications/components');
var primeng_1 = require('primeng/primeng');
var EnviosDetalleComponent = (function () {
    function EnviosDetalleComponent(router, notifSeguimientoService, notifEntregadaService, notifDevueltaService, notifDescarteService, notifColaService, auditoriaService, notificationService) {
        this.router = router;
        this.notifSeguimientoService = notifSeguimientoService;
        this.notifEntregadaService = notifEntregadaService;
        this.notifDevueltaService = notifDevueltaService;
        this.notifDescarteService = notifDescarteService;
        this.notifColaService = notifColaService;
        this.auditoriaService = auditoriaService;
        this.notificationService = notificationService;
        this.isLoading = false;
        this.accionAudit = 1; // Consultar
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
    EnviosDetalleComponent.prototype.ngOnInit = function () {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
        this.agregarEventos();
        this.auditoriaService.insert(this.opcion.opcion, this.accionAudit);
    };
    EnviosDetalleComponent.prototype.agregarEventos = function () {
        jQuery('#detalle-envios').on('show.bs.modal', function () {
            jQuery('#btn-get-detalles').click();
        });
    };
    EnviosDetalleComponent.prototype.getNotifDetalles = function () {
        if (this.notificacionForm.notif_estado == 3)
            this.getNotifEntregadas();
        if (this.notificacionForm.notif_estado == 4)
            this.getNotifDevueltas();
        if (this.notificacionForm.notif_estado == 5)
            this.getNotifDescartadas();
        /*if (this.notificacionForm.notif_estado == 8)
            this.getNotifColas();*/
        this.getNotifSeguimientos();
    };
    EnviosDetalleComponent.prototype.getNotifEntregadas = function () {
        var _this = this;
        this.isLoading = true;
        this.notifEntregadaService.getByFilters(this.notificacionForm.notificacion).then(function (notifEntregadas) {
            _this.notifEntregadas = notifEntregadas;
            _this.isLoading = false;
        });
    };
    EnviosDetalleComponent.prototype.getNotifDevueltas = function () {
        var _this = this;
        this.isLoading = true;
        this.notifDevueltaService.getByFilters(this.notificacionForm.notificacion).then(function (notifDevueltas) {
            _this.notifDevueltas = notifDevueltas;
            _this.isLoading = false;
        });
    };
    EnviosDetalleComponent.prototype.getNotifDescartadas = function () {
        var _this = this;
        this.isLoading = true;
        this.notifDescarteService.getByFilters(this.notificacionForm.notificacion).then(function (notifDescartadas) {
            _this.notifDescartadas = notifDescartadas;
            _this.isLoading = false;
        });
    };
    /*private getNotifColas()
    {
        this.isLoading = true;

        this.notifColaService.getByFilters(this.notificacionForm.notificacion).then(notifColas =>
            {
                this.notifColas = notifColas;
                this.isLoading = false;
            }
        );
    }*/
    EnviosDetalleComponent.prototype.getNotifSeguimientos = function () {
        var _this = this;
        this.isLoading = true;
        this.notifSeguimientoService.getByFilters(this.notificacionForm.notificacion).then(function (notifSeguimientos) {
            _this.notifSeguimientos = notifSeguimientos;
            _this.isLoading = false;
        });
    };
    EnviosDetalleComponent.prototype.resetFormulario = function () {
        this.notifEntregadas = null;
        this.notifDevueltas = null;
        this.notifDescartadas = null;
        this.notifSeguimientos = null;
    };
    EnviosDetalleComponent.prototype.cerrarVentana = function () {
        jQuery('#detalle-envios').modal('hide');
    };
    EnviosDetalleComponent.prototype.close = function () {
        this.resetFormulario();
        this.cerrarVentana();
    };
    EnviosDetalleComponent.prototype.loading = function () {
        return this.isLoading;
    };
    __decorate([
        core_1.Input('notificacion'), 
        __metadata('design:type', Object)
    ], EnviosDetalleComponent.prototype, "notificacionForm", void 0);
    EnviosDetalleComponent = __decorate([
        core_1.Component({
            selector: 'envios-detalle',
            templateUrl: './app/components/src/comparendos/envios/detalle/envios-detalle.html',
            bindings: [NotifSeguimientoService_1.NotifSeguimientoService, NotifEntregadaService_1.NotifEntregadaService, NotifDevueltaService_1.NotifDevueltaService, NotifDescarteService_1.NotifDescarteService, NotifColaService_1.NotifColaService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService],
            directives: [
                primeng_1.DataTable, primeng_1.Column,
                components_2.SimpleNotificationsComponent
            ]
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.Router, NotifSeguimientoService_1.NotifSeguimientoService, NotifEntregadaService_1.NotifEntregadaService, NotifDevueltaService_1.NotifDevueltaService, NotifDescarteService_1.NotifDescarteService, NotifColaService_1.NotifColaService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService])
    ], EnviosDetalleComponent);
    return EnviosDetalleComponent;
}());
exports.EnviosDetalleComponent = EnviosDetalleComponent;
//# sourceMappingURL=EnviosDetalleComponent.js.map
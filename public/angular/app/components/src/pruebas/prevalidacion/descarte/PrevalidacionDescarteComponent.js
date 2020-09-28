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
var PrevalidacionService_1 = require("../../../../../services/PrevalidacionService");
var ParametroService_1 = require("../../../../../services/ParametroService");
var AuditoriaService_1 = require("../../../../../services/AuditoriaService");
var components_1 = require('angular2-notifications/components');
var components_2 = require('angular2-notifications/components');
var PrevalidacionDescarteComponent = (function () {
    function PrevalidacionDescarteComponent(router, prevalidacionService, parametroService, auditoriaService, notificationService) {
        this.router = router;
        this.prevalidacionService = prevalidacionService;
        this.parametroService = parametroService;
        this.auditoriaService = auditoriaService;
        this.notificationService = notificationService;
        this.isLoading = false;
        this.accionAudit = 4; // Eliminar
        this.gpMotivo = 24;
        this.errores = [];
        this.motivos = [];
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
    PrevalidacionDescarteComponent.prototype.ngOnInit = function () {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
        this.resetFormulario();
        this.cargarCombos();
    };
    PrevalidacionDescarteComponent.prototype.cargarCombos = function () {
        var _this = this;
        this.parametroService.getByGrupo(this.gpMotivo).then(function (motivos) { _this.motivos = motivos; });
    };
    PrevalidacionDescarteComponent.prototype.descartar = function () {
        var _this = this;
        this.isLoading = true;
        // Datos de detección.
        this.deteccionForm.estado = 4; // Estado: Descartada en prevalidación
        // Datos de seguimiento de detección.
        this.deteccionSeguimientoForm.deteccion = this.deteccionForm.deteccion;
        this.deteccionSeguimientoForm.usuario = this.userLogin.usuario;
        this.deteccionSeguimientoForm.estado = 1; // Estado: Descartada
        // Datos de descarte de detección.
        this.deteccionDescarteForm.deteccion = this.deteccionForm.deteccion;
        this.deteccionDescarteForm.tipo_descarte = 1;
        this.deteccionDescarteForm.usuario = this.userLogin.usuario;
        this.deteccionDescarteForm.observacion = this.deteccionSeguimientoForm.observaciones;
        this.deteccionDescarteForm.estado = 1; // Estado: Descartada
        var prevalidacionString = this.generarPrevalidacionString(this.deteccionForm, this.deteccionSeguimientoForm, this.deteccionDescarteForm);
        this.prevalidacionService.descartar(prevalidacionString).then(function (res) {
            _this.auditar(_this.deteccionDescarteForm);
            _this.isLoading = false;
            _this.notificationService.success("Operación exitosa", "La detección ha sido descartada correctamente.");
            _this.cerrarVentana();
            _this.router.navigate(['PruebasPrevalidacionView']);
        }, function (error) {
            _this.notificationService.error("Error", JSON.parse(error._body).mensaje);
            _this.isLoading = false;
        });
    };
    PrevalidacionDescarteComponent.prototype.generarPrevalidacionString = function (deteccion, deteccionSeguimiento, deteccionDescarte) {
        var json_prevalidacion = {};
        json_prevalidacion = {
            deteccion: deteccion.deteccion,
            estado: deteccion.estado,
            seguimiento: this.generarDeteccionSeguimientoJSON(deteccionSeguimiento),
            descarte: this.generarDeteccionDescarteJSON(deteccion, deteccionDescarte)
        };
        return '&prevalidacion=' + JSON.stringify(json_prevalidacion).replace(/"/g, '\\"');
    };
    PrevalidacionDescarteComponent.prototype.generarDeteccionSeguimientoJSON = function (deteccionSeguimiento) {
        var json_seguimiento = {};
        json_seguimiento = {
            usuario: deteccionSeguimiento.usuario,
            estado: deteccionSeguimiento.estado,
            observaciones: deteccionSeguimiento.observaciones
        };
        return json_seguimiento;
    };
    PrevalidacionDescarteComponent.prototype.generarDeteccionDescarteJSON = function (deteccion, deteccionDescarte) {
        var json_descarte = {};
        json_descarte = {
            tipo_descarte: deteccionDescarte.tipo_descarte,
            motivo: deteccionDescarte.motivo,
            usuario: deteccionDescarte.usuario,
            estado: deteccionDescarte.estado,
            observacion: deteccionDescarte.observacion
        };
        return json_descarte;
    };
    PrevalidacionDescarteComponent.prototype.auditar = function (deteccionDescarte) {
        try {
            var deteccionDescarteAudit = this.generarDeteccionDescarteAudit(deteccionDescarte);
            this.auditoriaService.insert(this.opcion.opcion, this.accionAudit, deteccionDescarteAudit);
            return true;
        }
        catch (error) {
            return false;
        }
    };
    PrevalidacionDescarteComponent.prototype.generarDeteccionDescarteAudit = function (deteccionDescarte) {
        var deteccionDescarteAudit = {
            deteccion: deteccionDescarte.deteccion,
            tipo_descarte: deteccionDescarte.tipo_descarte,
            motivo: deteccionDescarte.motivo,
            usuario: deteccionDescarte.usuario,
            estado: deteccionDescarte.estado,
            observacion: deteccionDescarte.observacion
        };
        return JSON.stringify(deteccionDescarteAudit);
    };
    PrevalidacionDescarteComponent.prototype.resetFormulario = function () {
        this.deteccionDescarteForm = {
            descarte: null,
            deteccion: null,
            tipo_descarte: null,
            fecha: null,
            motivo: null,
            usuario: null,
            estado: null,
            observacion: null,
            fecha_aprueba: null,
            usuario_aprueba: null
        };
        this.resetErrores();
    };
    PrevalidacionDescarteComponent.prototype.resetErrores = function () {
        this.errores = [];
    };
    PrevalidacionDescarteComponent.prototype.cerrarVentana = function () {
        jQuery('#descarte-prevalidacion').modal('hide');
    };
    PrevalidacionDescarteComponent.prototype.close = function () {
        this.resetErrores();
        this.resetFormulario();
        this.cerrarVentana();
    };
    PrevalidacionDescarteComponent.prototype.loading = function () {
        return this.isLoading;
    };
    __decorate([
        core_1.Input('deteccion'), 
        __metadata('design:type', Object)
    ], PrevalidacionDescarteComponent.prototype, "deteccionForm", void 0);
    __decorate([
        core_1.Input('deteccionSeguimiento'), 
        __metadata('design:type', Object)
    ], PrevalidacionDescarteComponent.prototype, "deteccionSeguimientoForm", void 0);
    PrevalidacionDescarteComponent = __decorate([
        core_1.Component({
            selector: 'prevalidacion-descarte',
            templateUrl: './app/components/src/pruebas/prevalidacion/descarte/prevalidacion-descarte.html',
            bindings: [PrevalidacionService_1.PrevalidacionService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService],
            directives: [
                components_2.SimpleNotificationsComponent
            ]
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.Router, PrevalidacionService_1.PrevalidacionService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService])
    ], PrevalidacionDescarteComponent);
    return PrevalidacionDescarteComponent;
}());
exports.PrevalidacionDescarteComponent = PrevalidacionDescarteComponent;
//# sourceMappingURL=PrevalidacionDescarteComponent.js.map
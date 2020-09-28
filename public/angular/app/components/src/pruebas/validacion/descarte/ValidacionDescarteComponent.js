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
var ValidacionService_1 = require("../../../../../services/ValidacionService");
var ParametroService_1 = require("../../../../../services/ParametroService");
var components_1 = require('angular2-notifications/components');
var components_2 = require('angular2-notifications/components');
var ValidacionDescarteComponent = (function () {
    function ValidacionDescarteComponent(router, validacionService, parametroService, notificationService) {
        this.router = router;
        this.validacionService = validacionService;
        this.parametroService = parametroService;
        this.notificationService = notificationService;
        this.isLoading = false;
        this.accionAudit = 2; // Adicionar
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
    ValidacionDescarteComponent.prototype.ngOnInit = function () {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
        this.resetFormulario();
        this.cargarCombos();
    };
    ValidacionDescarteComponent.prototype.cargarCombos = function () {
        var _this = this;
        this.parametroService.getByGrupo(this.gpMotivo).then(function (motivos) { _this.motivos = motivos; });
    };
    ValidacionDescarteComponent.prototype.descartar = function () {
        var _this = this;
        this.isLoading = true;
        // Datos de detección.
        this.deteccionForm.estado = 6; // Estado: Descartada en validación
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
        var validacionString = this.generarValidacionString(this.deteccionForm, this.deteccionSeguimientoForm, this.deteccionDescarteForm);
        this.validacionService.descartar(validacionString).then(function (res) {
            _this.notificationService.success("Operación exitosa", "La detección ha sido descartada correctamente.");
            _this.cerrarVentana();
            _this.router.navigate(['PruebasValidacionView']);
            _this.isLoading = false;
        }, function (error) {
            _this.notificationService.error("Error", JSON.parse(error._body).mensaje);
            _this.isLoading = false;
        });
    };
    ValidacionDescarteComponent.prototype.generarValidacionString = function (deteccion, deteccionSeguimiento, deteccionDescarte) {
        var json_validacion = {};
        json_validacion = {
            deteccion: deteccion.deteccion,
            estado: deteccion.estado,
            seguimiento: this.generarDeteccionSeguimientoJSON(deteccionSeguimiento),
            descarte: this.generarDeteccionDescarteJSON(deteccion, deteccionDescarte),
            detallesDescarte: this.generarDetalleDescarteJSON(deteccion)
        };
        return '&validacion=' + JSON.stringify(json_validacion).replace(/"/g, '\\"');
    };
    ValidacionDescarteComponent.prototype.generarDeteccionSeguimientoJSON = function (deteccionSeguimiento) {
        var json_seguimiento = {};
        json_seguimiento = {
            usuario: deteccionSeguimiento.usuario,
            estado: deteccionSeguimiento.estado,
            observaciones: deteccionSeguimiento.observaciones
        };
        return json_seguimiento;
    };
    ValidacionDescarteComponent.prototype.generarDeteccionDescarteJSON = function (deteccion, deteccionDescarte) {
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
    ValidacionDescarteComponent.prototype.generarDetalleDescarteJSON = function (deteccion) {
        var json_detalles_descarte = [];
        var infraccionesNoValidadas = this.infraccionesNoValidadas;
        for (var i in infraccionesNoValidadas) {
            json_detalles_descarte.push({
                infra_deteccion: infraccionesNoValidadas[i]['infra_deteccion'],
                codigo: infraccionesNoValidadas[i]['codigo'],
                motivo: infraccionesNoValidadas[i]['motivo']
            });
        }
        return json_detalles_descarte;
    };
    ValidacionDescarteComponent.prototype.resetFormulario = function () {
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
    ValidacionDescarteComponent.prototype.resetErrores = function () {
        this.errores = [];
    };
    ValidacionDescarteComponent.prototype.cerrarVentana = function () {
        jQuery('#descarte-validacion').modal('hide');
    };
    ValidacionDescarteComponent.prototype.close = function () {
        this.resetErrores();
        this.resetFormulario();
        this.cerrarVentana();
    };
    ValidacionDescarteComponent.prototype.loading = function () {
        return this.isLoading;
    };
    __decorate([
        core_1.Input('deteccion'), 
        __metadata('design:type', Object)
    ], ValidacionDescarteComponent.prototype, "deteccionForm", void 0);
    __decorate([
        core_1.Input('deteccionSeguimiento'), 
        __metadata('design:type', Object)
    ], ValidacionDescarteComponent.prototype, "deteccionSeguimientoForm", void 0);
    __decorate([
        core_1.Input('infraccionesNoValidadas'), 
        __metadata('design:type', Array)
    ], ValidacionDescarteComponent.prototype, "infraccionesNoValidadas", void 0);
    ValidacionDescarteComponent = __decorate([
        core_1.Component({
            selector: 'validacion-descarte',
            templateUrl: './app/components/src/pruebas/validacion/descarte/validacion-descarte.html',
            bindings: [ValidacionService_1.ValidacionService, ParametroService_1.ParametroService, components_1.NotificationsService],
            directives: [
                components_2.SimpleNotificationsComponent
            ]
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.Router, ValidacionService_1.ValidacionService, ParametroService_1.ParametroService, components_1.NotificationsService])
    ], ValidacionDescarteComponent);
    return ValidacionDescarteComponent;
}());
exports.ValidacionDescarteComponent = ValidacionDescarteComponent;
//# sourceMappingURL=ValidacionDescarteComponent.js.map
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
var AuditoriaService_1 = require("../../../../../services/AuditoriaService");
var components_1 = require('angular2-notifications/components');
var components_2 = require('angular2-notifications/components');
var PrevalidacionConfirmComponent = (function () {
    function PrevalidacionConfirmComponent(router, prevalidacionService, auditoriaService, notificationService) {
        this.router = router;
        this.prevalidacionService = prevalidacionService;
        this.auditoriaService = auditoriaService;
        this.notificationService = notificationService;
        this.isLoading = false;
        this.accionAudit = 2; // Adicionar
        this.errores = [];
    }
    PrevalidacionConfirmComponent.prototype.ngOnInit = function () {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
    };
    PrevalidacionConfirmComponent.prototype.validar = function () {
        var _this = this;
        this.isLoading = true;
        // Datos de detección.
        this.deteccionForm.estado = 3; // Estado: Prevalidada
        // Datos de seguimiento de detección.
        this.deteccionSeguimientoForm.usuario = this.userLogin.usuario;
        this.deteccionSeguimientoForm.estado = 3; // Estado: Prevalidada
        var prevalidacionString = this.generarPrevalidacionString(this.deteccionForm, this.deteccionSeguimientoForm);
        this.prevalidacionService.validar(prevalidacionString).then(function (res) {
            _this.auditar(_this.deteccionForm);
            _this.isLoading = false;
            _this.notificationService.success("Operación exitosa", "La detección ha sido prevalidada correctamente.");
            _this.cerrarVentana();
            _this.router.navigate(['PruebasPrevalidacionView']);
        }, function (error) {
            _this.notificationService.error("Error", JSON.parse(error._body).mensaje);
            _this.isLoading = false;
        });
    };
    PrevalidacionConfirmComponent.prototype.generarPrevalidacionString = function (deteccion, deteccionSeguimiento) {
        var json_prevalidacion = {};
        json_prevalidacion = {
            deteccion: deteccion.deteccion,
            fecha: deteccion.fecha,
            hora: deteccion.hora,
            fuente: deteccion.fuente,
            referencia_disp: deteccion.referencia_disp,
            latitud: deteccion.latitud,
            longitud: deteccion.longitud,
            direccion: deteccion.direccion,
            complemento_direccion: deteccion.complemento_direccion,
            placa: deteccion.placa,
            tipo_vehiculo: deteccion.tipo_vehiculo,
            color: deteccion.color,
            servicio: deteccion.servicio,
            nivel: deteccion.nivel,
            carril: deteccion.carril,
            sentido: deteccion.sentido,
            velocidad: deteccion.velocidad,
            unidad_velocidad: deteccion.unidad_velocidad,
            observaciones: deteccion.observaciones,
            estado: deteccion.estado,
            seguimiento: this.generarDeteccionSeguimientoJSON(deteccionSeguimiento)
        };
        return '&prevalidacion=' + JSON.stringify(json_prevalidacion).replace(/"/g, '\\"');
    };
    PrevalidacionConfirmComponent.prototype.generarDeteccionSeguimientoJSON = function (deteccionSeguimiento) {
        var json_seguimiento = {};
        json_seguimiento = {
            usuario: deteccionSeguimiento.usuario,
            estado: deteccionSeguimiento.estado,
            observaciones: deteccionSeguimiento.observaciones
        };
        return json_seguimiento;
    };
    PrevalidacionConfirmComponent.prototype.auditar = function (deteccion) {
        try {
            var deteccionAudit = this.generarDeteccionAudit(deteccion);
            this.auditoriaService.insert(this.opcion.opcion, this.accionAudit, deteccionAudit);
            return true;
        }
        catch (error) {
            return false;
        }
    };
    PrevalidacionConfirmComponent.prototype.generarDeteccionAudit = function (deteccion) {
        var deteccionAudit = {
            deteccion: deteccion.deteccion,
            fecha: deteccion.fecha,
            hora: deteccion.hora,
            fuente: deteccion.fuente,
            referencia_disp: deteccion.referencia_disp,
            latitud: deteccion.latitud,
            longitud: deteccion.longitud,
            direccion: deteccion.direccion,
            complemento_direccion: deteccion.complemento_direccion,
            placa: deteccion.placa,
            tipo_vehiculo: deteccion.tipo_vehiculo,
            color: deteccion.color,
            servicio: deteccion.servicio,
            nivel: deteccion.nivel,
            carril: deteccion.carril,
            sentido: deteccion.sentido,
            velocidad: deteccion.velocidad,
            unidad_velocidad: deteccion.unidad_velocidad,
            observaciones: deteccion.observaciones,
            estado: deteccion.estado
        };
        return JSON.stringify(deteccionAudit);
    };
    PrevalidacionConfirmComponent.prototype.cerrarVentana = function () {
        jQuery('#confirm-prevalidacion').modal('hide');
    };
    __decorate([
        core_1.Input('deteccion'), 
        __metadata('design:type', Object)
    ], PrevalidacionConfirmComponent.prototype, "deteccionForm", void 0);
    __decorate([
        core_1.Input('deteccionSeguimiento'), 
        __metadata('design:type', Object)
    ], PrevalidacionConfirmComponent.prototype, "deteccionSeguimientoForm", void 0);
    PrevalidacionConfirmComponent = __decorate([
        core_1.Component({
            selector: 'prevalidacion-confirm',
            templateUrl: './app/components/src/pruebas/prevalidacion/confirm/prevalidacion-confirm.html',
            bindings: [PrevalidacionService_1.PrevalidacionService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService],
            directives: [
                components_2.SimpleNotificationsComponent
            ]
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.Router, PrevalidacionService_1.PrevalidacionService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService])
    ], PrevalidacionConfirmComponent);
    return PrevalidacionConfirmComponent;
}());
exports.PrevalidacionConfirmComponent = PrevalidacionConfirmComponent;
//# sourceMappingURL=PrevalidacionConfirmComponent.js.map
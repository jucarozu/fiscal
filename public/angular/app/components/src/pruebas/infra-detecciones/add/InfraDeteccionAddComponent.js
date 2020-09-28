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
var InfraDeteccionService_1 = require("../../../../../services/InfraDeteccionService");
var InfraccionService_1 = require("../../../../../services/InfraccionService");
var components_1 = require('angular2-notifications/components');
var components_2 = require('angular2-notifications/components');
var InfraDeteccionAddComponent = (function () {
    function InfraDeteccionAddComponent(infraDeteccionService, infraccionService, notificationService) {
        this.infraDeteccionService = infraDeteccionService;
        this.infraccionService = infraccionService;
        this.notificationService = notificationService;
        this.isLoading = false;
        this.accionAudit = 2; // Adicionar
        this.errores = [];
        this.infracciones = [];
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
    InfraDeteccionAddComponent.prototype.ngOnInit = function () {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
        this.resetFormulario();
    };
    InfraDeteccionAddComponent.prototype.getInfracciones = function () {
        var _this = this;
        this.isLoading = true;
        this.infraccionService.get().then(function (infracciones) {
            _this.infracciones = [];
            for (var i in infracciones) {
                _this.infracciones.push({
                    infraccion: infracciones[i]['infraccion'],
                    codigo: infracciones[i]['codigo'],
                    nombre_corto: infracciones[i]['nombre_corto'],
                    observacion: infracciones[i]['observacion'],
                });
            }
            _this.isLoading = false;
        });
    };
    InfraDeteccionAddComponent.prototype.insertar = function () {
        var _this = this;
        this.isLoading = true;
        this.resetErrores();
        var infraDeteccionString = this.generarInfraDeteccionString(this.infraDeteccionForm, this.deteccionForm.deteccion);
        this.infraDeteccionService.insert(infraDeteccionString).then(function (res) {
            _this.isLoading = false;
            _this.notificationService.success("Operación exitosa", "La infracción fue asociada a la detección correctamente.");
            _this.resetFormulario();
            _this.cerrarVentana();
            _this.isLoading = false;
        }, function (error) {
            // Código de respuesta de Laravel cuando falla la validación
            if (error.status === 422) {
                _this.errores.push(error.json());
            }
            else {
                _this.errores.push("Ha ocurrido un error al asociar la infracción a la detección.");
            }
            _this.isLoading = false;
        });
    };
    InfraDeteccionAddComponent.prototype.generarInfraDeteccionString = function (infraDeteccion, deteccion) {
        return '&deteccion=' + deteccion +
            '&codigo=' + (infraDeteccion.codigo != null ? infraDeteccion.codigo : '') +
            '&observacion=' + (infraDeteccion.observacion != null ? infraDeteccion.observacion : '');
    };
    InfraDeteccionAddComponent.prototype.resetErrores = function () {
        this.errores = [];
    };
    InfraDeteccionAddComponent.prototype.resetFormulario = function () {
        this.infraDeteccionForm = JSON.parse('{' +
            ' "infraccion" : null,' +
            ' "deteccion" : null,' +
            ' "codigo" : null,' +
            ' "nombre_corto" : "",' +
            ' "observacion" : ""' +
            '}');
        this.getInfracciones();
        this.resetErrores();
    };
    InfraDeteccionAddComponent.prototype.cerrarVentana = function () {
        jQuery('#add-infra-deteccion').modal('hide');
    };
    InfraDeteccionAddComponent.prototype.close = function () {
        this.resetErrores();
        this.resetFormulario();
        this.cerrarVentana();
    };
    InfraDeteccionAddComponent.prototype.loading = function () {
        return this.isLoading;
    };
    __decorate([
        core_1.Input('deteccion'), 
        __metadata('design:type', Object)
    ], InfraDeteccionAddComponent.prototype, "deteccionForm", void 0);
    InfraDeteccionAddComponent = __decorate([
        core_1.Component({
            selector: 'infra-deteccion-add',
            templateUrl: './app/components/src/pruebas/infra-detecciones/add/infra-deteccion-add.html',
            bindings: [InfraDeteccionService_1.InfraDeteccionService, InfraccionService_1.InfraccionService, components_1.NotificationsService],
            directives: [
                components_2.SimpleNotificationsComponent
            ]
        }), 
        __metadata('design:paramtypes', [InfraDeteccionService_1.InfraDeteccionService, InfraccionService_1.InfraccionService, components_1.NotificationsService])
    ], InfraDeteccionAddComponent);
    return InfraDeteccionAddComponent;
}());
exports.InfraDeteccionAddComponent = InfraDeteccionAddComponent;
//# sourceMappingURL=InfraDeteccionAddComponent.js.map
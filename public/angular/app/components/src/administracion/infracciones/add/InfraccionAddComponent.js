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
var InfraccionService_1 = require("../../../../../services/InfraccionService");
var AuditoriaService_1 = require("../../../../../services/AuditoriaService");
var components_1 = require('angular2-notifications/components');
var components_2 = require('angular2-notifications/components');
var InfraccionAddComponent = (function () {
    function InfraccionAddComponent(infraccionService, auditoriaService, notificationService) {
        this.infraccionService = infraccionService;
        this.auditoriaService = auditoriaService;
        this.notificationService = notificationService;
        this.isLoading = false;
        this.accionAudit = 2; // Adicionar
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
    InfraccionAddComponent.prototype.ngOnInit = function () {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
        this.resetFormulario();
    };
    InfraccionAddComponent.prototype.insertar = function () {
        var _this = this;
        this.isLoading = true;
        this.resetErrores();
        var infraccionString = this.generarInfraccionString(this.infraccionForm);
        this.infraccionService.insert(infraccionString).then(function (res) {
            _this.auditar(res.infraccion);
            _this.isLoading = false;
            _this.notificationService.success("Operación exitosa", "La infracción fue creada correctamente.");
            _this.resetFormulario();
            _this.cerrarVentana();
            _this.isLoading = false;
        }, function (error) {
            // Código de respuesta de Laravel cuando falla la validación
            if (error.status === 422) {
                var errores = error.json();
                for (var key in errores) {
                    _this.errores.push(errores[key]);
                }
            }
            else {
                _this.errores.push("Ha ocurrido un error al crear la infracción.");
            }
            _this.isLoading = false;
        });
    };
    InfraccionAddComponent.prototype.generarInfraccionString = function (infraccion) {
        return '&codigo=' + (infraccion.codigo != null ? infraccion.codigo : '') +
            '&nombre_corto=' + (infraccion.nombre_corto != null ? infraccion.nombre_corto : '') +
            '&descripcion=' + (infraccion.descripcion != null ? infraccion.descripcion : '') +
            '&salarios_dia=' + (infraccion.salarios_dia != null ? infraccion.salarios_dia : '') +
            '&reporta_simit=' + (infraccion.reporta_simit ? 1 : 0) +
            '&sancion_auto=' + (infraccion.sancion_auto ? 1 : 0) +
            '&usuario=' + this.userLogin.usuario;
    };
    InfraccionAddComponent.prototype.auditar = function (infraccion) {
        try {
            var infraccionAudit = this.generarInfraccionAudit(infraccion);
            this.auditoriaService.insert(this.opcion.opcion, this.accionAudit, infraccionAudit);
            return true;
        }
        catch (error) {
            return false;
        }
    };
    InfraccionAddComponent.prototype.generarInfraccionAudit = function (infraccion) {
        var infraccionAudit = {
            infraccion: infraccion['infraccion'],
            codigo: infraccion['codigo'],
            nombre_corto: infraccion['nombre_corto'],
            descripcion: infraccion['descripcion'],
            salarios_dia: infraccion['salarios_dia'],
            reporta_simit: infraccion['reporta_simit'],
            sancion_auto: infraccion['sancion_auto'],
            usuario: infraccion['usuario'],
            fecha_registra: infraccion['fecha_registra']
        };
        return JSON.stringify(infraccionAudit);
    };
    InfraccionAddComponent.prototype.resetErrores = function () {
        this.errores = [];
    };
    InfraccionAddComponent.prototype.resetFormulario = function () {
        this.infraccionForm = JSON.parse('{' +
            ' "codigo" : null,' +
            ' "nombre_corto" : "",' +
            ' "descripcion" : "",' +
            ' "salarios_dia" : "",' +
            ' "reporta_simit" : false,' +
            ' "sancion_auto" : false' +
            '}');
        this.resetErrores();
    };
    InfraccionAddComponent.prototype.cerrarVentana = function () {
        jQuery('#add-infraccion').modal('hide');
    };
    InfraccionAddComponent.prototype.close = function () {
        this.resetErrores();
        this.resetFormulario();
        this.cerrarVentana();
    };
    InfraccionAddComponent.prototype.loading = function () {
        return this.isLoading;
    };
    InfraccionAddComponent = __decorate([
        core_1.Component({
            selector: 'infraccion-add',
            templateUrl: './app/components/src/administracion/infracciones/add/infraccion-add.html',
            bindings: [InfraccionService_1.InfraccionService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService],
            directives: [
                components_2.SimpleNotificationsComponent
            ]
        }), 
        __metadata('design:paramtypes', [InfraccionService_1.InfraccionService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService])
    ], InfraccionAddComponent);
    return InfraccionAddComponent;
}());
exports.InfraccionAddComponent = InfraccionAddComponent;
//# sourceMappingURL=InfraccionAddComponent.js.map
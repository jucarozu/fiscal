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
var InfraccionEditComponent = (function () {
    function InfraccionEditComponent(infraccionService, auditoriaService, notificationService) {
        this.infraccionService = infraccionService;
        this.auditoriaService = auditoriaService;
        this.notificationService = notificationService;
        this.isLoading = false;
        this.accionAudit = 3; // Editar
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
    InfraccionEditComponent.prototype.ngOnInit = function () {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
    };
    InfraccionEditComponent.prototype.agregarEventos = function () {
        jQuery('#edit-infraccion').on('show.bs.modal', function () {
            jQuery('#btn-reset').click();
        });
    };
    InfraccionEditComponent.prototype.actualizar = function () {
        var _this = this;
        this.isLoading = true;
        this.resetErrores();
        var infraccionString = this.generarInfraccionString(this.infraccionForm);
        this.infraccionService.update(infraccionString, this.infraccionForm.infraccion).then(function (res) {
            _this.auditar(res.infraccion);
            _this.isLoading = false;
            _this.notificationService.success("Operación exitosa", "La infracción fue modificada correctamente.");
            _this.cerrarVentana();
        }, function (error) {
            _this.isLoading = false;
            // Código de respuesta de Laravel cuando falla la validación
            if (error.status === 422) {
                var errores = error.json();
                for (var key in errores) {
                    _this.errores.push(errores[key]);
                }
            }
            else {
                _this.errores.push("Ha ocurrido un error al modificar la infracción.");
            }
        });
    };
    InfraccionEditComponent.prototype.generarInfraccionString = function (infraccion) {
        return '&infraccion=' + (infraccion.infraccion != null ? infraccion.infraccion : '') +
            '&descripcion=' + (infraccion.descripcion != null ? infraccion.descripcion : '') +
            '&salarios_dia=' + (infraccion.salarios_dia != null ? infraccion.salarios_dia : '') +
            '&reporta_simit=' + (infraccion.reporta_simit ? 1 : 0) +
            '&sancion_auto=' + (infraccion.sancion_auto ? 1 : 0);
    };
    InfraccionEditComponent.prototype.auditar = function (infraccion) {
        try {
            var infraccionAudit = this.generarInfraccionAudit(infraccion);
            this.auditoriaService.insert(this.opcion.opcion, this.accionAudit, infraccionAudit);
            return true;
        }
        catch (error) {
            return false;
        }
    };
    InfraccionEditComponent.prototype.generarInfraccionAudit = function (infraccion) {
        var infraccionAudit = {
            infraccion: infraccion['infraccion'],
            descripcion: infraccion['descripcion'],
            salarios_dia: infraccion['salarios_dia'],
            reporta_simit: infraccion['reporta_simit'],
            sancion_auto: infraccion['sancion_auto']
        };
        return JSON.stringify(infraccionAudit);
    };
    InfraccionEditComponent.prototype.resetFormulario = function () {
        var _this = this;
        this.infraccionService.getById(this.infraccionForm.infraccion).then(function (infraccion) {
            _this.infraccionForm = infraccion;
        });
    };
    InfraccionEditComponent.prototype.resetErrores = function () {
        this.errores = [];
    };
    InfraccionEditComponent.prototype.cerrarVentana = function () {
        jQuery('#edit-infraccion').modal('hide');
    };
    InfraccionEditComponent.prototype.close = function () {
        this.resetErrores();
        this.cerrarVentana();
    };
    InfraccionEditComponent.prototype.loading = function () {
        return this.isLoading;
    };
    __decorate([
        core_1.Input('infraccion'), 
        __metadata('design:type', Object)
    ], InfraccionEditComponent.prototype, "infraccionForm", void 0);
    InfraccionEditComponent = __decorate([
        core_1.Component({
            selector: 'infraccion-edit',
            templateUrl: './app/components/src/administracion/infracciones/edit/infraccion-edit.html',
            bindings: [InfraccionService_1.InfraccionService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService],
            directives: [
                components_2.SimpleNotificationsComponent
            ]
        }), 
        __metadata('design:paramtypes', [InfraccionService_1.InfraccionService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService])
    ], InfraccionEditComponent);
    return InfraccionEditComponent;
}());
exports.InfraccionEditComponent = InfraccionEditComponent;
//# sourceMappingURL=InfraccionEditComponent.js.map
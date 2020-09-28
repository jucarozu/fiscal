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
var RolService_1 = require("../../../../../services/RolService");
var AuditoriaService_1 = require("../../../../../services/AuditoriaService");
var components_1 = require('angular2-notifications/components');
var components_2 = require('angular2-notifications/components');
var RolEditComponent = (function () {
    function RolEditComponent(rolService, auditoriaService, notificationService) {
        this.rolService = rolService;
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
    RolEditComponent.prototype.ngOnInit = function () {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
    };
    RolEditComponent.prototype.actualizar = function () {
        var _this = this;
        this.isLoading = true;
        this.resetErrores();
        var rolString = this.generarRolString(this.rolForm);
        this.rolService.update(rolString, this.rolForm.rol).then(function (res) {
            _this.isLoading = false;
            if (_this.auditar(res.rol, _this.rolForm.opciones)) {
                _this.notificationService.success("Operación exitosa", "El rol fue modificado correctamente.");
                _this.cerrarVentana();
            }
            else {
                _this.errores.push("Ha ocurrido un error al modificar el rol.");
            }
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
                _this.errores.push("Ha ocurrido un error al modificar el rol.");
            }
        });
    };
    RolEditComponent.prototype.auditar = function (rol, opciones) {
        try {
            var rolAudit = this.generarRolAudit(rol, opciones);
            this.auditoriaService.insert(this.opcion.opcion, this.accionAudit, rolAudit);
            return true;
        }
        catch (error) {
            return false;
        }
    };
    RolEditComponent.prototype.generarRolString = function (rol) {
        return '&rol=' + rol.rol +
            '&descripcion=' + (rol.descripcion != undefined ? rol.descripcion : '') +
            '&opciones=' + JSON.stringify(rol.opciones).replace(/"/g, '\\"') +
            '&usuario_asigna=' + this.userLogin.usuario;
    };
    RolEditComponent.prototype.generarRolAudit = function (rol, opciones) {
        var rolAudit = {
            rol: rol['rol'],
            descripcion: rol['descripcion'],
            opciones: []
        };
        for (var i in opciones) {
            if (opciones[i]['consulta'] || opciones[i]['adiciona'] || opciones[i]['edita'] || opciones[i]['elimina'] || opciones[i]['ejecuta']) {
                rolAudit['opciones'].push({
                    'modulo': opciones[i]['modulo'],
                    'opcion': opciones[i]['opcion'],
                    'consulta': opciones[i]['consulta'],
                    'adiciona': opciones[i]['adiciona'],
                    'edita': opciones[i]['edita'],
                    'elimina': opciones[i]['elimina'],
                    'ejecuta': opciones[i]['ejecuta']
                });
            }
        }
        return JSON.stringify(rolAudit);
    };
    RolEditComponent.prototype.resetErrores = function () {
        this.errores = [];
    };
    RolEditComponent.prototype.cerrarVentana = function () {
        jQuery('#edit-rol').modal('hide');
    };
    RolEditComponent.prototype.close = function () {
        this.resetErrores();
        this.cerrarVentana();
    };
    RolEditComponent.prototype.loading = function () {
        return this.isLoading;
    };
    __decorate([
        // Editar
        core_1.Input('rol'), 
        __metadata('design:type', Object)
    ], RolEditComponent.prototype, "rolForm", void 0);
    RolEditComponent = __decorate([
        core_1.Component({
            selector: 'rol-edit',
            templateUrl: './app/components/src/seguridad/roles/edit/rol-edit.html',
            bindings: [RolService_1.RolService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService],
            directives: [components_2.SimpleNotificationsComponent]
        }), 
        __metadata('design:paramtypes', [RolService_1.RolService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService])
    ], RolEditComponent);
    return RolEditComponent;
}());
exports.RolEditComponent = RolEditComponent;
//# sourceMappingURL=RolEditComponent.js.map
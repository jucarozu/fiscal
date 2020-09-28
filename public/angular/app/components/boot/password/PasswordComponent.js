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
var UsuarioService_1 = require("../../../services/UsuarioService");
var GeneralService_1 = require("../../../services/GeneralService");
var AuditoriaService_1 = require("../../../services/AuditoriaService");
var components_1 = require('angular2-notifications/components');
var components_2 = require('angular2-notifications/components');
var PasswordComponent = (function () {
    function PasswordComponent(router, usuarioService, generalService, auditoriaService, notificationService) {
        this.router = router;
        this.usuarioService = usuarioService;
        this.generalService = generalService;
        this.auditoriaService = auditoriaService;
        this.notificationService = notificationService;
        this.isLoading = false;
        this.accionAudit = 3; // Editar
        this.errores = [];
        this.notificationsOptions = {
            timeOut: 7000,
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
    PasswordComponent.prototype.ngOnInit = function () {
        this.resetFormulario();
    };
    PasswordComponent.prototype.cambiarPassword = function () {
        var _this = this;
        this.isLoading = true;
        this.resetErrores();
        this.userLogin = JSON.parse(localStorage.getItem('user_login'));
        this.passwordForm.usuario = this.userLogin.usuario;
        var passwordString = this.generarPasswordString(this.passwordForm);
        this.usuarioService.changePassword(passwordString, this.passwordForm.usuario).then(function (res) {
            _this.isLoading = false;
            localStorage.removeItem('id_token');
            localStorage.removeItem('user_login');
            localStorage.removeItem('menu');
            localStorage.removeItem('is_force_password');
            _this.notificationService.info("Información", "Ingrese de nuevo a la aplicación con sus datos de usuario.");
            _this.notificationService.success("Operación exitosa", "La contraseña ha sido cambiada correctamente.");
            _this.resetFormulario();
            _this.cerrarVentana();
            _this.router.navigate(['Login']);
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
                _this.errores.push("Ha ocurrido un error al cambiar la contraseña.");
            }
        });
    };
    PasswordComponent.prototype.generarPasswordString = function (password) {
        return '&usuario=' + password.usuario +
            '&password_actual=' + (password.password_actual != undefined ? password.password_actual : '') +
            '&password_nueva=' + (password.password_nueva != undefined ? password.password_nueva : '') +
            '&password_nueva_confirmation=' + (password.password_nueva_confirmation != undefined ? password.password_nueva_confirmation : '');
    };
    PasswordComponent.prototype.resetErrores = function () {
        this.errores = [];
    };
    PasswordComponent.prototype.resetFormulario = function () {
        this.passwordForm = JSON.parse('{' +
            ' "usuario" : null,' +
            ' "password_actual" : "",' +
            ' "password_nueva" : "",' +
            ' "password_nueva_confirmation" : ""' +
            '}');
    };
    PasswordComponent.prototype.cerrarVentana = function () {
        jQuery('#cambio-password').modal('hide');
    };
    PasswordComponent.prototype.close = function () {
        this.resetErrores();
        this.resetFormulario();
        this.cerrarVentana();
    };
    PasswordComponent.prototype.loading = function () {
        return this.isLoading;
    };
    __decorate([
        // Editar
        core_1.Input('isForcePassword'), 
        __metadata('design:type', Boolean)
    ], PasswordComponent.prototype, "isForcePassword", void 0);
    PasswordComponent = __decorate([
        core_1.Component({
            selector: 'password',
            templateUrl: './app/components/boot/password/password.html',
            bindings: [UsuarioService_1.UsuarioService, GeneralService_1.GeneralService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService],
            directives: [components_2.SimpleNotificationsComponent]
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.Router, UsuarioService_1.UsuarioService, GeneralService_1.GeneralService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService])
    ], PasswordComponent);
    return PasswordComponent;
}());
exports.PasswordComponent = PasswordComponent;
//# sourceMappingURL=PasswordComponent.js.map
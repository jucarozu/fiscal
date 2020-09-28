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
var UsuarioService_1 = require("../../../../../services/UsuarioService");
var ParametroService_1 = require("../../../../../services/ParametroService");
var AuditoriaService_1 = require("../../../../../services/AuditoriaService");
var components_1 = require('angular2-notifications/components');
var components_2 = require('angular2-notifications/components');
var UsuarioEditComponent = (function () {
    function UsuarioEditComponent(usuarioService, parametroService, auditoriaService, notificationService) {
        this.usuarioService = usuarioService;
        this.parametroService = parametroService;
        this.auditoriaService = auditoriaService;
        this.notificationService = notificationService;
        this.isLoading = false;
        this.accionAudit = 3; // Editar
        this.gpTipoDocumento = 1;
        this.gpCargo = 4;
        this.errores = [];
        this.documentos = [];
        this.cargos = [];
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
    UsuarioEditComponent.prototype.ngOnInit = function () {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
        this.cargarCombos();
    };
    UsuarioEditComponent.prototype.cargarCombos = function () {
        var _this = this;
        this.parametroService.getByGrupo(this.gpTipoDocumento).then(function (documentos) { _this.documentos = documentos; });
        this.parametroService.getByGrupo(this.gpCargo).then(function (cargos) { _this.cargos = cargos; });
    };
    UsuarioEditComponent.prototype.actualizar = function () {
        var _this = this;
        this.isLoading = true;
        this.resetErrores();
        if (!this.validarRoles(this.usuarioForm.roles)) {
            this.isLoading = false;
            return;
        }
        var usuarioString = this.generarUsuarioString(this.usuarioForm);
        this.usuarioService.update(usuarioString, this.usuarioForm.usuario).then(function (res) {
            _this.auditar(res.usuario, _this.usuarioForm.roles);
            _this.isLoading = false;
            _this.notificationService.success("Operación exitosa", "El usuario fue modificado correctamente.");
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
                _this.errores.push("Ha ocurrido un error al modificar el usuario.");
            }
        });
    };
    UsuarioEditComponent.prototype.validarRoles = function (roles) {
        for (var i in roles) {
            if (roles[i]['tiene_rol']) {
                return true;
            }
        }
        this.errores.push("El usuario debe tener al menos un rol asignado.");
        return false;
    };
    UsuarioEditComponent.prototype.generarUsuarioString = function (usuario) {
        return '&usuario=' + usuario.usuario +
            '&cargo=' + (usuario.cargo != null ? usuario.cargo : '') +
            '&email=' + (usuario.email != null ? usuario.email : '') +
            '&roles=' + JSON.stringify(usuario.roles).replace(/"/g, '\\"');
    };
    UsuarioEditComponent.prototype.auditar = function (usuario, roles) {
        try {
            var usuarioAudit = this.generarUsuarioAudit(usuario, roles);
            this.auditoriaService.insert(this.opcion.opcion, this.accionAudit, usuarioAudit);
            return true;
        }
        catch (error) {
            return false;
        }
    };
    UsuarioEditComponent.prototype.generarUsuarioAudit = function (usuario, roles) {
        var usuarioAudit = {
            usuario: usuario["usuario"],
            cargo: usuario['cargo'],
            email: usuario['email'],
            roles: []
        };
        for (var i in roles) {
            if (roles[i]['tiene_rol']) {
                usuarioAudit['roles'].push({
                    'rol': roles[i]['rol'],
                    'nombre': roles[i]['nombre']
                });
            }
        }
        return JSON.stringify(usuarioAudit);
    };
    UsuarioEditComponent.prototype.restablecerPassword = function () {
        var _this = this;
        this.isLoading = true;
        this.resetErrores();
        this.usuarioService.resetPassword(this.usuarioForm.usuario).then(function (res) {
            _this.isLoading = false;
            _this.mensaje = "La contraseña fue restablecida correctamente.";
        }, function (error) {
            _this.isLoading = false;
            _this.errores.push("Ha ocurrido un error al restablecer la contraseña.");
        });
    };
    UsuarioEditComponent.prototype.forzarPassword = function () {
        var _this = this;
        this.isLoading = true;
        this.resetErrores();
        this.usuarioService.forcePassword(this.usuarioForm.usuario).then(function (res) {
            _this.isLoading = false;
            _this.mensaje = "Cambio de contraseña forzado correctamente.";
        }, function (error) {
            _this.isLoading = false;
            _this.errores.push("Ha ocurrido un error al forzar el cambio de contraseña.");
        });
    };
    UsuarioEditComponent.prototype.resetErrores = function () {
        this.mensaje = "";
        this.errores = [];
    };
    UsuarioEditComponent.prototype.cerrarVentana = function () {
        jQuery('#edit-usuario').modal('hide');
    };
    UsuarioEditComponent.prototype.close = function () {
        this.resetErrores();
        this.cerrarVentana();
    };
    UsuarioEditComponent.prototype.loading = function () {
        return this.isLoading;
    };
    __decorate([
        core_1.Input('usuario'), 
        __metadata('design:type', Object)
    ], UsuarioEditComponent.prototype, "usuarioForm", void 0);
    UsuarioEditComponent = __decorate([
        core_1.Component({
            selector: 'usuario-edit',
            templateUrl: './app/components/src/seguridad/usuarios/edit/usuario-edit.html',
            bindings: [UsuarioService_1.UsuarioService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService],
            directives: [components_2.SimpleNotificationsComponent]
        }), 
        __metadata('design:paramtypes', [UsuarioService_1.UsuarioService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService])
    ], UsuarioEditComponent);
    return UsuarioEditComponent;
}());
exports.UsuarioEditComponent = UsuarioEditComponent;
//# sourceMappingURL=UsuarioEditComponent.js.map
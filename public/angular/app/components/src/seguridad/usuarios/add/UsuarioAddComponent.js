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
var RolService_1 = require("../../../../../services/RolService");
var PersonaService_1 = require("../../../../../services/PersonaService");
var ParametroService_1 = require("../../../../../services/ParametroService");
var AuditoriaService_1 = require("../../../../../services/AuditoriaService");
var PersonaAddComponent_1 = require("../../../administracion/personas/add/PersonaAddComponent");
var components_1 = require('angular2-notifications/components');
var components_2 = require('angular2-notifications/components');
var UsuarioAddComponent = (function () {
    function UsuarioAddComponent(usuarioService, rolService, personaService, parametroService, auditoriaService, notificationService) {
        this.usuarioService = usuarioService;
        this.rolService = rolService;
        this.personaService = personaService;
        this.parametroService = parametroService;
        this.auditoriaService = auditoriaService;
        this.notificationService = notificationService;
        this.isLoading = false;
        this.accionAudit = 2; // Adicionar
        this.gpTipoDocumento = 1;
        this.gpCargo = 4;
        this.errores = [];
        this.documentos = [];
        this.cargos = [];
        this.roles = [];
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
    UsuarioAddComponent.prototype.ngOnInit = function () {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
        this.resetFormulario();
        this.agregarEventos();
        this.cargarCombos();
    };
    UsuarioAddComponent.prototype.agregarEventos = function () {
        jQuery('#add-persona').on('hide.bs.modal', function () {
            jQuery('#btn-load-persona').click();
        });
    };
    UsuarioAddComponent.prototype.cargarCombos = function () {
        var _this = this;
        this.parametroService.getByGrupo(this.gpTipoDocumento).then(function (documentos) { _this.documentos = documentos; });
        this.parametroService.getByGrupo(this.gpCargo).then(function (cargos) { _this.cargos = cargos; });
    };
    UsuarioAddComponent.prototype.cargarRoles = function () {
        var _this = this;
        this.rolService.get()
            .then(function (roles) {
            _this.roles = [];
            for (var i in roles) {
                _this.roles.push({
                    rol: roles[i]['rol'],
                    nombre: roles[i]['nombre'],
                    tiene_rol: roles[i]['tiene_rol']
                });
            }
        });
    };
    UsuarioAddComponent.prototype.cargarPersona = function () {
        var _this = this;
        this.personaService.getByDocumento(this.usuarioForm.tipo_doc, this.usuarioForm.numero_doc)
            .then(function (persona) {
            if (persona != null) {
                _this.usuarioForm.persona = persona.persona;
                _this.usuarioForm.nombres_apellidos = persona.nombres_apellidos;
                _this.usuarioForm.login = _this.usuarioForm.numero_doc.toString();
            }
        });
    };
    UsuarioAddComponent.prototype.getPersonaByDocumento = function () {
        var _this = this;
        this.errores = [];
        if (this.usuarioForm.tipo_doc == null)
            return;
        if (this.usuarioForm.numero_doc == "")
            return;
        if (isNaN(Number(this.usuarioForm.numero_doc))) {
            this.errores.push("El número de documento debe ser numérico.");
            return;
        }
        this.personaService.getByDocumento(this.usuarioForm.tipo_doc, this.usuarioForm.numero_doc)
            .then(function (persona) {
            _this.personaForm.tipo_doc = _this.usuarioForm.tipo_doc;
            _this.personaForm.numero_doc = _this.usuarioForm.numero_doc;
            if (persona != null) {
                _this.usuarioForm.persona = persona.persona;
                _this.usuarioForm.nombres_apellidos = persona.nombres_apellidos;
                _this.usuarioForm.login = _this.usuarioForm.numero_doc.toString();
            }
            else {
                _this.usuarioForm.persona = null;
                _this.usuarioForm.nombres_apellidos = "";
                _this.usuarioForm.login = "";
                localStorage.setItem('input-persona', JSON.stringify(_this.personaForm));
                jQuery('#add-persona').modal({ backdrop: 'static' });
            }
        });
    };
    UsuarioAddComponent.prototype.insertar = function () {
        var _this = this;
        this.resetErrores();
        if (!this.validarRoles(this.roles)) {
            return;
        }
        this.isLoading = true;
        var usuarioString = this.generarUsuarioString(this.usuarioForm, this.roles);
        this.usuarioService.insert(usuarioString).then(function (res) {
            _this.auditar(res.usuario, _this.roles);
            _this.isLoading = false;
            _this.notificationService.success("Operación exitosa", "El usuario fue creado correctamente.");
            _this.resetFormulario();
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
                _this.errores.push("Ha ocurrido un error al crear el usuario.");
            }
        });
    };
    UsuarioAddComponent.prototype.validarRoles = function (roles) {
        for (var i in roles) {
            if (roles[i]['tiene_rol']) {
                return true;
            }
        }
        this.errores.push("El usuario debe tener al menos un rol asignado.");
        return false;
    };
    UsuarioAddComponent.prototype.generarUsuarioString = function (usuario, roles) {
        return '&persona=' + usuario.persona +
            '&login=' + (usuario.login != null ? usuario.login : '') +
            '&cargo=' + (usuario.cargo != null ? usuario.cargo : '') +
            '&email=' + (usuario.email != null ? usuario.email : '') +
            '&roles=' + JSON.stringify(roles).replace(/"/g, '\\"') +
            '&usuario_registra=' + this.userLogin.usuario;
    };
    UsuarioAddComponent.prototype.auditar = function (usuario, roles) {
        try {
            var usuarioAudit = this.generarUsuarioAudit(usuario, roles);
            this.auditoriaService.insert(this.opcion.opcion, this.accionAudit, usuarioAudit);
            return true;
        }
        catch (error) {
            return false;
        }
    };
    UsuarioAddComponent.prototype.generarUsuarioAudit = function (usuario, roles) {
        var usuarioAudit = {
            usuario: usuario["usuario"],
            persona: usuario['persona'],
            login: usuario['login'],
            contrasena: usuario['contrasena'],
            cargo: usuario['cargo'],
            fecha_alta: usuario['fecha_alta'],
            fecha_baja: usuario['fecha_baja'],
            email: usuario['email'],
            estado: usuario['estado'],
            usuario_registra: usuario['usuario_registra'],
            fecha_password: usuario['fecha_password'],
            fecha_vence_passw: usuario['fecha_vence_passw'],
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
    UsuarioAddComponent.prototype.resetErrores = function () {
        this.errores = [];
    };
    UsuarioAddComponent.prototype.resetFormulario = function () {
        this.usuarioForm = JSON.parse('{' +
            ' "persona" : null,' +
            ' "tipo_doc" : null,' +
            ' "numero_doc" : "",' +
            ' "nombres_apellidos" : "",' +
            ' "login" : "",' +
            ' "cargo" : null,' +
            ' "email" : ""' +
            '}');
        this.personaForm = JSON.parse('{' +
            ' "tipo_doc" : null,' +
            ' "numero_doc" : ""' +
            '}');
        this.cargarRoles();
    };
    UsuarioAddComponent.prototype.cerrarVentana = function () {
        jQuery('#add-usuario').modal('hide');
    };
    UsuarioAddComponent.prototype.close = function () {
        this.resetErrores();
        this.resetFormulario();
        this.cerrarVentana();
    };
    UsuarioAddComponent.prototype.loading = function () {
        return this.isLoading;
    };
    UsuarioAddComponent = __decorate([
        core_1.Component({
            selector: 'usuario-add',
            templateUrl: './app/components/src/seguridad/usuarios/add/usuario-add.html',
            bindings: [UsuarioService_1.UsuarioService, RolService_1.RolService, PersonaService_1.PersonaService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService],
            directives: [
                PersonaAddComponent_1.PersonaAddComponent,
                components_2.SimpleNotificationsComponent
            ]
        }), 
        __metadata('design:paramtypes', [UsuarioService_1.UsuarioService, RolService_1.RolService, PersonaService_1.PersonaService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService])
    ], UsuarioAddComponent);
    return UsuarioAddComponent;
}());
exports.UsuarioAddComponent = UsuarioAddComponent;
//# sourceMappingURL=UsuarioAddComponent.js.map
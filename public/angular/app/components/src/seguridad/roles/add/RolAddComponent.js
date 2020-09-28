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
var OpcionService_1 = require("../../../../../services/OpcionService");
var AuditoriaService_1 = require("../../../../../services/AuditoriaService");
var components_1 = require('angular2-notifications/components');
var components_2 = require('angular2-notifications/components');
var RolAddComponent = (function () {
    function RolAddComponent(rolService, opcionService, auditoriaService, notificationService) {
        this.rolService = rolService;
        this.opcionService = opcionService;
        this.auditoriaService = auditoriaService;
        this.notificationService = notificationService;
        this.isLoading = false;
        this.accionAudit = 2; // Adicionar
        this.errores = [];
        this.opciones = [];
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
    RolAddComponent.prototype.ngOnInit = function () {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
        this.resetFormulario();
    };
    RolAddComponent.prototype.getOpciones = function () {
        var _this = this;
        this.opcionService.get()
            .then(function (opciones) {
            _this.opciones = [];
            for (var i in opciones) {
                _this.opciones.push({
                    modulo: opciones[i]['modulo'],
                    modulo_nombre: opciones[i]['modulo_nombre'],
                    opcion: opciones[i]['opcion'],
                    opcion_nombre: opciones[i]['opcion_nombre'],
                    consulta: opciones[i]['consulta'],
                    adiciona: opciones[i]['adiciona'],
                    edita: opciones[i]['edita'],
                    elimina: opciones[i]['elimina'],
                    ejecuta: opciones[i]['ejecuta'],
                });
            }
        });
    };
    RolAddComponent.prototype.insertar = function () {
        var _this = this;
        this.isLoading = true;
        this.resetErrores();
        var rolString = this.generarRolString(this.rolForm, this.opciones);
        this.rolService.insert(rolString).then(function (res) {
            _this.auditar(res.rol, _this.opciones);
            _this.isLoading = false;
            _this.notificationService.success("Operación exitosa", "El rol fue creado correctamente.");
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
                _this.errores.push("Ha ocurrido un error al crear el rol.");
            }
        });
    };
    RolAddComponent.prototype.auditar = function (rol, opciones) {
        try {
            var rolAudit = this.generarRolAudit(rol, opciones);
            this.auditoriaService.insert(this.opcion.opcion, this.accionAudit, rolAudit);
            return true;
        }
        catch (error) {
            return false;
        }
    };
    RolAddComponent.prototype.generarRolString = function (rol, opciones) {
        return '&nombre=' + (rol.nombre != null ? rol.nombre : '') +
            '&descripcion=' + (rol.descripcion != null ? rol.descripcion : '') +
            '&opciones=' + JSON.stringify(opciones).replace(/"/g, '\\"') +
            '&usuario_asigna=' + this.userLogin.usuario;
    };
    RolAddComponent.prototype.generarRolAudit = function (rol, opciones) {
        var rolAudit = {
            rol: rol['rol'],
            nombre: rol['nombre'],
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
    RolAddComponent.prototype.resetErrores = function () {
        this.errores = [];
    };
    RolAddComponent.prototype.resetFormulario = function () {
        this.rolForm = JSON.parse('{' +
            ' "nombre" : "",' +
            ' "descripcion" : ""' +
            '}');
        this.getOpciones();
    };
    RolAddComponent.prototype.cerrarVentana = function () {
        jQuery('#add-rol').modal('hide');
    };
    RolAddComponent.prototype.close = function () {
        this.resetErrores();
        this.resetFormulario();
        this.cerrarVentana();
    };
    RolAddComponent.prototype.loading = function () {
        return this.isLoading;
    };
    RolAddComponent = __decorate([
        core_1.Component({
            selector: 'rol-add',
            templateUrl: './app/components/src/seguridad/roles/add/rol-add.html',
            bindings: [RolService_1.RolService, OpcionService_1.OpcionService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService],
            directives: [components_2.SimpleNotificationsComponent]
        }), 
        __metadata('design:paramtypes', [RolService_1.RolService, OpcionService_1.OpcionService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService])
    ], RolAddComponent);
    return RolAddComponent;
}());
exports.RolAddComponent = RolAddComponent;
//# sourceMappingURL=RolAddComponent.js.map
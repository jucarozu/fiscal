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
var DireccionService_1 = require("../../../../../services/DireccionService");
var PersonaService_1 = require("../../../../../services/PersonaService");
var DivipoService_1 = require("../../../../../services/DivipoService");
var ParametroService_1 = require("../../../../../services/ParametroService");
var AuditoriaService_1 = require("../../../../../services/AuditoriaService");
var components_1 = require('angular2-notifications/components');
var components_2 = require('angular2-notifications/components');
var DireccionEditComponent = (function () {
    function DireccionEditComponent(direccionService, personaService, divipoService, parametroService, auditoriaService, notificationService) {
        this.direccionService = direccionService;
        this.personaService = personaService;
        this.divipoService = divipoService;
        this.parametroService = parametroService;
        this.auditoriaService = auditoriaService;
        this.notificationService = notificationService;
        this.isLoading = false;
        this.accionAudit = 3; // Editar
        this.gpTipoDocumento = 1;
        this.gpFuente = 13;
        this.errores = [];
        this.departamentos = [];
        this.municipios = [];
        this.poblados = [];
        this.documentos = [];
        this.fuentes = [];
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
    DireccionEditComponent.prototype.ngOnInit = function () {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
        this.agregarEventos();
        this.cargarCombos();
    };
    DireccionEditComponent.prototype.agregarEventos = function () {
        jQuery('#edit-direccion').on('show.bs.modal', function () {
            jQuery('#btn-reset').click();
        });
    };
    DireccionEditComponent.prototype.cargarCombos = function () {
        var _this = this;
        this.divipoService.getDepartamentos().then(function (departamentos) { _this.departamentos = departamentos; });
        this.parametroService.getByGrupo(this.gpTipoDocumento).then(function (documentos) { _this.documentos = documentos; });
        this.parametroService.getByGrupo(this.gpFuente).then(function (fuentes) { _this.fuentes = fuentes; });
    };
    DireccionEditComponent.prototype.cargarMunicipios = function (cod_departamento) {
        var _this = this;
        if (cod_departamento != null) {
            this.divipoService.getMunicipios(cod_departamento)
                .then(function (municipios) {
                _this.municipios = municipios;
            });
        }
        else {
            this.municipios = null;
            this.direccionForm.cod_municipio = null;
            this.poblados = null;
            this.direccionForm.cod_poblado = null;
        }
    };
    DireccionEditComponent.prototype.cargarPoblados = function (cod_municipio) {
        var _this = this;
        if (cod_municipio != null) {
            this.divipoService.getPoblados(cod_municipio)
                .then(function (poblados) {
                _this.poblados = poblados;
                _this.direccionForm.cod_poblado = 0;
            });
        }
        else {
            this.poblados = null;
            this.direccionForm.cod_poblado = null;
        }
    };
    DireccionEditComponent.prototype.actualizar = function () {
        var _this = this;
        this.isLoading = true;
        this.resetErrores();
        var direccionString = this.generarDireccionString(this.direccionForm);
        this.direccionService.update(direccionString, this.direccionForm.direccion).then(function (res) {
            _this.auditar(res.direccion);
            _this.isLoading = false;
            _this.notificationService.success("Operación exitosa", "La dirección fue modificada correctamente.");
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
                _this.errores.push("Ha ocurrido un error al modificar la dirección.");
            }
        });
    };
    DireccionEditComponent.prototype.generarDireccionString = function (direccion) {
        var pad = '000';
        var cod_poblado = pad.substring(0, pad.length - direccion.cod_poblado.toString().length) + direccion.cod_poblado.toString();
        return '&direccion=' + (direccion.direccion != null ? direccion.direccion : '') +
            '&fuente=' + (direccion.fuente != null ? direccion.fuente : '') +
            '&observaciones=' + (direccion.observaciones != null ? direccion.observaciones : '') +
            '&divipo=' + (direccion.cod_municipio + cod_poblado) +
            '&descripcion=' + (direccion.descripcion != null ? direccion.descripcion : '');
    };
    DireccionEditComponent.prototype.auditar = function (direccion) {
        try {
            var direccionAudit = this.generarDireccionAudit(direccion);
            this.auditoriaService.insert(this.opcion.opcion, this.accionAudit, direccionAudit);
            return true;
        }
        catch (error) {
            return false;
        }
    };
    DireccionEditComponent.prototype.generarDireccionAudit = function (direccion) {
        var direccionAudit = {
            direccion: direccion['direccion'],
            fuente: direccion['fuente'],
            observaciones: direccion['observaciones'],
            divipo: direccion['divipo'],
            descripcion: direccion['descripcion']
        };
        return JSON.stringify(direccionAudit);
    };
    DireccionEditComponent.prototype.resetFormulario = function () {
        var _this = this;
        this.isLoading = true;
        this.direccionForm.cod_municipio = null;
        this.direccionForm.cod_poblado = null;
        this.direccionService.getById(this.direccionForm.direccion).then(function (direccion) {
            _this.direccionForm = direccion;
            _this.cargarMunicipios(direccion.cod_departamento);
            _this.cargarPoblados(direccion.cod_municipio);
            _this.isLoading = false;
        });
        this.resetErrores();
    };
    DireccionEditComponent.prototype.resetErrores = function () {
        this.errores = [];
    };
    DireccionEditComponent.prototype.cerrarVentana = function () {
        jQuery('#edit-direccion').modal('hide');
    };
    DireccionEditComponent.prototype.close = function () {
        this.resetErrores();
        this.cerrarVentana();
    };
    DireccionEditComponent.prototype.loading = function () {
        return this.isLoading;
    };
    __decorate([
        core_1.Input('direccion'), 
        __metadata('design:type', Object)
    ], DireccionEditComponent.prototype, "direccionForm", void 0);
    DireccionEditComponent = __decorate([
        core_1.Component({
            selector: 'direccion-edit',
            templateUrl: './app/components/src/administracion/direcciones/edit/direccion-edit.html',
            bindings: [DireccionService_1.DireccionService, PersonaService_1.PersonaService, DivipoService_1.DivipoService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService],
            directives: [
                components_2.SimpleNotificationsComponent
            ]
        }), 
        __metadata('design:paramtypes', [DireccionService_1.DireccionService, PersonaService_1.PersonaService, DivipoService_1.DivipoService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService])
    ], DireccionEditComponent);
    return DireccionEditComponent;
}());
exports.DireccionEditComponent = DireccionEditComponent;
//# sourceMappingURL=DireccionEditComponent.js.map
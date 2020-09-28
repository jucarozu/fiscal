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
var PropietarioService_1 = require("../../../../../services/PropietarioService");
var PersonaService_1 = require("../../../../../services/PersonaService");
var ParametroService_1 = require("../../../../../services/ParametroService");
var AuditoriaService_1 = require("../../../../../services/AuditoriaService");
var components_1 = require('angular2-notifications/components');
var components_2 = require('angular2-notifications/components');
var PropietarioAddComponent = (function () {
    function PropietarioAddComponent(propietarioService, personaService, parametroService, auditoriaService, notificationService) {
        this.propietarioService = propietarioService;
        this.personaService = personaService;
        this.parametroService = parametroService;
        this.auditoriaService = auditoriaService;
        this.notificationService = notificationService;
        this.isLoading = false;
        this.accionAudit = 2; // Adicionar
        this.gpTipoDocumento = 1;
        this.gpFuente = 14;
        this.gpTipoPropietario = 15;
        this.errores = [];
        this.documentos = [];
        this.fuentes = [];
        this.tipos_prop = [];
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
    PropietarioAddComponent.prototype.ngOnInit = function () {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
        this.resetFormulario();
        this.agregarEventos();
        this.cargarCombos();
    };
    PropietarioAddComponent.prototype.agregarEventos = function () {
        jQuery('#add-propietario').on('show.bs.modal', function () {
            jQuery('#btn-reset-add').click();
        });
        jQuery('#add-persona').on('hide.bs.modal', function () {
            jQuery('#btn-load-persona-add').click();
            jQuery('#btn-load-locatario-add').click();
        });
    };
    PropietarioAddComponent.prototype.cargarCombos = function () {
        var _this = this;
        this.parametroService.getByGrupo(this.gpTipoDocumento).then(function (documentos) { _this.documentos = documentos; });
        this.parametroService.getByGrupo(this.gpFuente).then(function (fuentes) { _this.fuentes = fuentes; });
        this.parametroService.getByGrupo(this.gpTipoPropietario).then(function (tipos_prop) { _this.tipos_prop = tipos_prop; });
    };
    PropietarioAddComponent.prototype.convertPlacaToUpper = function () {
        this.propietarioForm.placa = this.propietarioForm.placa.toUpperCase();
    };
    PropietarioAddComponent.prototype.mostrarLocatario = function () {
        if (this.propietarioForm.tipo == 2) {
            document.getElementById('locatario-add').style.display = 'block';
        }
        else {
            this.propietarioForm.locatario = null;
            this.propietarioForm.loc_tipo_doc = null;
            this.propietarioForm.loc_numero_doc = "";
            this.propietarioForm.loc_nombres_apellidos = "";
            document.getElementById('locatario-add').style.display = 'none';
        }
    };
    PropietarioAddComponent.prototype.cargarPersona = function () {
        var _this = this;
        if (this.propietarioForm.tipo_doc == null)
            return;
        if (this.propietarioForm.numero_doc == "")
            return;
        this.personaService.getByDocumento(this.propietarioForm.tipo_doc, this.propietarioForm.numero_doc)
            .then(function (persona) {
            if (persona != null) {
                _this.propietarioForm.persona = persona.persona;
                _this.propietarioForm.nombres_apellidos = persona.nombres_apellidos;
            }
        });
    };
    PropietarioAddComponent.prototype.getPersonaByDocumento = function () {
        var _this = this;
        this.errores = [];
        if (this.propietarioForm.tipo_doc == null)
            return;
        if (this.propietarioForm.numero_doc == "")
            return;
        if (isNaN(Number(this.propietarioForm.numero_doc))) {
            this.errores.push("El número de documento debe ser numérico.");
            return;
        }
        this.personaService.getByDocumento(this.propietarioForm.tipo_doc, this.propietarioForm.numero_doc)
            .then(function (persona) {
            _this.personaForm.tipo_doc = _this.propietarioForm.tipo_doc;
            _this.personaForm.numero_doc = _this.propietarioForm.numero_doc;
            if (persona != null) {
                _this.propietarioForm.persona = persona.persona;
                _this.propietarioForm.nombres_apellidos = persona.nombres_apellidos;
            }
            else {
                _this.propietarioForm.persona = null;
                _this.propietarioForm.nombres_apellidos = "";
                localStorage.setItem('input-persona', JSON.stringify(_this.personaForm));
                jQuery('#add-persona').modal({ backdrop: 'static' });
            }
        });
    };
    PropietarioAddComponent.prototype.cargarLocatario = function () {
        var _this = this;
        if (this.propietarioForm.loc_tipo_doc == null)
            return;
        if (this.propietarioForm.loc_numero_doc == "")
            return;
        this.personaService.getByDocumento(this.propietarioForm.loc_tipo_doc, this.propietarioForm.loc_numero_doc)
            .then(function (persona) {
            if (persona != null) {
                _this.propietarioForm.locatario = persona.persona;
                _this.propietarioForm.loc_nombres_apellidos = persona.nombres_apellidos;
            }
        });
    };
    PropietarioAddComponent.prototype.getLocatarioByDocumento = function () {
        var _this = this;
        this.errores = [];
        if (this.propietarioForm.loc_tipo_doc == null)
            return;
        if (this.propietarioForm.loc_numero_doc == "")
            return;
        if (isNaN(Number(this.propietarioForm.loc_numero_doc))) {
            this.errores.push("El número de documento debe ser numérico.");
            return;
        }
        this.personaService.getByDocumento(this.propietarioForm.loc_tipo_doc, this.propietarioForm.loc_numero_doc)
            .then(function (persona) {
            _this.personaForm.tipo_doc = _this.propietarioForm.loc_tipo_doc;
            _this.personaForm.numero_doc = _this.propietarioForm.loc_numero_doc;
            if (persona != null) {
                _this.propietarioForm.locatario = persona.persona;
                _this.propietarioForm.loc_nombres_apellidos = persona.nombres_apellidos;
            }
            else {
                _this.propietarioForm.locatario = null;
                _this.propietarioForm.loc_nombres_apellidos = "";
                localStorage.setItem('input-persona', JSON.stringify(_this.personaForm));
                jQuery('#add-persona').modal({ backdrop: 'static' });
            }
        });
    };
    PropietarioAddComponent.prototype.insertar = function () {
        var _this = this;
        this.isLoading = true;
        this.resetErrores();
        if (this.propietarioForm.hasta != null && this.propietarioForm.desde > this.propietarioForm.hasta) {
            this.errores.push("La fecha inicial no puede ser mayor a la fecha final.");
            this.isLoading = false;
            return;
        }
        var propietarioString = this.generarPropietarioString(this.propietarioForm);
        this.propietarioService.insert(propietarioString).then(function (res) {
            _this.auditar(res.propietario);
            _this.isLoading = false;
            _this.notificationService.success("Operación exitosa", "El propietario fue creado correctamente.");
            _this.resetFormulario();
            _this.cerrarVentana();
        }, function (error) {
            // Código de respuesta de Laravel cuando falla la validación
            if (error.status === 422) {
                var errores = error.json();
                for (var key in errores) {
                    _this.errores.push(errores[key]);
                }
            }
            else {
                _this.errores.push("Ha ocurrido un error al crear el propietario.");
            }
            _this.isLoading = false;
        });
    };
    PropietarioAddComponent.prototype.generarPropietarioString = function (propietario) {
        return '&placa=' + (propietario.placa != null ? propietario.placa : '') +
            '&persona=' + (propietario.persona != null ? propietario.persona : '') +
            '&fuente=' + (propietario.fuente != null ? propietario.fuente : '') +
            '&tipo=' + (propietario.tipo != null ? propietario.tipo : '') +
            '&locatario=' + (propietario.locatario != null ? propietario.locatario : '') +
            '&desde=' + (propietario.desde != null ? propietario.desde : '') +
            '&hasta=' + (propietario.hasta != null ? propietario.hasta : '') +
            '&usuario=' + this.userLogin.usuario;
    };
    PropietarioAddComponent.prototype.auditar = function (propietario) {
        try {
            var propietarioAudit = this.generarPropietarioAudit(propietario);
            this.auditoriaService.insert(this.opcion.opcion, this.accionAudit, propietarioAudit);
            return true;
        }
        catch (error) {
            return false;
        }
    };
    PropietarioAddComponent.prototype.generarPropietarioAudit = function (propietario) {
        var propietarioAudit = {
            propietario: propietario['propietario'],
            placa: propietario['placa'],
            persona: propietario['persona'],
            fuente: propietario['fuente'],
            tipo: propietario['tipo'],
            locatario: propietario['locatario'],
            desde: propietario['desde'],
            hasta: propietario['hasta'],
            fecha_registra: propietario['fecha_registra'],
            usuario: propietario['usuario']
        };
        return JSON.stringify(propietarioAudit);
    };
    PropietarioAddComponent.prototype.resetErrores = function () {
        this.errores = [];
    };
    PropietarioAddComponent.prototype.resetFormulario = function () {
        this.propietarioForm = JSON.parse('{' +
            ' "placa" : "",' +
            ' "persona" : null,' +
            ' "tipo_doc" : null,' +
            ' "numero_doc" : "",' +
            ' "nombres_apellidos" : "",' +
            ' "fuente" : null,' +
            ' "tipo" : null,' +
            ' "locatario" : null,' +
            ' "loc_tipo_doc" : null,' +
            ' "loc_numero_doc" : "",' +
            ' "loc_nombres_apellidos" : "",' +
            ' "desde" : null,' +
            ' "hasta" : null' +
            '}');
        jQuery('#desde, #hasta').val("");
        this.personaForm = JSON.parse('{' +
            ' "tipo_doc" : null,' +
            ' "numero_doc" : ""' +
            '}');
        document.getElementById('locatario-add').style.display = 'none';
        this.resetErrores();
    };
    PropietarioAddComponent.prototype.cerrarVentana = function () {
        jQuery('#add-propietario').modal('hide');
    };
    PropietarioAddComponent.prototype.close = function () {
        this.resetErrores();
        this.resetFormulario();
        this.cerrarVentana();
    };
    PropietarioAddComponent.prototype.loading = function () {
        return this.isLoading;
    };
    PropietarioAddComponent = __decorate([
        core_1.Component({
            selector: 'propietario-add',
            templateUrl: './app/components/src/administracion/propietarios/add/propietario-add.html',
            bindings: [PropietarioService_1.PropietarioService, PersonaService_1.PersonaService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService],
            directives: [
                components_2.SimpleNotificationsComponent
            ]
        }), 
        __metadata('design:paramtypes', [PropietarioService_1.PropietarioService, PersonaService_1.PersonaService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService])
    ], PropietarioAddComponent);
    return PropietarioAddComponent;
}());
exports.PropietarioAddComponent = PropietarioAddComponent;
//# sourceMappingURL=PropietarioAddComponent.js.map
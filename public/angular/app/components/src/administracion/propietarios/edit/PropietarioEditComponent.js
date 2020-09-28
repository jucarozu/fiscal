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
var PropietarioEditComponent = (function () {
    function PropietarioEditComponent(propietarioService, personaService, parametroService, auditoriaService, notificationService) {
        this.propietarioService = propietarioService;
        this.personaService = personaService;
        this.parametroService = parametroService;
        this.auditoriaService = auditoriaService;
        this.notificationService = notificationService;
        this.isLoading = false;
        this.accionAudit = 3; // Editar
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
    PropietarioEditComponent.prototype.ngOnInit = function () {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
        this.agregarEventos();
        this.cargarCombos();
    };
    PropietarioEditComponent.prototype.agregarEventos = function () {
        jQuery('#edit-propietario').on('show.bs.modal', function () {
            jQuery('#btn-reset-edit').click();
        });
        jQuery('#add-persona').on('hide.bs.modal', function () {
            jQuery('#btn-load-persona-edit').click();
            jQuery('#btn-load-locatario-edit').click();
        });
    };
    PropietarioEditComponent.prototype.cargarCombos = function () {
        var _this = this;
        this.parametroService.getByGrupo(this.gpTipoDocumento).then(function (documentos) { _this.documentos = documentos; });
        this.parametroService.getByGrupo(this.gpFuente).then(function (fuentes) { _this.fuentes = fuentes; });
        this.parametroService.getByGrupo(this.gpTipoPropietario).then(function (tipos_prop) { _this.tipos_prop = tipos_prop; });
    };
    PropietarioEditComponent.prototype.convertPlacaToUpper = function () {
        this.propietarioForm.placa = this.propietarioForm.placa.toUpperCase();
    };
    PropietarioEditComponent.prototype.mostrarLocatario = function () {
        if (this.propietarioForm.tipo == 2) {
            document.getElementById('locatario-edit').style.display = 'block';
        }
        else {
            this.propietarioForm.locatario = null;
            this.propietarioForm.loc_tipo_doc = null;
            this.propietarioForm.loc_numero_doc = "";
            this.propietarioForm.loc_nombres_apellidos = "";
            document.getElementById('locatario-edit').style.display = 'none';
        }
    };
    PropietarioEditComponent.prototype.cargarPersona = function () {
        var _this = this;
        this.personaService.getByDocumento(this.propietarioForm.tipo_doc, this.propietarioForm.numero_doc)
            .then(function (persona) {
            if (persona != null) {
                _this.propietarioForm.persona = persona.persona;
                _this.propietarioForm.nombres_apellidos = persona.nombres_apellidos;
            }
        });
    };
    PropietarioEditComponent.prototype.getPersonaByDocumento = function () {
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
    PropietarioEditComponent.prototype.cargarLocatario = function () {
        var _this = this;
        this.personaService.getByDocumento(this.propietarioForm.loc_tipo_doc, this.propietarioForm.loc_numero_doc)
            .then(function (persona) {
            if (persona != null) {
                _this.propietarioForm.locatario = persona.persona;
                _this.propietarioForm.loc_nombres_apellidos = persona.nombres_apellidos;
            }
        });
    };
    PropietarioEditComponent.prototype.getLocatarioByDocumento = function () {
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
    PropietarioEditComponent.prototype.actualizar = function () {
        var _this = this;
        this.isLoading = true;
        this.resetErrores();
        var propietarioString = this.generarPropietarioString(this.propietarioForm);
        this.propietarioService.update(propietarioString, this.propietarioForm.propietario).then(function (res) {
            _this.auditar(res.propietario);
            _this.isLoading = false;
            _this.notificationService.success("Operación exitosa", "El propietario fue modificado correctamente.");
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
                _this.errores.push("Ha ocurrido un error al modificar el propietario.");
            }
        });
    };
    PropietarioEditComponent.prototype.generarPropietarioString = function (propietario) {
        return '&persona=' + (propietario.persona != null ? propietario.persona : '') +
            '&fuente=' + (propietario.fuente != null ? propietario.fuente : '') +
            '&tipo=' + (propietario.tipo != null ? propietario.tipo : '') +
            '&locatario=' + (propietario.locatario != null ? propietario.locatario : '') +
            '&desde=' + (propietario.desde != null ? propietario.desde : '') +
            '&hasta=' + (propietario.hasta != null ? propietario.hasta : '') +
            '&usuario=' + this.userLogin.usuario;
    };
    PropietarioEditComponent.prototype.auditar = function (propietario) {
        try {
            var propietarioAudit = this.generarPropietarioAudit(propietario);
            this.auditoriaService.insert(this.opcion.opcion, this.accionAudit, propietarioAudit);
            return true;
        }
        catch (error) {
            return false;
        }
    };
    PropietarioEditComponent.prototype.generarPropietarioAudit = function (propietario) {
        var propietarioAudit = {
            propietario: propietario['propietario'],
            persona: propietario['persona'],
            fuente: propietario['fuente'],
            tipo: propietario['tipo'],
            locatario: propietario['locatario'],
            desde: propietario['desde'],
            hasta: propietario['hasta']
        };
        return JSON.stringify(propietarioAudit);
    };
    PropietarioEditComponent.prototype.resetFormulario = function () {
        var _this = this;
        this.isLoading = true;
        this.propietarioService.getById(this.propietarioForm.propietario).then(function (propietario) {
            _this.propietarioForm = propietario;
            document.getElementById('locatario-edit').style.display = _this.propietarioForm.tipo == 2 ? 'block' : 'none';
            _this.isLoading = false;
        });
        this.personaForm = JSON.parse('{' +
            ' "tipo_doc" : null,' +
            ' "numero_doc" : ""' +
            '}');
        this.resetErrores();
    };
    PropietarioEditComponent.prototype.resetErrores = function () {
        this.errores = [];
    };
    PropietarioEditComponent.prototype.cerrarVentana = function () {
        jQuery('#edit-propietario').modal('hide');
    };
    PropietarioEditComponent.prototype.close = function () {
        this.resetErrores();
        this.cerrarVentana();
    };
    PropietarioEditComponent.prototype.loading = function () {
        return this.isLoading;
    };
    __decorate([
        core_1.Input('propietario'), 
        __metadata('design:type', Object)
    ], PropietarioEditComponent.prototype, "propietarioForm", void 0);
    PropietarioEditComponent = __decorate([
        core_1.Component({
            selector: 'propietario-edit',
            templateUrl: './app/components/src/administracion/propietarios/edit/propietario-edit.html',
            bindings: [PropietarioService_1.PropietarioService, PersonaService_1.PersonaService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService],
            directives: [
                components_2.SimpleNotificationsComponent
            ]
        }), 
        __metadata('design:paramtypes', [PropietarioService_1.PropietarioService, PersonaService_1.PersonaService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService])
    ], PropietarioEditComponent);
    return PropietarioEditComponent;
}());
exports.PropietarioEditComponent = PropietarioEditComponent;
//# sourceMappingURL=PropietarioEditComponent.js.map
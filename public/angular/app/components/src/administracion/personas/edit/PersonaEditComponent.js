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
var PersonaService_1 = require("../../../../../services/PersonaService");
var DivipoService_1 = require("../../../../../services/DivipoService");
var ParametroService_1 = require("../../../../../services/ParametroService");
var AuditoriaService_1 = require("../../../../../services/AuditoriaService");
var components_1 = require('angular2-notifications/components');
var components_2 = require('angular2-notifications/components');
var PersonaEditComponent = (function () {
    function PersonaEditComponent(personaService, divipoService, parametroService, auditoriaService, notificationService) {
        this.personaService = personaService;
        this.divipoService = divipoService;
        this.parametroService = parametroService;
        this.auditoriaService = auditoriaService;
        this.notificationService = notificationService;
        this.isLoading = false;
        this.accionAudit = 3; // Editar
        this.gpTipoDocumento = 1;
        this.gpGenero = 2;
        this.gpGrupoSanguineo = 3;
        this.errores = [];
        this.departamentos = [];
        this.municipios = [];
        this.documentos = [];
        this.generos = [];
        this.gruposSanguineos = [];
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
    PersonaEditComponent.prototype.ngOnInit = function () {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
        this.agregarEventos();
        this.cargarCombos();
    };
    PersonaEditComponent.prototype.agregarEventos = function () {
        jQuery('#edit-persona').on('show.bs.modal', function () {
            jQuery('#btn-reset').click();
        });
    };
    PersonaEditComponent.prototype.cargarCombos = function () {
        var _this = this;
        this.divipoService.getDepartamentos().then(function (departamentos) { _this.departamentos = departamentos; });
        this.parametroService.getByGrupo(this.gpTipoDocumento).then(function (documentos) { _this.documentos = documentos; });
        this.parametroService.getByGrupo(this.gpGenero).then(function (generos) { _this.generos = generos; });
        this.parametroService.getByGrupo(this.gpGrupoSanguineo).then(function (gruposSanguineos) { _this.gruposSanguineos = gruposSanguineos; });
    };
    PersonaEditComponent.prototype.cargarMunicipios = function (cod_departamento) {
        var _this = this;
        this.isLoading = true;
        if (cod_departamento != null) {
            this.divipoService.getMunicipios(cod_departamento).then(function (municipios) {
                _this.municipios = municipios;
                _this.isLoading = false;
            });
        }
        else {
            this.municipios = null;
            this.isLoading = false;
        }
    };
    PersonaEditComponent.prototype.actualizar = function () {
        var _this = this;
        this.isLoading = true;
        this.resetErrores();
        var personaString = this.generarPersonaString(this.personaForm);
        this.personaService.update(personaString, this.personaForm.persona).then(function (res) {
            _this.auditar(res.persona);
            _this.isLoading = false;
            _this.notificationService.success("Operación exitosa", "La persona fue modificada correctamente.");
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
                _this.errores.push("Ha ocurrido un error al modificar la persona.");
            }
        });
    };
    PersonaEditComponent.prototype.generarPersonaString = function (persona) {
        return '&persona=' + persona.persona +
            '&fecha_exped_doc=' + (persona.fecha_exped_doc != null ? persona.fecha_exped_doc : '') +
            '&divipo_doc=' + (persona.cod_municipio_doc != null ? persona.cod_municipio_doc + '000' : '') +
            '&nombres=' + (persona.nombres != null ? persona.nombres : '') +
            '&apellidos=' + (persona.apellidos != null ? persona.apellidos : '') +
            '&email=' + (persona.email != null ? persona.email : '') +
            '&genero=' + (persona.genero != null ? persona.genero : '') +
            '&grupo_sanguineo=' + (persona.grupo_sanguineo != null ? persona.grupo_sanguineo : '') +
            '&numero_celular=' + (persona.numero_celular != null ? persona.numero_celular : '');
    };
    PersonaEditComponent.prototype.auditar = function (persona) {
        try {
            var personaAudit = this.generarPersonaAudit(persona);
            this.auditoriaService.insert(this.opcion.opcion, this.accionAudit, personaAudit);
            return true;
        }
        catch (error) {
            return false;
        }
    };
    PersonaEditComponent.prototype.generarPersonaAudit = function (persona) {
        var personaAudit = {
            persona: persona['persona'],
            fecha_exped_doc: persona['fecha_exped_doc'],
            divipo_doc: persona['divipo_doc'],
            nombres: persona['nombres'],
            apellidos: persona['apellidos'],
            email: persona['email'],
            genero: persona['genero'],
            grupo_sanguineo: persona['grupo_sanguineo'],
            numero_celular: persona['numero_celular']
        };
        return JSON.stringify(personaAudit);
    };
    PersonaEditComponent.prototype.resetFormulario = function () {
        var _this = this;
        this.personaForm.cod_municipio_doc = null;
        this.personaService.getById(this.personaForm.persona).then(function (persona) {
            _this.personaForm = persona;
            _this.cargarMunicipios(persona.cod_departamento_doc);
        });
    };
    PersonaEditComponent.prototype.resetErrores = function () {
        this.errores = [];
    };
    PersonaEditComponent.prototype.cerrarVentana = function () {
        jQuery('#edit-persona').modal('hide');
    };
    PersonaEditComponent.prototype.close = function () {
        this.resetErrores();
        this.cerrarVentana();
    };
    PersonaEditComponent.prototype.loading = function () {
        return this.isLoading;
    };
    __decorate([
        core_1.Input('persona'), 
        __metadata('design:type', Object)
    ], PersonaEditComponent.prototype, "personaForm", void 0);
    PersonaEditComponent = __decorate([
        core_1.Component({
            selector: 'persona-edit',
            templateUrl: './app/components/src/administracion/personas/edit/persona-edit.html',
            bindings: [PersonaService_1.PersonaService, DivipoService_1.DivipoService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService],
            directives: [components_2.SimpleNotificationsComponent]
        }), 
        __metadata('design:paramtypes', [PersonaService_1.PersonaService, DivipoService_1.DivipoService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService])
    ], PersonaEditComponent);
    return PersonaEditComponent;
}());
exports.PersonaEditComponent = PersonaEditComponent;
//# sourceMappingURL=PersonaEditComponent.js.map
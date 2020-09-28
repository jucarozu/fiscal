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
var PersonaAddComponent = (function () {
    function PersonaAddComponent(personaService, divipoService, parametroService, auditoriaService, notificationService) {
        this.personaService = personaService;
        this.divipoService = divipoService;
        this.parametroService = parametroService;
        this.auditoriaService = auditoriaService;
        this.notificationService = notificationService;
        this.isLoading = false;
        this.accionAudit = 2; // Adicionar
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
    PersonaAddComponent.prototype.ngOnInit = function () {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
        this.resetFormulario();
        this.agregarEventos();
        this.cargarCombos();
    };
    PersonaAddComponent.prototype.agregarEventos = function () {
        jQuery('#add-persona').on('show.bs.modal', function () {
            jQuery('#btn-load-input').click();
        });
    };
    PersonaAddComponent.prototype.cargarCombos = function () {
        var _this = this;
        this.divipoService.getDepartamentos().then(function (departamentos) { _this.departamentos = departamentos; });
        this.parametroService.getByGrupo(this.gpTipoDocumento).then(function (documentos) { _this.documentos = documentos; });
        this.parametroService.getByGrupo(this.gpGenero).then(function (generos) { _this.generos = generos; });
        this.parametroService.getByGrupo(this.gpGrupoSanguineo).then(function (gruposSanguineos) { _this.gruposSanguineos = gruposSanguineos; });
    };
    PersonaAddComponent.prototype.cargarInput = function () {
        if (localStorage.getItem('input-persona') != null) {
            this.inputForm = JSON.parse(localStorage.getItem('input-persona'));
            localStorage.removeItem('input-persona');
            this.personaForm.tipo_doc = this.inputForm.tipo_doc;
            this.personaForm.numero_doc = this.inputForm.numero_doc;
        }
    };
    PersonaAddComponent.prototype.cargarMunicipios = function (cod_departamento) {
        var _this = this;
        if (cod_departamento != null) {
            this.divipoService.getMunicipios(cod_departamento).then(function (municipios) { _this.municipios = municipios; });
        }
        else {
            this.municipios = null;
        }
    };
    PersonaAddComponent.prototype.insertar = function () {
        var _this = this;
        this.isLoading = true;
        this.resetErrores();
        var personaString = this.generarPersonaString(this.personaForm);
        this.personaService.insert(personaString).then(function (res) {
            _this.auditar(res.persona);
            _this.isLoading = false;
            _this.notificationService.success("Operación exitosa", "La persona fue creada correctamente.");
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
                _this.errores.push("Ha ocurrido un error al crear la persona.");
            }
        });
    };
    PersonaAddComponent.prototype.generarPersonaString = function (persona) {
        return '&tipo_doc=' + (persona.tipo_doc != null ? persona.tipo_doc : '') +
            '&numero_doc=' + (persona.numero_doc != null ? persona.numero_doc : '') +
            '&fecha_exped_doc=' + (persona.fecha_exped_doc != null ? persona.fecha_exped_doc : '') +
            '&divipo_doc=' + (persona.cod_municipio_doc != null ? persona.cod_municipio_doc + '000' : '') +
            '&nombres=' + (persona.nombres != null ? persona.nombres : '') +
            '&apellidos=' + (persona.apellidos != null ? persona.apellidos : '') +
            '&email=' + (persona.email != null ? persona.email : '') +
            '&genero=' + (persona.genero != null ? persona.genero : '') +
            '&grupo_sanguineo=' + (persona.grupo_sanguineo != null ? persona.grupo_sanguineo : '') +
            '&numero_celular=' + (persona.numero_celular != null ? persona.numero_celular : '') +
            '&usuario_registra=' + this.userLogin.usuario;
    };
    PersonaAddComponent.prototype.auditar = function (persona) {
        try {
            var personaAudit = this.generarPersonaAudit(persona);
            this.auditoriaService.insert(this.opcion.opcion, this.accionAudit, personaAudit);
            return true;
        }
        catch (error) {
            return false;
        }
    };
    PersonaAddComponent.prototype.generarPersonaAudit = function (persona) {
        var personaAudit = {
            persona: persona['persona'],
            tipo_doc: persona['tipo_doc'],
            numero_doc: persona['numero_doc'],
            fecha_exped_doc: persona['fecha_exped_doc'],
            divipo_doc: persona['divipo_doc'],
            nombres: persona['nombres'],
            apellidos: persona['apellidos'],
            email: persona['email'],
            genero: persona['genero'],
            grupo_sanguineo: persona['grupo_sanguineo'],
            numero_celular: persona['numero_celular'],
            usuario_registra: persona['usuario_registra']
        };
        return JSON.stringify(personaAudit);
    };
    PersonaAddComponent.prototype.resetErrores = function () {
        this.errores = [];
    };
    PersonaAddComponent.prototype.resetFormulario = function () {
        this.personaForm = JSON.parse('{' +
            ' "tipo_doc" : null,' +
            ' "numero_doc" : "",' +
            ' "fecha_exped_doc" : "",' +
            ' "divipo_doc" : null,' +
            ' "cod_departamento_doc" : null,' +
            ' "cod_municipio_doc" : null,' +
            ' "nombres" : "",' +
            ' "apellidos" : "",' +
            ' "email" : "",' +
            ' "genero" : null,' +
            ' "grupo_sanguineo" : null,' +
            ' "numero_celular" : ""' +
            '}');
        jQuery('#fecha_exped_doc').val("");
        this.municipios = null;
    };
    PersonaAddComponent.prototype.cerrarVentana = function () {
        jQuery('#add-persona').modal('hide');
    };
    PersonaAddComponent.prototype.close = function () {
        this.resetErrores();
        this.resetFormulario();
        this.cerrarVentana();
    };
    PersonaAddComponent.prototype.loading = function () {
        return this.isLoading;
    };
    PersonaAddComponent = __decorate([
        core_1.Component({
            selector: 'persona-add',
            templateUrl: './app/components/src/administracion/personas/add/persona-add.html',
            bindings: [PersonaService_1.PersonaService, DivipoService_1.DivipoService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService],
            directives: [components_2.SimpleNotificationsComponent]
        }), 
        __metadata('design:paramtypes', [PersonaService_1.PersonaService, DivipoService_1.DivipoService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService])
    ], PersonaAddComponent);
    return PersonaAddComponent;
}());
exports.PersonaAddComponent = PersonaAddComponent;
//# sourceMappingURL=PersonaAddComponent.js.map
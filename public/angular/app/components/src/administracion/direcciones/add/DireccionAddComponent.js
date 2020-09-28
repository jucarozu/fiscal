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
var DireccionAddComponent = (function () {
    function DireccionAddComponent(direccionService, personaService, divipoService, parametroService, auditoriaService, notificationService) {
        this.direccionService = direccionService;
        this.personaService = personaService;
        this.divipoService = divipoService;
        this.parametroService = parametroService;
        this.auditoriaService = auditoriaService;
        this.notificationService = notificationService;
        this.isLoading = false;
        this.accionAudit = 2; // Adicionar
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
    DireccionAddComponent.prototype.ngOnInit = function () {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
        this.resetFormulario();
        this.agregarEventos();
        this.cargarCombos();
    };
    DireccionAddComponent.prototype.agregarEventos = function () {
        jQuery('#add-direccion').on('show.bs.modal', function () {
            jQuery('#btn-reset').click();
        });
        jQuery('#add-persona').on('hide.bs.modal', function () {
            jQuery('#btn-load-persona').click();
        });
    };
    DireccionAddComponent.prototype.cargarCombos = function () {
        var _this = this;
        this.divipoService.getDepartamentos().then(function (departamentos) { _this.departamentos = departamentos; });
        this.parametroService.getByGrupo(this.gpTipoDocumento).then(function (documentos) { _this.documentos = documentos; });
        this.parametroService.getByGrupo(this.gpFuente).then(function (fuentes) { _this.fuentes = fuentes; });
    };
    DireccionAddComponent.prototype.cargarPersona = function () {
        var _this = this;
        this.personaService.getByDocumento(this.direccionForm.tipo_doc, this.direccionForm.numero_doc)
            .then(function (persona) {
            if (persona != null) {
                _this.direccionForm.persona = persona.persona;
                _this.direccionForm.nombres_apellidos = persona.nombres_apellidos;
            }
        });
    };
    DireccionAddComponent.prototype.getPersonaByDocumento = function () {
        var _this = this;
        this.errores = [];
        if (this.direccionForm.tipo_doc == null)
            return;
        if (this.direccionForm.numero_doc == "")
            return;
        if (isNaN(Number(this.direccionForm.numero_doc))) {
            this.errores.push("El número de documento debe ser numérico.");
            return;
        }
        this.personaService.getByDocumento(this.direccionForm.tipo_doc, this.direccionForm.numero_doc)
            .then(function (persona) {
            _this.personaForm.tipo_doc = _this.direccionForm.tipo_doc;
            _this.personaForm.numero_doc = _this.direccionForm.numero_doc;
            if (persona != null) {
                _this.direccionForm.persona = persona.persona;
                _this.direccionForm.nombres_apellidos = persona.nombres_apellidos;
            }
            else {
                _this.direccionForm.persona = null;
                _this.direccionForm.nombres_apellidos = "";
                localStorage.setItem('input-persona', JSON.stringify(_this.personaForm));
                jQuery('#add-persona').modal({ backdrop: 'static' });
            }
        });
    };
    DireccionAddComponent.prototype.cargarMunicipios = function (cod_departamento) {
        var _this = this;
        this.municipios = null;
        this.direccionForm.cod_municipio = null;
        this.poblados = null;
        this.direccionForm.cod_poblado = null;
        if (cod_departamento != null) {
            this.divipoService.getMunicipios(cod_departamento)
                .then(function (municipios) {
                _this.municipios = municipios;
            });
        }
    };
    DireccionAddComponent.prototype.cargarPoblados = function (cod_municipio) {
        var _this = this;
        this.poblados = null;
        this.direccionForm.cod_poblado = null;
        if (cod_municipio != null) {
            this.divipoService.getPoblados(cod_municipio)
                .then(function (poblados) {
                _this.poblados = poblados;
                _this.direccionForm.cod_poblado = 0;
            });
        }
    };
    DireccionAddComponent.prototype.insertar = function () {
        var _this = this;
        this.isLoading = true;
        this.resetErrores();
        var direccionString = this.generarDireccionString(this.direccionForm);
        this.direccionService.insert(direccionString).then(function (res) {
            _this.auditar(res.direccion);
            _this.isLoading = false;
            jQuery('#nueva-direccion').val(res.direccion.direccion);
            _this.notificationService.success("Operación exitosa", "La dirección fue creada correctamente.");
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
                _this.errores.push("Ha ocurrido un error al crear la dirección.");
            }
            _this.isLoading = false;
        });
    };
    DireccionAddComponent.prototype.generarDireccionString = function (direccion) {
        var pad = '000';
        var cod_poblado = pad.substring(0, pad.length - direccion.cod_poblado.toString().length) + direccion.cod_poblado.toString();
        return '&persona=' + (direccion.persona != null ? direccion.persona : '') +
            '&fuente=' + (direccion.fuente != null ? direccion.fuente : '') +
            '&observaciones=' + (direccion.observaciones != null ? direccion.observaciones : '') +
            '&divipo=' + (direccion.cod_municipio + cod_poblado) +
            '&descripcion=' + (direccion.descripcion != null ? direccion.descripcion : '') +
            '&usuario=' + this.userLogin.usuario;
    };
    DireccionAddComponent.prototype.auditar = function (direccion) {
        try {
            var direccionAudit = this.generarDireccionAudit(direccion);
            this.auditoriaService.insert(this.opcion.opcion, this.accionAudit, direccionAudit);
            return true;
        }
        catch (error) {
            return false;
        }
    };
    DireccionAddComponent.prototype.generarDireccionAudit = function (direccion) {
        var direccionAudit = {
            direccion: direccion['direccion'],
            persona: direccion['persona'],
            fuente: direccion['fuente'],
            observaciones: direccion['observaciones'],
            divipo: direccion['divipo'],
            descripcion: direccion['descripcion'],
            fecha_registra: direccion['fecha_registra'],
            usuario: direccion['usuario']
        };
        return JSON.stringify(direccionAudit);
    };
    DireccionAddComponent.prototype.resetErrores = function () {
        this.errores = [];
    };
    DireccionAddComponent.prototype.resetFormulario = function () {
        if (this.personaForm == null) {
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
        }
        this.direccionForm = {
            direccion: null,
            persona: (this.personaForm != null ? this.personaForm.persona : null),
            tipo_doc: (this.personaForm != null ? this.personaForm.tipo_doc : null),
            tipo_doc_desc: null,
            numero_doc: (this.personaForm != null ? this.personaForm.numero_doc : ""),
            nombres: "",
            apellidos: "",
            nombres_apellidos: (this.personaForm != null ? this.personaForm.nombres_apellidos : ""),
            fuente: null,
            fuente_desc: "",
            observaciones: "",
            divipo: null,
            cod_departamento: null,
            departamento: "",
            cod_municipio: null,
            municipio: "",
            cod_poblado: null,
            poblado: null,
            descripcion: "",
            fecha_registra: "",
            usuario: null,
            usuario_desc: "",
            is_selected: null
        };
        this.resetErrores();
    };
    DireccionAddComponent.prototype.cerrarVentana = function () {
        jQuery('#add-direccion').modal('hide');
    };
    DireccionAddComponent.prototype.close = function () {
        this.resetErrores();
        this.resetFormulario();
        this.cerrarVentana();
    };
    DireccionAddComponent.prototype.loading = function () {
        return this.isLoading;
    };
    __decorate([
        core_1.Input('persona'), 
        __metadata('design:type', Object)
    ], DireccionAddComponent.prototype, "personaForm", void 0);
    DireccionAddComponent = __decorate([
        core_1.Component({
            selector: 'direccion-add',
            templateUrl: './app/components/src/administracion/direcciones/add/direccion-add.html',
            bindings: [DireccionService_1.DireccionService, PersonaService_1.PersonaService, DivipoService_1.DivipoService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService],
            directives: [
                components_2.SimpleNotificationsComponent
            ]
        }), 
        __metadata('design:paramtypes', [DireccionService_1.DireccionService, PersonaService_1.PersonaService, DivipoService_1.DivipoService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService])
    ], DireccionAddComponent);
    return DireccionAddComponent;
}());
exports.DireccionAddComponent = DireccionAddComponent;
//# sourceMappingURL=DireccionAddComponent.js.map
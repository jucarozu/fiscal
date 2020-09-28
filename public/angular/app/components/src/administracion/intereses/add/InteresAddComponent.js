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
var InteresService_1 = require("../../../../../services/InteresService");
var PersonaService_1 = require("../../../../../services/PersonaService");
var ParametroService_1 = require("../../../../../services/ParametroService");
var AuditoriaService_1 = require("../../../../../services/AuditoriaService");
var components_1 = require('angular2-notifications/components');
var components_2 = require('angular2-notifications/components');
var InteresAddComponent = (function () {
    function InteresAddComponent(interesService, personaService, parametroService, auditoriaService, notificationService) {
        this.interesService = interesService;
        this.personaService = personaService;
        this.parametroService = parametroService;
        this.auditoriaService = auditoriaService;
        this.notificationService = notificationService;
        this.isLoading = false;
        this.accionAudit = 2; // Adicionar
        this.gpTipoDocumento = 1;
        this.errores = [];
        this.documentos = [];
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
    InteresAddComponent.prototype.ngOnInit = function () {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
        this.resetFormulario();
        this.agregarEventos();
        this.cargarCombos();
    };
    InteresAddComponent.prototype.agregarEventos = function () {
        jQuery('#add-persona').on('hide.bs.modal', function () {
            jQuery('#btn-load-persona').click();
        });
    };
    InteresAddComponent.prototype.cargarCombos = function () {
        var _this = this;
        this.parametroService.getByGrupo(this.gpTipoDocumento).then(function (documentos) { _this.documentos = documentos; });
    };
    InteresAddComponent.prototype.cargarPersona = function () {
        var _this = this;
        this.personaService.getByDocumento(this.interesForm.ent_tipo_doc, this.interesForm.ent_numero_doc)
            .then(function (persona) {
            if (persona != null) {
                _this.interesForm.entidad = persona.persona;
                _this.interesForm.ent_nombre = persona.nombres_apellidos;
            }
        });
    };
    InteresAddComponent.prototype.getPersonaByDocumento = function () {
        var _this = this;
        this.errores = [];
        if (this.interesForm.ent_tipo_doc == null)
            return;
        if (this.interesForm.ent_numero_doc == "")
            return;
        if (isNaN(Number(this.interesForm.ent_numero_doc))) {
            this.errores.push("El número de documento debe ser numérico.");
            return;
        }
        this.personaService.getByDocumento(this.interesForm.ent_tipo_doc, this.interesForm.ent_numero_doc)
            .then(function (persona) {
            _this.personaForm.tipo_doc = _this.interesForm.ent_tipo_doc;
            _this.personaForm.numero_doc = _this.interesForm.ent_numero_doc;
            if (persona != null) {
                _this.interesForm.entidad = persona.persona;
                _this.interesForm.ent_nombre = persona.nombres_apellidos;
            }
            else {
                _this.interesForm.entidad = null;
                _this.interesForm.ent_nombre = "";
                localStorage.setItem('input-persona', JSON.stringify(_this.personaForm));
                jQuery('#add-persona').modal({ backdrop: 'static' });
            }
        });
    };
    InteresAddComponent.prototype.insertar = function () {
        var _this = this;
        this.isLoading = true;
        this.resetErrores();
        if (this.interesForm.desde > this.interesForm.hasta) {
            this.errores.push("La fecha inicial no puede ser mayor a la fecha final.");
            this.isLoading = false;
            return;
        }
        if (this.interesForm.desde < this.interesForm.fecha_resolucion) {
            this.errores.push("La fecha inicial debe ser mayor o igual a la fecha de resolución.");
            this.isLoading = false;
            return;
        }
        var interesString = this.generarInteresString(this.interesForm);
        this.interesService.insert(interesString).then(function (res) {
            _this.auditar(res.interes);
            _this.isLoading = false;
            _this.notificationService.success("Operación exitosa", "El interés de mora fue creado correctamente.");
            _this.resetFormulario();
            _this.cerrarVentana();
            _this.isLoading = false;
        }, function (error) {
            // Código de respuesta de Laravel cuando falla la validación
            if (error.status === 422) {
                var errores = error.json();
                for (var key in errores) {
                    _this.errores.push(errores[key]);
                }
            }
            else {
                _this.errores.push("Ha ocurrido un error al crear el interés de mora.");
            }
            _this.isLoading = false;
        });
    };
    InteresAddComponent.prototype.generarInteresString = function (interes) {
        return '&resolucion=' + (interes.resolucion != null ? interes.resolucion : '') +
            '&fecha_resolucion=' + (interes.fecha_resolucion != null ? interes.fecha_resolucion : '') +
            '&entidad=' + (interes.entidad != null ? interes.entidad : '') +
            '&desde=' + (interes.desde != null ? interes.desde : '') +
            '&hasta=' + (interes.hasta != null ? interes.hasta : '') +
            '&tasa=' + (interes.tasa != null ? interes.tasa : '') +
            '&usuario=' + this.userLogin.usuario;
    };
    InteresAddComponent.prototype.auditar = function (interes) {
        try {
            var interesAudit = this.generarInteresAudit(interes);
            this.auditoriaService.insert(this.opcion.opcion, this.accionAudit, interesAudit);
            return true;
        }
        catch (error) {
            return false;
        }
    };
    InteresAddComponent.prototype.generarInteresAudit = function (interes) {
        var interesAudit = {
            interes: interes['interes'],
            resolucion: interes['resolucion'],
            fecha_resolucion: interes['fecha_resolucion'],
            entidad: interes['entidad'],
            desde: interes['desde'],
            hasta: interes['hasta'],
            tasa: interes['tasa'],
            usuario: interes['usuario'],
            fecha_registra: interes['fecha_registra']
        };
        return JSON.stringify(interesAudit);
    };
    InteresAddComponent.prototype.resetErrores = function () {
        this.errores = [];
    };
    InteresAddComponent.prototype.resetFormulario = function () {
        this.interesForm = JSON.parse('{' +
            ' "resolucion" : "",' +
            ' "fecha_resolucion" : "",' +
            ' "entidad" : null,' +
            ' "ent_tipo_doc" : null,' +
            ' "ent_numero_doc" : "",' +
            ' "ent_nombre" : "",' +
            ' "desde" : "",' +
            ' "hasta" : "",' +
            ' "tasa" : null' +
            '}');
        jQuery('#desde, #hasta').val("");
        this.personaForm = JSON.parse('{' +
            ' "tipo_doc" : null,' +
            ' "numero_doc" : ""' +
            '}');
        this.resetErrores();
    };
    InteresAddComponent.prototype.cerrarVentana = function () {
        jQuery('#add-interes').modal('hide');
    };
    InteresAddComponent.prototype.close = function () {
        this.resetErrores();
        this.resetFormulario();
        this.cerrarVentana();
    };
    InteresAddComponent.prototype.loading = function () {
        return this.isLoading;
    };
    InteresAddComponent = __decorate([
        core_1.Component({
            selector: 'interes-add',
            templateUrl: './app/components/src/administracion/intereses/add/interes-add.html',
            bindings: [InteresService_1.InteresService, PersonaService_1.PersonaService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService],
            directives: [
                components_2.SimpleNotificationsComponent
            ]
        }), 
        __metadata('design:paramtypes', [InteresService_1.InteresService, PersonaService_1.PersonaService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService])
    ], InteresAddComponent);
    return InteresAddComponent;
}());
exports.InteresAddComponent = InteresAddComponent;
//# sourceMappingURL=InteresAddComponent.js.map
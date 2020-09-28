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
var router_deprecated_1 = require('@angular/router-deprecated');
var IsLoggedIn_1 = require('../../../../../constants/IsLoggedIn');
var AuthService_1 = require('../../../../../services/AuthService');
var PersonaService_1 = require("../../../../../services/PersonaService");
var ParametroService_1 = require("../../../../../services/ParametroService");
var AuditoriaService_1 = require("../../../../../services/AuditoriaService");
var PersonaAddComponent_1 = require("../add/PersonaAddComponent");
var PersonaDetailComponent_1 = require("../detail/PersonaDetailComponent");
var PersonaEditComponent_1 = require("../edit/PersonaEditComponent");
var primeng_1 = require('primeng/primeng');
var components_1 = require('angular2-notifications/components');
var components_2 = require('angular2-notifications/components');
var PersonaViewComponent = (function () {
    function PersonaViewComponent(router, authService, personaService, parametroService, auditoriaService, notificationService) {
        this.router = router;
        this.authService = authService;
        this.personaService = personaService;
        this.parametroService = parametroService;
        this.auditoriaService = auditoriaService;
        this.notificationService = notificationService;
        this.isLoading = false;
        this.accionAudit = 1; // Consultar
        this.gpTipoDocumento = 1;
        this.selectedPersona = {};
        this.documentos = [];
        this.notificationsOptions = {
            timeOut: 7000,
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
    PersonaViewComponent.prototype.ngOnInit = function () {
        if (!this.authService.authorize())
            this.router.navigate(['Perfil']);
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
        this.resetFilter();
        this.agregarEventos();
        this.cargarCombos();
        this.auditoriaService.insert(this.opcion.opcion, this.accionAudit);
    };
    PersonaViewComponent.prototype.agregarEventos = function () {
        jQuery('#edit-persona').on('hide.bs.modal', function () {
            jQuery('#btn-buscar').click();
        });
    };
    PersonaViewComponent.prototype.cargarCombos = function () {
        var _this = this;
        this.parametroService.getByGrupo(this.gpTipoDocumento).then(function (documentos) { _this.documentos = documentos; });
    };
    PersonaViewComponent.prototype.getPersonas = function () {
        var _this = this;
        if (this.personaFilter.numero_doc != "" || (this.personaFilter.nombres != "" && this.personaFilter.apellidos != "")) {
            this.isLoading = true;
            this.personaService.getByFilters(this.personaFilter.tipo_doc != null ? this.personaFilter.tipo_doc : 0, this.personaFilter.numero_doc != "" ? this.personaFilter.numero_doc : "0", this.personaFilter.nombres != "" ? this.personaFilter.nombres : "0", this.personaFilter.apellidos != "" ? this.personaFilter.apellidos : "0").then(function (personas) {
                _this.personas = personas;
                _this.isLoading = false;
            }).catch(function (error) {
                _this.notificationService.error("Error", "Ha ocurrido un error en la búsqueda de personas.");
                _this.isLoading = false;
            });
        }
        else {
            this.personas = null;
            this.notificationService.error("Atención", "Para realizar la búsqueda debe filtrar como mínimo por número de documento o por nombres y apellidos.");
        }
    };
    PersonaViewComponent.prototype.resetFilter = function () {
        this.personaFilter = JSON.parse('{' +
            ' "tipo_doc" : null,' +
            ' "numero_doc" : "",' +
            ' "nombres" : "",' +
            ' "apellidos" : ""' +
            '}');
    };
    PersonaViewComponent.prototype.selectPersona = function (persona) {
        this.selectedPersona = persona;
    };
    PersonaViewComponent.prototype.loading = function () {
        return this.isLoading;
    };
    PersonaViewComponent = __decorate([
        core_1.Component({
            selector: 'persona-view',
            templateUrl: './app/components/src/administracion/personas/view/persona-view.html',
            bindings: [AuthService_1.AuthService, PersonaService_1.PersonaService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService],
            directives: [
                router_deprecated_1.ROUTER_DIRECTIVES,
                PersonaAddComponent_1.PersonaAddComponent,
                PersonaDetailComponent_1.PersonaDetailComponent,
                PersonaEditComponent_1.PersonaEditComponent,
                primeng_1.DataTable, primeng_1.Column,
                components_2.SimpleNotificationsComponent
            ]
        }),
        router_deprecated_1.CanActivate(function (next, previous) {
            return IsLoggedIn_1.IsLoggedIn(next, previous);
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.Router, AuthService_1.AuthService, PersonaService_1.PersonaService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService])
    ], PersonaViewComponent);
    return PersonaViewComponent;
}());
exports.PersonaViewComponent = PersonaViewComponent;
//# sourceMappingURL=PersonaViewComponent.js.map
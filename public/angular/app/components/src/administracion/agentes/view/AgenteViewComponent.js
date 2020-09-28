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
var AgenteService_1 = require("../../../../../services/AgenteService");
var ParametroService_1 = require("../../../../../services/ParametroService");
var AuditoriaService_1 = require("../../../../../services/AuditoriaService");
var AgenteAddComponent_1 = require("../add/AgenteAddComponent");
var AgenteEditComponent_1 = require("../edit/AgenteEditComponent");
var AgenteDeleteComponent_1 = require("../delete/AgenteDeleteComponent");
var PersonaAddComponent_1 = require("../../../administracion/personas/add/PersonaAddComponent");
var primeng_1 = require('primeng/primeng');
var components_1 = require('angular2-notifications/components');
var components_2 = require('angular2-notifications/components');
var AgenteViewComponent = (function () {
    function AgenteViewComponent(router, authService, agenteService, parametroService, auditoriaService, notificationService) {
        this.router = router;
        this.authService = authService;
        this.agenteService = agenteService;
        this.parametroService = parametroService;
        this.auditoriaService = auditoriaService;
        this.notificationService = notificationService;
        this.isLoading = false;
        this.accionAudit = 1; // Consultar
        this.gpTipoDocumento = 1;
        this.gpEntidad = 10;
        this.gpEstado = 11;
        this.selectedAgente = {};
        this.documentos = [];
        this.entidades = [];
        this.estados = [];
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
    AgenteViewComponent.prototype.ngOnInit = function () {
        if (!this.authService.authorize())
            this.router.navigate(['Perfil']);
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
        this.resetFilter();
        this.getAgentes();
        this.agregarEventos();
        this.cargarCombos();
        this.auditoriaService.insert(this.opcion.opcion, this.accionAudit);
    };
    AgenteViewComponent.prototype.agregarEventos = function () {
        jQuery('#add-agente, #edit-agente').on('hide.bs.modal', function () {
            jQuery('#btn-buscar').click();
        });
    };
    AgenteViewComponent.prototype.cargarCombos = function () {
        var _this = this;
        this.parametroService.getByGrupo(this.gpTipoDocumento).then(function (documentos) { _this.documentos = documentos; });
        this.parametroService.getByGrupo(this.gpEntidad).then(function (entidades) { _this.entidades = entidades; });
        this.parametroService.getByGrupo(this.gpEstado).then(function (estados) { _this.estados = estados; });
    };
    AgenteViewComponent.prototype.getAgentes = function () {
        var _this = this;
        this.isLoading = true;
        this.agenteService.getByFilters(this.agenteFilter.entidad != null ? this.agenteFilter.entidad : 0, this.agenteFilter.placa != "" ? this.agenteFilter.placa : "0", this.agenteFilter.tipo_doc != null ? this.agenteFilter.tipo_doc : 0, this.agenteFilter.numero_doc != "" ? this.agenteFilter.numero_doc : "0", this.agenteFilter.nombres_apellidos != "" ? this.agenteFilter.nombres_apellidos : "0", this.agenteFilter.estado != null ? this.agenteFilter.estado : 0).then(function (agentes) {
            _this.agentes = agentes;
            _this.isLoading = false;
        }).catch(function (error) {
            _this.notificationService.error("Error", "Ha ocurrido un error en la búsqueda de agentes de tránsito.");
            _this.isLoading = false;
        });
    };
    AgenteViewComponent.prototype.resetFilter = function () {
        this.agenteFilter = JSON.parse('{' +
            ' "entidad" : null,' +
            ' "placa" : "",' +
            ' "tipo_doc" : null,' +
            ' "numero_doc" : "",' +
            ' "nombres_apellidos" : "",' +
            ' "estado" : null' +
            '}');
    };
    AgenteViewComponent.prototype.selectAgente = function (agente) {
        this.selectedAgente = agente;
    };
    AgenteViewComponent.prototype.loading = function () {
        return this.isLoading;
    };
    AgenteViewComponent = __decorate([
        core_1.Component({
            selector: 'agente-view',
            templateUrl: './app/components/src/administracion/agentes/view/agente-view.html',
            bindings: [AuthService_1.AuthService, AgenteService_1.AgenteService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService],
            directives: [
                router_deprecated_1.ROUTER_DIRECTIVES,
                AgenteAddComponent_1.AgenteAddComponent,
                AgenteEditComponent_1.AgenteEditComponent,
                AgenteDeleteComponent_1.AgenteDeleteComponent,
                PersonaAddComponent_1.PersonaAddComponent,
                primeng_1.DataTable, primeng_1.Column,
                components_2.SimpleNotificationsComponent
            ]
        }),
        router_deprecated_1.CanActivate(function (next, previous) {
            return IsLoggedIn_1.IsLoggedIn(next, previous);
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.Router, AuthService_1.AuthService, AgenteService_1.AgenteService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService])
    ], AgenteViewComponent);
    return AgenteViewComponent;
}());
exports.AgenteViewComponent = AgenteViewComponent;
//# sourceMappingURL=AgenteViewComponent.js.map
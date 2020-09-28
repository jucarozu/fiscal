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
var DireccionService_1 = require("../../../../../services/DireccionService");
var ParametroService_1 = require("../../../../../services/ParametroService");
var AuditoriaService_1 = require("../../../../../services/AuditoriaService");
var DireccionAddComponent_1 = require("../add/DireccionAddComponent");
var DireccionEditComponent_1 = require("../edit/DireccionEditComponent");
var PersonaAddComponent_1 = require("../../../administracion/personas/add/PersonaAddComponent");
var primeng_1 = require('primeng/primeng');
var components_1 = require('angular2-notifications/components');
var components_2 = require('angular2-notifications/components');
var DireccionViewComponent = (function () {
    function DireccionViewComponent(router, authService, direccionService, parametroService, auditoriaService, notificationService) {
        this.router = router;
        this.authService = authService;
        this.direccionService = direccionService;
        this.parametroService = parametroService;
        this.auditoriaService = auditoriaService;
        this.notificationService = notificationService;
        this.isLoading = false;
        this.accionAudit = 1; // Consultar
        this.gpTipoDocumento = 1;
        this.selectedDireccion = {};
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
    DireccionViewComponent.prototype.ngOnInit = function () {
        if (!this.authService.authorize())
            this.router.navigate(['Perfil']);
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
        this.resetFilter();
        this.agregarEventos();
        this.cargarCombos();
        this.auditoriaService.insert(this.opcion.opcion, this.accionAudit);
    };
    DireccionViewComponent.prototype.agregarEventos = function () {
        jQuery('#edit-direccion').on('hide.bs.modal', function () {
            jQuery('#btn-buscar').click();
        });
    };
    DireccionViewComponent.prototype.cargarCombos = function () {
        var _this = this;
        this.parametroService.getByGrupo(this.gpTipoDocumento).then(function (documentos) { _this.documentos = documentos; });
    };
    DireccionViewComponent.prototype.getDirecciones = function () {
        var _this = this;
        if (this.direccionFilter.numero_doc != "") {
            this.isLoading = true;
            this.direccionService.getByFilters(this.direccionFilter.tipo_doc != null ? this.direccionFilter.tipo_doc : 0, this.direccionFilter.numero_doc != "" ? this.direccionFilter.numero_doc : "0").then(function (direcciones) {
                _this.direcciones = direcciones;
                _this.isLoading = false;
            }).catch(function (error) {
                _this.notificationService.error("Error", "Ha ocurrido un error en la búsqueda de direcciones.");
                _this.isLoading = false;
            });
        }
        else {
            this.direcciones = null;
            this.notificationService.error("Atención", "Para realizar la búsqueda debe filtrar como mínimo por número de documento.");
        }
    };
    DireccionViewComponent.prototype.resetFilter = function () {
        this.direccionFilter = JSON.parse('{' +
            ' "tipo_doc" : null,' +
            ' "numero_doc" : ""' +
            '}');
    };
    DireccionViewComponent.prototype.selectDireccion = function (direccion) {
        this.selectedDireccion = direccion;
    };
    DireccionViewComponent.prototype.loading = function () {
        return this.isLoading;
    };
    DireccionViewComponent = __decorate([
        core_1.Component({
            selector: 'direccion-view',
            templateUrl: './app/components/src/administracion/direcciones/view/direccion-view.html',
            bindings: [AuthService_1.AuthService, DireccionService_1.DireccionService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService],
            directives: [
                router_deprecated_1.ROUTER_DIRECTIVES,
                DireccionAddComponent_1.DireccionAddComponent,
                DireccionEditComponent_1.DireccionEditComponent,
                PersonaAddComponent_1.PersonaAddComponent,
                primeng_1.DataTable, primeng_1.Column,
                components_2.SimpleNotificationsComponent
            ]
        }),
        router_deprecated_1.CanActivate(function (next, previous) {
            return IsLoggedIn_1.IsLoggedIn(next, previous);
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.Router, AuthService_1.AuthService, DireccionService_1.DireccionService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService])
    ], DireccionViewComponent);
    return DireccionViewComponent;
}());
exports.DireccionViewComponent = DireccionViewComponent;
//# sourceMappingURL=DireccionViewComponent.js.map
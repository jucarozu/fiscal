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
var FuenteService_1 = require("../../../../../services/FuenteService");
var ParametroService_1 = require("../../../../../services/ParametroService");
var AuditoriaService_1 = require("../../../../../services/AuditoriaService");
var FuenteAddComponent_1 = require("../add/FuenteAddComponent");
var FuenteEditComponent_1 = require("../edit/FuenteEditComponent");
var FuenteDetailComponent_1 = require("../detail/FuenteDetailComponent");
var PersonaAddComponent_1 = require("../../../administracion/personas/add/PersonaAddComponent");
var primeng_1 = require('primeng/primeng');
var components_1 = require('angular2-notifications/components');
var components_2 = require('angular2-notifications/components');
var core_2 = require('angular2-google-maps/core');
var FuenteViewComponent = (function () {
    function FuenteViewComponent(router, authService, fuenteService, parametroService, auditoriaService, notificationService) {
        this.router = router;
        this.authService = authService;
        this.fuenteService = fuenteService;
        this.parametroService = parametroService;
        this.auditoriaService = auditoriaService;
        this.notificationService = notificationService;
        this.isLoading = false;
        this.accionAudit = 1; // Consultar
        this.gpTipoFuente = 12;
        this.selectedFuente = {};
        this.tiposFuentes = [];
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
        this.zoom = 15;
        this.lat = 10.335733927654234;
        this.lng = -75.41285991668701;
    }
    FuenteViewComponent.prototype.ngOnInit = function () {
        if (!this.authService.authorize())
            this.router.navigate(['Perfil']);
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
        this.resetFilter();
        this.getFuentes();
        this.agregarEventos();
        this.cargarCombos();
        this.auditoriaService.insert(this.opcion.opcion, this.accionAudit);
    };
    FuenteViewComponent.prototype.agregarEventos = function () {
        jQuery('#add-fuente, #edit-fuente').on('hide.bs.modal', function () {
            jQuery('#btn-buscar').click();
        });
    };
    FuenteViewComponent.prototype.cargarCombos = function () {
        var _this = this;
        this.parametroService.getByGrupo(this.gpTipoFuente).then(function (tiposFuentes) { _this.tiposFuentes = tiposFuentes; });
    };
    FuenteViewComponent.prototype.getFuentes = function () {
        var _this = this;
        this.isLoading = true;
        this.resetFilter();
        this.fuenteService.getByFilters(this.fuenteFilter.tipo != null ? this.fuenteFilter.tipo : 0, this.fuenteFilter.nombre != "" ? this.fuenteFilter.nombre : "0", this.fuenteFilter.prov_nombre != "" ? this.fuenteFilter.prov_nombre : "0", this.fuenteFilter.referencia_ubicacion != "" ? this.fuenteFilter.referencia_ubicacion : "0").then(function (fuentes) {
            _this.fuentes = fuentes;
            for (var i in fuentes) {
                _this.fuentes[i].latitud = fuentes[i].latitud != null ? parseFloat(fuentes[i].latitud) : null;
                _this.fuentes[i].longitud = fuentes[i].longitud != null ? parseFloat(fuentes[i].longitud) : null;
            }
            _this.isLoading = false;
        }).catch(function (error) {
            _this.notificationService.error("Error", "Ha ocurrido un error en la búsqueda de fuentes de evidencias.");
            _this.isLoading = false;
        });
    };
    FuenteViewComponent.prototype.resetFilter = function () {
        this.fuenteFilter = JSON.parse('{' +
            ' "tipo" : null,' +
            ' "nombre" : "",' +
            ' "prov_nombre" : "",' +
            ' "referencia_ubicacion" : ""' +
            '}');
        this.zoom = 15;
        this.lat = 10.335733927654234;
        this.lng = -75.41285991668701;
    };
    FuenteViewComponent.prototype.selectFuente = function (fuente) {
        this.selectedFuente = fuente;
    };
    FuenteViewComponent.prototype.loading = function () {
        return this.isLoading;
    };
    FuenteViewComponent = __decorate([
        core_1.Component({
            selector: 'fuente-view',
            templateUrl: './app/components/src/administracion/fuentes/view/fuente-view.html',
            bindings: [AuthService_1.AuthService, FuenteService_1.FuenteService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService],
            directives: [
                router_deprecated_1.ROUTER_DIRECTIVES,
                FuenteAddComponent_1.FuenteAddComponent,
                FuenteEditComponent_1.FuenteEditComponent,
                FuenteDetailComponent_1.FuenteDetailComponent,
                PersonaAddComponent_1.PersonaAddComponent,
                primeng_1.DataTable, primeng_1.Column,
                components_2.SimpleNotificationsComponent,
                core_2.GOOGLE_MAPS_DIRECTIVES
            ]
        }),
        router_deprecated_1.CanActivate(function (next, previous) {
            return IsLoggedIn_1.IsLoggedIn(next, previous);
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.Router, AuthService_1.AuthService, FuenteService_1.FuenteService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService])
    ], FuenteViewComponent);
    return FuenteViewComponent;
}());
exports.FuenteViewComponent = FuenteViewComponent;
//# sourceMappingURL=FuenteViewComponent.js.map
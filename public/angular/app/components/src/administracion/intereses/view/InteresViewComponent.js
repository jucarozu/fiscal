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
var InteresService_1 = require("../../../../../services/InteresService");
var AuditoriaService_1 = require("../../../../../services/AuditoriaService");
var InteresAddComponent_1 = require("../add/InteresAddComponent");
var PersonaAddComponent_1 = require("../../../administracion/personas/add/PersonaAddComponent");
var primeng_1 = require('primeng/primeng');
var components_1 = require('angular2-notifications/components');
var components_2 = require('angular2-notifications/components');
var InteresViewComponent = (function () {
    function InteresViewComponent(router, authService, interesService, auditoriaService, notificationService) {
        this.router = router;
        this.authService = authService;
        this.interesService = interesService;
        this.auditoriaService = auditoriaService;
        this.notificationService = notificationService;
        this.isLoading = false;
        this.accionAudit = 1; // Consultar
        this.selectedInteres = {};
        this.interesFilter = {
            fecha_inicio: '',
            fecha_fin: ''
        };
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
    InteresViewComponent.prototype.ngOnInit = function () {
        if (!this.authService.authorize())
            this.router.navigate(['Perfil']);
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
        this.resetFilter();
        this.getIntereses();
        this.agregarEventos();
        this.auditoriaService.insert(this.opcion.opcion, this.accionAudit);
    };
    InteresViewComponent.prototype.agregarEventos = function () {
        jQuery('#add-interes').on('hide.bs.modal', function () {
            jQuery('#btn-buscar').click();
        });
    };
    InteresViewComponent.prototype.getIntereses = function () {
        var _this = this;
        this.isLoading = true;
        this.interesService.getByFilters(this.interesFilter.fecha_inicio != "" ? this.interesFilter.fecha_inicio : "0", this.interesFilter.fecha_fin != "" ? this.interesFilter.fecha_fin : "0").then(function (intereses) {
            _this.intereses = intereses;
            _this.isLoading = false;
        }).catch(function (error) {
            _this.notificationService.error("Error", "Ha ocurrido un error en la búsqueda de intereses de mora.");
            _this.isLoading = false;
        });
    };
    InteresViewComponent.prototype.resetFilter = function () {
        this.interesFilter = JSON.parse('{' +
            ' "fecha_inicio" : "",' +
            ' "fecha_fin" : ""' +
            '}');
    };
    InteresViewComponent.prototype.selectInteres = function (interes) {
        this.selectedInteres = interes;
    };
    InteresViewComponent.prototype.loading = function () {
        return this.isLoading;
    };
    InteresViewComponent = __decorate([
        core_1.Component({
            selector: 'interes-view',
            templateUrl: './app/components/src/administracion/intereses/view/interes-view.html',
            bindings: [AuthService_1.AuthService, InteresService_1.InteresService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService],
            directives: [
                router_deprecated_1.ROUTER_DIRECTIVES,
                InteresAddComponent_1.InteresAddComponent,
                PersonaAddComponent_1.PersonaAddComponent,
                primeng_1.DataTable, primeng_1.Column,
                components_2.SimpleNotificationsComponent
            ]
        }),
        router_deprecated_1.CanActivate(function (next, previous) {
            return IsLoggedIn_1.IsLoggedIn(next, previous);
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.Router, AuthService_1.AuthService, InteresService_1.InteresService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService])
    ], InteresViewComponent);
    return InteresViewComponent;
}());
exports.InteresViewComponent = InteresViewComponent;
//# sourceMappingURL=InteresViewComponent.js.map
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
var InfraccionService_1 = require("../../../../../services/InfraccionService");
var AuditoriaService_1 = require("../../../../../services/AuditoriaService");
var InfraccionAddComponent_1 = require("../add/InfraccionAddComponent");
var InfraccionEditComponent_1 = require("../edit/InfraccionEditComponent");
var primeng_1 = require('primeng/primeng');
var components_1 = require('angular2-notifications/components');
var components_2 = require('angular2-notifications/components');
var InfraccionViewComponent = (function () {
    function InfraccionViewComponent(router, authService, infraccionService, auditoriaService, notificationService) {
        this.router = router;
        this.authService = authService;
        this.infraccionService = infraccionService;
        this.auditoriaService = auditoriaService;
        this.notificationService = notificationService;
        this.isLoading = false;
        this.accionAudit = 1; // Consultar
        this.selectedInfraccion = {};
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
    InfraccionViewComponent.prototype.ngOnInit = function () {
        if (!this.authService.authorize())
            this.router.navigate(['Perfil']);
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
        this.resetFilter();
        this.getInfracciones();
        this.agregarEventos();
        this.auditoriaService.insert(this.opcion.opcion, this.accionAudit);
    };
    InfraccionViewComponent.prototype.agregarEventos = function () {
        jQuery('#add-infraccion, #edit-infraccion').on('hide.bs.modal', function () {
            jQuery('#btn-buscar').click();
        });
    };
    InfraccionViewComponent.prototype.getInfracciones = function () {
        var _this = this;
        this.isLoading = true;
        this.infraccionService.getByFilters(this.infraccionFilter.codigo != null ? this.infraccionFilter.codigo : 0, this.infraccionFilter.nombre_corto != "" ? this.infraccionFilter.nombre_corto : "0", this.infraccionFilter.descripcion != "" ? this.infraccionFilter.descripcion : "0").then(function (infracciones) {
            _this.infracciones = infracciones;
            _this.isLoading = false;
        }).catch(function (error) {
            _this.notificationService.error("Error", "Ha ocurrido un error en la búsqueda de infracciones.");
            _this.isLoading = false;
        });
    };
    InfraccionViewComponent.prototype.resetFilter = function () {
        this.infraccionFilter = JSON.parse('{' +
            ' "codigo" : null,' +
            ' "nombre_corto" : "",' +
            ' "descripcion" : ""' +
            '}');
    };
    InfraccionViewComponent.prototype.selectInfraccion = function (infraccion) {
        this.selectedInfraccion = infraccion;
    };
    InfraccionViewComponent.prototype.loading = function () {
        return this.isLoading;
    };
    InfraccionViewComponent = __decorate([
        core_1.Component({
            selector: 'infraccion-view',
            templateUrl: './app/components/src/administracion/infracciones/view/infraccion-view.html',
            bindings: [AuthService_1.AuthService, InfraccionService_1.InfraccionService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService],
            directives: [
                router_deprecated_1.ROUTER_DIRECTIVES,
                InfraccionAddComponent_1.InfraccionAddComponent,
                InfraccionEditComponent_1.InfraccionEditComponent,
                primeng_1.DataTable, primeng_1.Column,
                components_2.SimpleNotificationsComponent
            ]
        }),
        router_deprecated_1.CanActivate(function (next, previous) {
            return IsLoggedIn_1.IsLoggedIn(next, previous);
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.Router, AuthService_1.AuthService, InfraccionService_1.InfraccionService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService])
    ], InfraccionViewComponent);
    return InfraccionViewComponent;
}());
exports.InfraccionViewComponent = InfraccionViewComponent;
//# sourceMappingURL=InfraccionViewComponent.js.map
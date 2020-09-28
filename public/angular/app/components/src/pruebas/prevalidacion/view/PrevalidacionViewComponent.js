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
var PrevalidacionService_1 = require("../../../../../services/PrevalidacionService");
var FuenteService_1 = require("../../../../../services/FuenteService");
var ParametroService_1 = require("../../../../../services/ParametroService");
var AuditoriaService_1 = require("../../../../../services/AuditoriaService");
var primeng_1 = require('primeng/primeng');
var components_1 = require('angular2-notifications/components');
var components_2 = require('angular2-notifications/components');
var PrevalidacionViewComponent = (function () {
    function PrevalidacionViewComponent(router, authService, prevalidacionService, fuenteService, auditoriaService, notificationService) {
        this.router = router;
        this.authService = authService;
        this.prevalidacionService = prevalidacionService;
        this.fuenteService = fuenteService;
        this.auditoriaService = auditoriaService;
        this.notificationService = notificationService;
        this.isLoading = false;
        this.accionAudit = 1; // Consultar
        this.fuentes = [];
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
    PrevalidacionViewComponent.prototype.ngOnInit = function () {
        if (!this.authService.authorize())
            this.router.navigate(['Perfil']);
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
        this.resetFilter();
        this.getDetecciones();
        this.cargarCombos();
        this.auditoriaService.insert(this.opcion.opcion, this.accionAudit);
    };
    PrevalidacionViewComponent.prototype.cargarCombos = function () {
        var _this = this;
        this.fuenteService.get().then(function (fuentes) { _this.fuentes = fuentes; });
    };
    PrevalidacionViewComponent.prototype.getDetecciones = function () {
        var _this = this;
        this.isLoading = true;
        this.prevalidacionService.consultar(this.deteccionFilter.fuente != null ? this.deteccionFilter.fuente : 0).then(function (detecciones) {
            _this.detecciones = detecciones;
            _this.isLoading = false;
        }).catch(function (error) {
            _this.notificationService.error("Error", "Ha ocurrido un error en la búsqueda de detecciones por prevalidar.");
            _this.isLoading = false;
        });
    };
    PrevalidacionViewComponent.prototype.resetFilter = function () {
        this.deteccionFilter = JSON.parse('{' +
            ' "fuente" : null' +
            '}');
    };
    PrevalidacionViewComponent.prototype.loading = function () {
        return this.isLoading;
    };
    PrevalidacionViewComponent = __decorate([
        core_1.Component({
            selector: 'prevalidacion-view',
            templateUrl: './app/components/src/pruebas/prevalidacion/view/prevalidacion-view.html',
            bindings: [AuthService_1.AuthService, PrevalidacionService_1.PrevalidacionService, FuenteService_1.FuenteService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService],
            directives: [
                router_deprecated_1.ROUTER_DIRECTIVES,
                primeng_1.DataTable, primeng_1.Column,
                components_2.SimpleNotificationsComponent
            ]
        }),
        router_deprecated_1.CanActivate(function (next, previous) {
            return IsLoggedIn_1.IsLoggedIn(next, previous);
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.Router, AuthService_1.AuthService, PrevalidacionService_1.PrevalidacionService, FuenteService_1.FuenteService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService])
    ], PrevalidacionViewComponent);
    return PrevalidacionViewComponent;
}());
exports.PrevalidacionViewComponent = PrevalidacionViewComponent;
//# sourceMappingURL=PrevalidacionViewComponent.js.map
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
var PropietarioService_1 = require("../../../../../services/PropietarioService");
var ParametroService_1 = require("../../../../../services/ParametroService");
var AuditoriaService_1 = require("../../../../../services/AuditoriaService");
var PropietarioAddComponent_1 = require("../add/PropietarioAddComponent");
var PropietarioEditComponent_1 = require("../edit/PropietarioEditComponent");
var PersonaAddComponent_1 = require("../../../administracion/personas/add/PersonaAddComponent");
var primeng_1 = require('primeng/primeng');
var components_1 = require('angular2-notifications/components');
var components_2 = require('angular2-notifications/components');
var PropietarioViewComponent = (function () {
    function PropietarioViewComponent(router, authService, propietarioService, parametroService, auditoriaService, notificationService) {
        this.router = router;
        this.authService = authService;
        this.propietarioService = propietarioService;
        this.parametroService = parametroService;
        this.auditoriaService = auditoriaService;
        this.notificationService = notificationService;
        this.isLoading = false;
        this.accionAudit = 1; // Consultar
        this.gpTipoDocumento = 1;
        this.selectedPropietario = {};
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
    PropietarioViewComponent.prototype.ngOnInit = function () {
        if (!this.authService.authorize())
            this.router.navigate(['Perfil']);
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
        this.resetFilter();
        this.agregarEventos();
        this.cargarCombos();
        this.auditoriaService.insert(this.opcion.opcion, this.accionAudit);
    };
    PropietarioViewComponent.prototype.agregarEventos = function () {
        jQuery('#edit-propietario').on('hide.bs.modal', function () {
            jQuery('#btn-buscar').click();
        });
    };
    PropietarioViewComponent.prototype.cargarCombos = function () {
        var _this = this;
        this.parametroService.getByGrupo(this.gpTipoDocumento).then(function (documentos) { _this.documentos = documentos; });
    };
    PropietarioViewComponent.prototype.getPropietarios = function () {
        var _this = this;
        if (this.propietarioFilter.placa != "" || this.propietarioFilter.numero_doc != "") {
            this.isLoading = true;
            this.propietarioService.getByFilters(this.propietarioFilter.placa != "" ? this.propietarioFilter.placa : "0", this.propietarioFilter.tipo_doc != null ? this.propietarioFilter.tipo_doc : 0, this.propietarioFilter.numero_doc != "" ? this.propietarioFilter.numero_doc : "0").then(function (propietarios) {
                _this.propietarios = propietarios;
                _this.isLoading = false;
            }).catch(function (error) {
                _this.notificationService.error("Error", "Ha ocurrido un error en la búsqueda de propietarios.");
                _this.isLoading = false;
            });
        }
        else {
            this.propietarios = null;
            this.notificationService.error("Atención", "Para realizar la búsqueda debe filtrar como mínimo por placa o número de documento.");
        }
    };
    PropietarioViewComponent.prototype.resetFilter = function () {
        this.propietarioFilter = JSON.parse('{' +
            ' "placa" : "",' +
            ' "tipo_doc" : null,' +
            ' "numero_doc" : ""' +
            '}');
    };
    PropietarioViewComponent.prototype.selectPropietario = function (propietario) {
        this.selectedPropietario = propietario;
    };
    PropietarioViewComponent.prototype.loading = function () {
        return this.isLoading;
    };
    PropietarioViewComponent = __decorate([
        core_1.Component({
            selector: 'propietario-view',
            templateUrl: './app/components/src/administracion/propietarios/view/propietario-view.html',
            bindings: [AuthService_1.AuthService, PropietarioService_1.PropietarioService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService],
            directives: [
                router_deprecated_1.ROUTER_DIRECTIVES,
                PropietarioAddComponent_1.PropietarioAddComponent,
                PropietarioEditComponent_1.PropietarioEditComponent,
                PersonaAddComponent_1.PersonaAddComponent,
                primeng_1.DataTable, primeng_1.Column,
                components_2.SimpleNotificationsComponent
            ]
        }),
        router_deprecated_1.CanActivate(function (next, previous) {
            return IsLoggedIn_1.IsLoggedIn(next, previous);
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.Router, AuthService_1.AuthService, PropietarioService_1.PropietarioService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService])
    ], PropietarioViewComponent);
    return PropietarioViewComponent;
}());
exports.PropietarioViewComponent = PropietarioViewComponent;
//# sourceMappingURL=PropietarioViewComponent.js.map
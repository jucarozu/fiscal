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
var ParametroService_1 = require("../../../../../services/ParametroService");
var ComparendoService_1 = require("../../../../../services/ComparendoService");
var AuditoriaService_1 = require("../../../../../services/AuditoriaService");
//import { ComparendoDetalleComponent } from "../detalle/ComparendoDetalleComponent";
var SustitucionConductorComponent_1 = require("../../sustitucion-conductor/view/SustitucionConductorComponent");
var SustitucionSancionadoComponent_1 = require("../../sustitucion-conductor/sancionado/SustitucionSancionadoComponent");
var PersonaAddComponent_1 = require("../../../administracion/personas/add/PersonaAddComponent");
var primeng_1 = require('primeng/primeng');
var components_1 = require('angular2-notifications/components');
var components_2 = require('angular2-notifications/components');
var ComparendosViewComponent = (function () {
    function ComparendosViewComponent(router, authService, comparendoService, parametroService, auditoriaService, notificationService) {
        this.router = router;
        this.authService = authService;
        this.comparendoService = comparendoService;
        this.parametroService = parametroService;
        this.auditoriaService = auditoriaService;
        this.notificationService = notificationService;
        this.isLoading = false;
        this.accionAudit = 1; // Consultar
        this.gpTipoDocumento = 1;
        this.gpEstado = 37;
        this.selectedComparendo = {};
        this.documentos = [];
        this.estados = [];
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
    ComparendosViewComponent.prototype.ngOnInit = function () {
        if (!this.authService.authorize())
            this.router.navigate(['Perfil']);
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
        this.resetFilter();
        this.agregarEventos();
        this.cargarCombos();
        this.auditoriaService.insert(this.opcion.opcion, this.accionAudit);
    };
    ComparendosViewComponent.prototype.agregarEventos = function () {
        /*jQuery('#sustitucion-conductor').on('hide.bs.modal', function() {
            jQuery('#btn-buscar').click();
        });*/
    };
    ComparendosViewComponent.prototype.cargarCombos = function () {
        var _this = this;
        this.parametroService.getByGrupo(this.gpTipoDocumento).then(function (documentos) { _this.documentos = documentos; });
        this.parametroService.getByGrupo(this.gpEstado).then(function (estados) { _this.estados = estados; });
    };
    ComparendosViewComponent.prototype.getComparendos = function () {
        var _this = this;
        this.isLoading = true;
        this.comparendoService.getByFilters(this.comparendoFilter.numero != "" ? this.comparendoFilter.numero : "0", this.comparendoFilter.infr_tipo_doc != null ? this.comparendoFilter.infr_tipo_doc : 0, this.comparendoFilter.infr_numero_doc != "" ? this.comparendoFilter.infr_numero_doc : "0", this.comparendoFilter.estado != null ? this.comparendoFilter.estado : 0).then(function (comparendos) {
            _this.comparendos = comparendos;
            _this.isLoading = false;
        }).catch(function (error) {
            _this.notificationService.error("Error", "Ha ocurrido un error en la búsqueda de comparendos.");
            _this.isLoading = false;
        });
    };
    ComparendosViewComponent.prototype.resetFilter = function () {
        this.comparendoFilter = JSON.parse('{' +
            ' "numero" : "",' +
            ' "infr_tipo_doc" : null,' +
            ' "infr_numero_doc" : "",' +
            ' "estado" : null' +
            '}');
    };
    ComparendosViewComponent.prototype.selectComparendo = function (comparendo) {
        this.selectedComparendo = comparendo;
    };
    ComparendosViewComponent.prototype.loading = function () {
        return this.isLoading;
    };
    ComparendosViewComponent = __decorate([
        core_1.Component({
            selector: 'comparendos-view',
            templateUrl: './app/components/src/comparendos/comparendos/view/comparendos-view.html',
            bindings: [AuthService_1.AuthService, ComparendoService_1.ComparendoService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService],
            directives: [
                //ComparendoDetalleComponent,
                SustitucionConductorComponent_1.SustitucionConductorComponent,
                SustitucionSancionadoComponent_1.SustitucionSancionadoComponent,
                PersonaAddComponent_1.PersonaAddComponent,
                primeng_1.DataTable, primeng_1.Column,
                components_2.SimpleNotificationsComponent
            ]
        }),
        router_deprecated_1.CanActivate(function (next, previous) {
            return IsLoggedIn_1.IsLoggedIn(next, previous);
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.Router, AuthService_1.AuthService, ComparendoService_1.ComparendoService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService])
    ], ComparendosViewComponent);
    return ComparendosViewComponent;
}());
exports.ComparendosViewComponent = ComparendosViewComponent;
//# sourceMappingURL=ComparendosViewComponent.js.map
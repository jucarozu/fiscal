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
var NotificacionService_1 = require("../../../../../services/NotificacionService");
var ParametroService_1 = require("../../../../../services/ParametroService");
var ComparendoService_1 = require("../../../../../services/ComparendoService");
var AuditoriaService_1 = require("../../../../../services/AuditoriaService");
var EnviosDetalleComponent_1 = require("../detalle/EnviosDetalleComponent");
var EnviosEntregadoComponent_1 = require("../entregado/EnviosEntregadoComponent");
var EnviosDevueltoComponent_1 = require("../devuelto/EnviosDevueltoComponent");
var EnviosDescarteComponent_1 = require("../descarte/EnviosDescarteComponent");
var EnviosAnularComponent_1 = require("../anular/EnviosAnularComponent");
var EnviosColaComponent_1 = require("../cola/EnviosColaComponent");
var EnviosFijarComponent_1 = require("../fijar/EnviosFijarComponent");
var EnviosDesfijarComponent_1 = require("../desfijar/EnviosDesfijarComponent");
var DireccionAddComponent_1 = require("../../../administracion/direcciones/add/DireccionAddComponent");
var primeng_1 = require('primeng/primeng');
var components_1 = require('angular2-notifications/components');
var components_2 = require('angular2-notifications/components');
var EnviosViewComponent = (function () {
    function EnviosViewComponent(router, authService, notificacionService, comparendoService, parametroService, auditoriaService, notificationService) {
        this.router = router;
        this.authService = authService;
        this.notificacionService = notificacionService;
        this.comparendoService = comparendoService;
        this.parametroService = parametroService;
        this.auditoriaService = auditoriaService;
        this.notificationService = notificationService;
        this.isLoading = false;
        this.accionAudit = 1; // Consultar
        this.gpTipoNotif = 40;
        this.gpTipoDocumento = 1;
        this.gpEstado = 41;
        this.selectedNotificacion = {};
        this.tiposNotif = [];
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
    EnviosViewComponent.prototype.ngOnInit = function () {
        if (!this.authService.authorize())
            this.router.navigate(['Perfil']);
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
        this.resetFilter();
        this.agregarEventos();
        this.cargarCombos();
        this.getNotificaciones();
        this.auditoriaService.insert(this.opcion.opcion, this.accionAudit);
    };
    EnviosViewComponent.prototype.agregarEventos = function () {
        jQuery('#entregado-envios').on('hide.bs.modal', function () {
            jQuery('#btn-buscar').click();
        });
        jQuery('#devuelto-envios').on('hide.bs.modal', function () {
            jQuery('#btn-buscar').click();
        });
        jQuery('#descarte-envios').on('hide.bs.modal', function () {
            jQuery('#btn-buscar').click();
        });
        jQuery('#anular-envios').on('hide.bs.modal', function () {
            jQuery('#btn-buscar').click();
        });
        jQuery('#cola-envios').on('hide.bs.modal', function () {
            jQuery('#btn-buscar').click();
        });
        jQuery('#fijar-envios').on('hide.bs.modal', function () {
            jQuery('#btn-buscar').click();
        });
        jQuery('#desfijar-envios').on('hide.bs.modal', function () {
            jQuery('#btn-buscar').click();
        });
    };
    EnviosViewComponent.prototype.cargarCombos = function () {
        var _this = this;
        this.parametroService.getByGrupo(this.gpTipoNotif).then(function (tiposNotif) { _this.tiposNotif = tiposNotif; });
        this.parametroService.getByGrupo(this.gpTipoDocumento).then(function (documentos) { _this.documentos = documentos; });
        this.parametroService.getByGrupo(this.gpEstado).then(function (estados) { _this.estados = estados; });
    };
    EnviosViewComponent.prototype.getNotificaciones = function () {
        var _this = this;
        this.isLoading = true;
        this.notificacionService.getByFilters(this.envioFilter.notificacion != "" ? this.envioFilter.notificacion : "0", this.envioFilter.notif_tipo != null ? this.envioFilter.notif_tipo : 0, this.envioFilter.numero != "" ? this.envioFilter.numero : "0", this.envioFilter.notif_tipo_doc != null ? this.envioFilter.notif_tipo_doc : 0, this.envioFilter.notif_numero_doc != "" ? this.envioFilter.notif_numero_doc : "0", this.envioFilter.notif_estado != null ? this.envioFilter.notif_estado : 0).then(function (notificaciones) {
            _this.notificaciones = notificaciones;
            _this.isLoading = false;
        }).catch(function (error) {
            _this.notificationService.error("Error", "Ha ocurrido un error en la búsqueda de notificaciones.");
            _this.isLoading = false;
        });
    };
    EnviosViewComponent.prototype.resetFilter = function () {
        this.envioFilter = {
            notificacion: "",
            notif_tipo: null,
            numero: "",
            notif_tipo_doc: null,
            notif_numero_doc: "",
            notif_estado: 2 // Estado: Enviada
        };
    };
    EnviosViewComponent.prototype.selectNotificacion = function (notificacion) {
        this.selectedNotificacion = notificacion;
        this.personaForm = {
            persona: notificacion.notif_persona,
            tipo_doc: notificacion.notif_tipo_doc,
            tipo_doc_desc: notificacion.notif_tipo_doc_desc,
            numero_doc: notificacion.notif_numero_doc,
            fecha_exped_doc: null,
            divipo_doc: null,
            cod_departamento_doc: null,
            cod_municipio_doc: null,
            nombres: notificacion.notif_nombres,
            apellidos: notificacion.notif_apellidos,
            nombres_apellidos: notificacion.notif_nombres_apellidos,
            email: null,
            genero: null,
            genero_desc: null,
            grupo_sanguineo: null,
            grupo_sanguineo_desc: null,
            numero_celular: null,
            fecha_registro: null,
            usuario_registra: null,
            usuario_registra_desc: null
        };
    };
    EnviosViewComponent.prototype.loading = function () {
        return this.isLoading;
    };
    EnviosViewComponent = __decorate([
        core_1.Component({
            selector: 'envios-view',
            templateUrl: './app/components/src/comparendos/envios/view/envios-view.html',
            bindings: [AuthService_1.AuthService, NotificacionService_1.NotificacionService, ComparendoService_1.ComparendoService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService],
            directives: [
                EnviosDetalleComponent_1.EnviosDetalleComponent,
                EnviosEntregadoComponent_1.EnviosEntregadoComponent,
                EnviosDevueltoComponent_1.EnviosDevueltoComponent,
                EnviosDescarteComponent_1.EnviosDescarteComponent,
                EnviosAnularComponent_1.EnviosAnularComponent,
                EnviosColaComponent_1.EnviosColaComponent,
                EnviosFijarComponent_1.EnviosFijarComponent,
                EnviosDesfijarComponent_1.EnviosDesfijarComponent,
                DireccionAddComponent_1.DireccionAddComponent,
                primeng_1.DataTable, primeng_1.Column,
                components_2.SimpleNotificationsComponent
            ]
        }),
        router_deprecated_1.CanActivate(function (next, previous) {
            return IsLoggedIn_1.IsLoggedIn(next, previous);
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.Router, AuthService_1.AuthService, NotificacionService_1.NotificacionService, ComparendoService_1.ComparendoService, ParametroService_1.ParametroService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService])
    ], EnviosViewComponent);
    return EnviosViewComponent;
}());
exports.EnviosViewComponent = EnviosViewComponent;
//# sourceMappingURL=EnviosViewComponent.js.map
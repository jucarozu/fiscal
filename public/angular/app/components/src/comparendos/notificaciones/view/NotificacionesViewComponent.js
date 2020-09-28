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
var ComparendoService_1 = require("../../../../../services/ComparendoService");
var AgenteService_1 = require("../../../../../services/AgenteService");
var DivipoService_1 = require("../../../../../services/DivipoService");
var AuditoriaService_1 = require("../../../../../services/AuditoriaService");
var NotificacionesConfirmComponent_1 = require("../confirm/NotificacionesConfirmComponent");
var NotificacionesImpresoComponent_1 = require("../impreso/NotificacionesImpresoComponent");
var components_1 = require('angular2-notifications/components');
var components_2 = require('angular2-notifications/components');
var NotificacionesViewComponent = (function () {
    function NotificacionesViewComponent(router, authService, notificacionService, comparendoService, agenteService, divipoService, auditoriaService, notificationService) {
        this.router = router;
        this.authService = authService;
        this.notificacionService = notificacionService;
        this.comparendoService = comparendoService;
        this.agenteService = agenteService;
        this.divipoService = divipoService;
        this.auditoriaService = auditoriaService;
        this.notificationService = notificationService;
        this.isLoading = false;
        this.accionAudit = 2; // Adicionar
        this.agentes = [];
        this.agentesSinFirma = [];
        this.departamentos = [];
        this.municipios = [];
        this.errores = [];
        this.detalleEncabezados = [
            "Id notificación", "Fecha envío", "Medio", "Tipo documento", "Nro documento",
            "Tipo identificación", "Nro identificación", "Nombre", "Departamento", "Ciudad", "Dirección", "Teléfono", "Celular", "Email"
        ];
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
    NotificacionesViewComponent.prototype.ngOnInit = function () {
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
    NotificacionesViewComponent.prototype.agregarEventos = function () {
        jQuery('#confirm-notificaciones').on('hide.bs.modal', function () {
            if (jQuery('#is-confirm-notificaciones').val() == '1') {
                jQuery('#btn-insertar').click();
            }
        });
        jQuery('#impreso-notificaciones').on('hide.bs.modal', function () {
            if (jQuery('#is-impreso-notificaciones').val() == '1') {
                jQuery('#btn-marcar-impreso').click();
            }
        });
    };
    NotificacionesViewComponent.prototype.cargarCombos = function () {
        var _this = this;
        this.agenteService.get().then(function (agentes) { _this.agentes = agentes; });
        this.divipoService.getDepartamentos().then(function (departamentos) { _this.departamentos = departamentos; });
    };
    NotificacionesViewComponent.prototype.cargarMunicipios = function (cod_departamento) {
        var _this = this;
        this.municipios = null;
        if (cod_departamento != null) {
            this.divipoService.getMunicipios(cod_departamento).then(function (municipios) { _this.municipios = municipios; });
        }
    };
    NotificacionesViewComponent.prototype.validar = function () {
        var _this = this;
        if (this.notificacionFilter.imp_orden == null) {
            this.notificationService.error("Error", "Debe seleccionar el orden de impresión.");
            return;
        }
        if (this.notificacionFilter.imp_modo == null) {
            this.notificationService.error("Error", "Debe seleccionar el modo de impresión.");
            return;
        }
        this.isLoading = true;
        this.comparendoService.getComparendosPorNotificar(this.notificacionFilter.infra_desde != "" ? this.notificacionFilter.infra_desde : "0", this.notificacionFilter.infra_hasta != "" ? this.notificacionFilter.infra_hasta : "0", this.notificacionFilter.verifica_desde != "" ? this.notificacionFilter.verifica_desde : "0", this.notificacionFilter.verifica_hasta != "" ? this.notificacionFilter.verifica_hasta : "0", this.notificacionFilter.detec_sitio != "" ? this.notificacionFilter.detec_sitio : "0", this.notificacionFilter.detec_agente != null ? this.notificacionFilter.detec_agente : 0, this.notificacionFilter.dir_municipio != null ? this.notificacionFilter.dir_municipio : 0).then(function (comparendosPorNotificar) {
            if (comparendosPorNotificar.length == 0) {
                _this.notificationService.error("Error", "No se encontraron comparendos pendientes por notificar.");
                _this.isLoading = false;
                return;
            }
            _this.agentesSinFirma = comparendosPorNotificar.filter(function (comparendo) { return comparendo.agt_tiene_firma == "0"; });
            if (_this.agentesSinFirma.length > 0) {
                jQuery('#confirm-notificaciones').modal({ backdrop: 'static', keyboard: false });
                _this.isLoading = false;
            }
            else {
                _this.insertar();
            }
        }).catch(function (error) {
            _this.notificationService.error("Error", "Ha ocurrido un error en la búsqueda de notificaciones.");
            _this.isLoading = false;
        });
    };
    NotificacionesViewComponent.prototype.insertar = function () {
        var _this = this;
        var notificacionString = this.generarNotificacionString(this.notificacionFilter);
        this.notificacionService.insert(notificacionString).then(function (res) {
            _this.imprimir(_this.notificacionFilter.imp_orden, _this.notificacionFilter.imp_modo);
        }, function (error) {
            _this.notificationService.error("Error", JSON.parse(error._body).mensaje);
            _this.isLoading = false;
        });
    };
    NotificacionesViewComponent.prototype.imprimir = function (imp_orden, imp_modo) {
        var _this = this;
        this.notificacionService.imprimir(imp_orden, imp_modo).then(function (res) {
            _this.descargarResultado(res.pdfNotificaciones, res.detalleNotif);
        }, function (error) {
            _this.notificationService.error("Error", JSON.parse(error._body).mensaje);
            _this.isLoading = false;
        });
    };
    NotificacionesViewComponent.prototype.descargarResultado = function (pdfNotificaciones, detalleNotif) {
        var csvDetalle = this.exportDetalleToCSV(this.detalleEncabezados, detalleNotif);
        var zip = new JSZip();
        zip.file("notificaciones.pdf", decodeURIComponent(pdfNotificaciones), { base64: true });
        zip.file("detalle.csv", csvDetalle);
        zip.generateAsync({ type: "base64" }).then(function (base64) {
            var encodedUri = "data:application/zip;base64," + base64;
            var link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "resultado.zip");
            document.body.appendChild(link);
            link.click();
        });
        this.notificationService.success("Operación exitosa", "Las notificaciones han sido generadas correctamente.");
        jQuery('#impreso-notificaciones').modal({ backdrop: 'static', keyboard: false });
        this.isLoading = false;
    };
    NotificacionesViewComponent.prototype.exportDetalleToCSV = function (jsonEncabezados, jsonFilas) {
        var data = [];
        var csvContent = "";
        data.push([jsonEncabezados]);
        for (var i in jsonFilas) {
            data.push([jsonFilas[i]]);
        }
        data.forEach(function (infoArray, index) {
            var dataString = infoArray.join(",");
            csvContent += index < data.length ? dataString + "\n" : dataString;
        });
        return csvContent;
    };
    NotificacionesViewComponent.prototype.marcarImpreso = function () {
        var _this = this;
        this.notificacionService.marcarImpreso(this.userLogin.usuario).then(function (res) {
            _this.notificationService.success("Operación exitosa", "Las notificaciones han sido marcadas como impresas.");
        }, function (error) {
            _this.notificationService.error("Error", JSON.parse(error._body).mensaje);
        });
    };
    NotificacionesViewComponent.prototype.generarNotificacionString = function (notificacionFilter) {
        var json_notificacion = {};
        json_notificacion = {
            infra_desde: notificacionFilter.infra_desde != "" ? notificacionFilter.infra_desde : "0",
            infra_hasta: notificacionFilter.infra_hasta != "" ? notificacionFilter.infra_hasta : "0",
            verifica_desde: notificacionFilter.verifica_desde != "" ? notificacionFilter.verifica_desde : "0",
            verifica_hasta: notificacionFilter.verifica_hasta != "" ? notificacionFilter.verifica_hasta : "0",
            detec_sitio: notificacionFilter.detec_sitio != "" ? notificacionFilter.detec_sitio : "0",
            detec_agente: notificacionFilter.detec_agente != null ? notificacionFilter.detec_agente : 0,
            dir_divipo: notificacionFilter.dir_municipio != null ? notificacionFilter.dir_municipio : 0,
            usuario: this.userLogin.usuario
        };
        return '&notificacionFilter=' + JSON.stringify(json_notificacion).replace(/"/g, '\\"');
    };
    NotificacionesViewComponent.prototype.resetErrores = function () {
        this.errores = [];
    };
    NotificacionesViewComponent.prototype.resetFilter = function () {
        this.notificacionFilter = {
            infra_desde: "",
            infra_hasta: "",
            verifica_desde: "",
            verifica_hasta: "",
            detec_sitio: "",
            detec_agente: null,
            dir_departamento: null,
            dir_municipio: null,
            imp_orden: null,
            imp_modo: null
        };
        /*this.notificacionFilter = {
            infra_desde : "2017-06-01",
            infra_hasta : "2017-06-01",
            verifica_desde : "2017-06-22",
            verifica_hasta : "2017-06-22",
            detec_sitio : "Turbaco",
            detec_agente : 58,
            dir_departamento : 13,
            dir_municipio : 13001,
            imp_orden : 1,
            imp_modo : 1
        };*/
        this.municipios = null;
        this.resetErrores();
    };
    NotificacionesViewComponent.prototype.loading = function () {
        return this.isLoading;
    };
    NotificacionesViewComponent = __decorate([
        core_1.Component({
            selector: 'notificaciones-view',
            templateUrl: './app/components/src/comparendos/notificaciones/view/notificaciones-view.html',
            bindings: [AuthService_1.AuthService, NotificacionService_1.NotificacionService, ComparendoService_1.ComparendoService, AgenteService_1.AgenteService, DivipoService_1.DivipoService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService],
            directives: [
                NotificacionesConfirmComponent_1.NotificacionesConfirmComponent,
                NotificacionesImpresoComponent_1.NotificacionesImpresoComponent,
                components_2.SimpleNotificationsComponent
            ]
        }),
        router_deprecated_1.CanActivate(function (next, previous) {
            return IsLoggedIn_1.IsLoggedIn(next, previous);
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.Router, AuthService_1.AuthService, NotificacionService_1.NotificacionService, ComparendoService_1.ComparendoService, AgenteService_1.AgenteService, DivipoService_1.DivipoService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService])
    ], NotificacionesViewComponent);
    return NotificacionesViewComponent;
}());
exports.NotificacionesViewComponent = NotificacionesViewComponent;
//# sourceMappingURL=NotificacionesViewComponent.js.map
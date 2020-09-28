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
var IsLoggedIn_1 = require('../../../../constants/IsLoggedIn');
var AuthService_1 = require('../../../../services/AuthService');
var PlacasSinDatosService_1 = require("../../../../services/PlacasSinDatosService");
var AuditoriaService_1 = require("../../../../services/AuditoriaService");
var components_1 = require('angular2-notifications/components');
var components_2 = require('angular2-notifications/components');
var PlacasSinDatosComponent = (function () {
    function PlacasSinDatosComponent(router, authService, placasSinDatosService, auditoriaService, notificationService) {
        this.router = router;
        this.authService = authService;
        this.placasSinDatosService = placasSinDatosService;
        this.auditoriaService = auditoriaService;
        this.notificationService = notificationService;
        this.isLoading = false;
        this.accionAudit = 1; // Consultar
        this.cantPlacas = 0;
        this.csvPlacas = "";
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
    PlacasSinDatosComponent.prototype.ngOnInit = function () {
        if (!this.authService.authorize())
            this.router.navigate(['Perfil']);
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
        this.contarRegistros();
        this.auditoriaService.insert(this.opcion.opcion, this.accionAudit);
    };
    PlacasSinDatosComponent.prototype.contarRegistros = function () {
        var _this = this;
        this.isLoading = true;
        this.placasSinDatosService.count().then(function (cantPlacas) {
            _this.cantPlacas = cantPlacas;
            _this.isLoading = false;
        });
    };
    PlacasSinDatosComponent.prototype.descargar = function () {
        var _this = this;
        this.isLoading = true;
        this.placasSinDatosService.get().then(function (placas) {
            _this.csvPlacas = _this.exportToCSV(placas);
            var encodedUri = encodeURI(_this.csvPlacas);
            var link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "placas_sin_datos.csv");
            document.body.appendChild(link);
            link.click();
            _this.isLoading = false;
        });
    };
    PlacasSinDatosComponent.prototype.exportToCSV = function (objJson) {
        var data = [];
        var csvContent = "data:text/csv;charset=utf-8,";
        data.push(['PLACA']);
        for (var i in objJson) {
            data.push([objJson[i]['placa']]);
        }
        data.forEach(function (infoArray, index) {
            var dataString = infoArray.join(",");
            csvContent += index < data.length ? dataString + "\n" : dataString;
        });
        return csvContent;
    };
    PlacasSinDatosComponent.prototype.loading = function () {
        return this.isLoading;
    };
    PlacasSinDatosComponent = __decorate([
        core_1.Component({
            selector: 'placas-sin-datos-view',
            templateUrl: './app/components/src/pruebas/placas-sin-datos/placas-sin-datos-view.html',
            bindings: [AuthService_1.AuthService, PlacasSinDatosService_1.PlacasSinDatosService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService],
            directives: [
                components_2.SimpleNotificationsComponent
            ]
        }),
        router_deprecated_1.CanActivate(function (next, previous) {
            return IsLoggedIn_1.IsLoggedIn(next, previous);
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.Router, AuthService_1.AuthService, PlacasSinDatosService_1.PlacasSinDatosService, AuditoriaService_1.AuditoriaService, components_1.NotificationsService])
    ], PlacasSinDatosComponent);
    return PlacasSinDatosComponent;
}());
exports.PlacasSinDatosComponent = PlacasSinDatosComponent;
//# sourceMappingURL=PlacasSinDatosComponent.js.map
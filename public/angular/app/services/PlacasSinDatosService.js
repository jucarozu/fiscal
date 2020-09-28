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
var http_1 = require("@angular/http");
var core_1 = require("@angular/core");
var URL_APP_1 = require("../constants/URL_APP");
var PlacasSinDatosService = (function () {
    function PlacasSinDatosService(http) {
        this.http = http;
        this.url = URL_APP_1.URL_APP + "pruebas/placasSinDatos/";
        this.headers = new http_1.Headers;
        this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
        this.headers.append('X-Requested-With', 'XMLHttpRequest');
    }
    PlacasSinDatosService.prototype.get = function () {
        return this.http.get(this.url + "api/")
            .toPromise()
            .then(function (res) { return res.json().placas; });
    };
    PlacasSinDatosService.prototype.getById = function (id) {
        return this.http.get(this.url + "api/" + id)
            .toPromise()
            .then(function (res) { return res.json().placa; });
    };
    PlacasSinDatosService.prototype.count = function () {
        return this.http.get(this.url + "count/")
            .toPromise()
            .then(function (res) { return res.json().cantPlacas; });
    };
    PlacasSinDatosService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], PlacasSinDatosService);
    return PlacasSinDatosService;
}());
exports.PlacasSinDatosService = PlacasSinDatosService;
//# sourceMappingURL=PlacasSinDatosService.js.map
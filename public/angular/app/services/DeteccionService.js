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
var DeteccionService = (function () {
    function DeteccionService(http) {
        this.http = http;
        this.url = URL_APP_1.URL_APP + "pruebas/detecciones/";
        this.headers = new http_1.Headers;
        this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
        this.headers.append('X-Requested-With', 'XMLHttpRequest');
    }
    DeteccionService.prototype.get = function () {
        return this.http.get(this.url + "api/")
            .toPromise()
            .then(function (res) { return res.json().detecciones; });
    };
    DeteccionService.prototype.getById = function (id) {
        return this.http.get(this.url + "api/" + id)
            .toPromise()
            .then(function (res) { return res.json().deteccion; });
    };
    DeteccionService.prototype.insert = function (deteccion) {
        return this.http.post(this.url + "api/", deteccion, { headers: this.headers })
            .toPromise()
            .then(function (res) { return res.json(); })
            .catch(function (error) { return error.json(); });
    };
    DeteccionService.prototype.update = function (deteccion, id) {
        return this.http.patch(this.url + "api/" + id, deteccion, { headers: this.headers })
            .toPromise()
            .then(function (res) { return res.json(); });
    };
    DeteccionService.prototype.getByFilters = function (fuente, estado) {
        return this.http.get(this.url + "getByFilters/" + fuente + "/" + estado)
            .toPromise()
            .then(function (res) { return res.json().detecciones; });
    };
    DeteccionService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], DeteccionService);
    return DeteccionService;
}());
exports.DeteccionService = DeteccionService;
//# sourceMappingURL=DeteccionService.js.map
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
var ValidacionService = (function () {
    function ValidacionService(http) {
        this.http = http;
        this.url = URL_APP_1.URL_APP + "pruebas/validacion/";
        this.headers = new http_1.Headers;
        this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
        this.headers.append('X-Requested-With', 'XMLHttpRequest');
    }
    ValidacionService.prototype.consultar = function (fuente) {
        return this.http.get(this.url + "api/" + fuente)
            .toPromise()
            .then(function (res) { return res.json().detecciones; });
    };
    ValidacionService.prototype.validar = function (validacion) {
        return this.http.patch(this.url + "api/", validacion, { headers: this.headers })
            .toPromise()
            .then(function (res) { return res.json(); });
    };
    ValidacionService.prototype.descartar = function (validacion) {
        return this.http.patch(this.url + "api/descarte", validacion, { headers: this.headers })
            .toPromise()
            .then(function (res) { return res.json(); });
    };
    ValidacionService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], ValidacionService);
    return ValidacionService;
}());
exports.ValidacionService = ValidacionService;
//# sourceMappingURL=ValidacionService.js.map
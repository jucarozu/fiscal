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
var DivipoService = (function () {
    function DivipoService(http) {
        this.http = http;
        this.url = URL_APP_1.URL_APP + "administracion/divipos/";
        this.headers = new http_1.Headers;
        this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
        this.headers.append('X-Requested-With', 'XMLHttpRequest');
    }
    DivipoService.prototype.get = function () {
        return this.http.get(this.url + "api/")
            .toPromise()
            .then(function (res) { return res.json().divipos; });
    };
    DivipoService.prototype.getById = function (id) {
        return this.http.get(this.url + "api/" + id)
            .toPromise()
            .then(function (res) { return res.json().divipo; });
    };
    DivipoService.prototype.insert = function (divipo) {
        return this.http.post(this.url + "api/", divipo, { headers: this.headers })
            .toPromise()
            .then(function (res) { return res.json(); });
    };
    DivipoService.prototype.update = function (divipo, id) {
        return this.http.patch(this.url + "api/" + id, divipo, { headers: this.headers })
            .toPromise()
            .then(function (res) { return res.json(); });
    };
    DivipoService.prototype.getDepartamentos = function () {
        return this.http.get(this.url + "getDepartamentos/")
            .toPromise()
            .then(function (res) { return res.json().departamentos; });
    };
    DivipoService.prototype.getMunicipios = function (cod_departamento) {
        return this.http.get(this.url + "getMunicipios/" + cod_departamento)
            .toPromise()
            .then(function (res) { return res.json().municipios; });
    };
    DivipoService.prototype.getPoblados = function (cod_municipio) {
        return this.http.get(this.url + "getPoblados/" + cod_municipio)
            .toPromise()
            .then(function (res) { return res.json().poblados; });
    };
    DivipoService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], DivipoService);
    return DivipoService;
}());
exports.DivipoService = DivipoService;
//# sourceMappingURL=DivipoService.js.map
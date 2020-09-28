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
var ComparendoService = (function () {
    function ComparendoService(http) {
        this.http = http;
        this.url = URL_APP_1.URL_APP + "comparendos/comparendos/";
        this.headers = new http_1.Headers;
        this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
        this.headers.append('X-Requested-With', 'XMLHttpRequest');
    }
    ComparendoService.prototype.get = function () {
        return this.http.get(this.url + "api/")
            .toPromise()
            .then(function (res) { return res.json().comparendos; });
    };
    ComparendoService.prototype.getById = function (id) {
        return this.http.get(this.url + "api/" + id)
            .toPromise()
            .then(function (res) { return res.json().comparendo; });
    };
    ComparendoService.prototype.insert = function (comparendo) {
        return this.http.post(this.url + "api/", comparendo, { headers: this.headers })
            .toPromise()
            .then(function (res) { return res.json(); })
            .catch(function (error) { return error.json(); });
    };
    ComparendoService.prototype.update = function (comparendo, id) {
        return this.http.patch(this.url + "api/" + id, comparendo, { headers: this.headers })
            .toPromise()
            .then(function (res) { return res.json(); });
    };
    ComparendoService.prototype.sustituirConductor = function (sustitucionConductor) {
        return this.http.post(this.url + "sustituirConductor/", sustitucionConductor, { headers: this.headers })
            .toPromise()
            .then(function (res) { return res.json(); })
            .catch(function (error) { return error.json(); });
    };
    ComparendoService.prototype.getComparendosPorNotificar = function (infra_desde, infra_hasta, verifica_desde, verifica_hasta, detec_sitio, detec_agente, dir_divipo) {
        return this.http.get(this.url + "getComparendosPorNotificar/" + infra_desde + "/" + infra_hasta + "/" + verifica_desde + "/" + verifica_hasta + "/"
            + detec_sitio + "/" + detec_agente + "/" + dir_divipo)
            .toPromise()
            .then(function (res) { return res.json().comparendosPorNotificar; });
    };
    ComparendoService.prototype.getByFilters = function (numero, infr_tipo_doc, infr_numero_doc, estado) {
        return this.http.get(this.url + "getByFilters/" + numero + "/" + infr_tipo_doc + "/" + infr_numero_doc + "/" + estado)
            .toPromise()
            .then(function (res) { return res.json().comparendos; });
    };
    ComparendoService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], ComparendoService);
    return ComparendoService;
}());
exports.ComparendoService = ComparendoService;
//# sourceMappingURL=ComparendoService.js.map
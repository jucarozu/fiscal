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
var AgenteService = (function () {
    function AgenteService(http) {
        this.http = http;
        this.url = URL_APP_1.URL_APP + "administracion/agentes/";
        this.headers = new http_1.Headers;
        this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
        this.headers.append('X-Requested-With', 'XMLHttpRequest');
    }
    AgenteService.prototype.get = function () {
        return this.http.get(this.url + "api/")
            .toPromise()
            .then(function (res) { return res.json().agentes; });
    };
    AgenteService.prototype.getById = function (id) {
        return this.http.get(this.url + "api/" + id)
            .toPromise()
            .then(function (res) { return res.json().agente; });
    };
    AgenteService.prototype.insert = function (agente) {
        return this.http.post(this.url + "api/", agente, { headers: this.headers })
            .toPromise()
            .then(function (res) { return res.json(); });
    };
    AgenteService.prototype.update = function (agente, id) {
        return this.http.patch(this.url + "api/" + id, agente, { headers: this.headers })
            .toPromise()
            .then(function (res) { return res.json(); });
    };
    AgenteService.prototype.delete = function (id) {
        return this.http.delete(this.url + "api/" + id, { headers: this.headers })
            .toPromise()
            .then(function (res) { return res.json(); });
    };
    AgenteService.prototype.getByFilters = function (entidad, placa, tipo_doc, numero_doc, nombres_apellidos, estado) {
        return this.http.get(this.url + "getByFilters/" + entidad + "/" + placa + "/" + tipo_doc + "/" + numero_doc + "/" + nombres_apellidos + "/" + estado)
            .toPromise()
            .then(function (res) { return res.json().agentes; });
    };
    AgenteService.prototype.getByUsuario = function (usuario) {
        return this.http.get(this.url + "getByUsuario/" + usuario)
            .toPromise()
            .then(function (res) { return res.json().agente; });
    };
    AgenteService.prototype.mostrarFirma = function (persona) {
        return window.open(this.url + "mostrarFirma/" + persona);
    };
    AgenteService.prototype.borrarFirma = function () {
        return this.http.delete(this.url + "borrarFirma/", { headers: this.headers })
            .toPromise()
            .then(function (res) { return res.json(); });
    };
    AgenteService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], AgenteService);
    return AgenteService;
}());
exports.AgenteService = AgenteService;
//# sourceMappingURL=AgenteService.js.map
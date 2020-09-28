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
var PersonaService = (function () {
    function PersonaService(http) {
        this.http = http;
        this.url = URL_APP_1.URL_APP + "administracion/personas/";
        this.headers = new http_1.Headers;
        this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
        this.headers.append('X-Requested-With', 'XMLHttpRequest');
    }
    PersonaService.prototype.get = function () {
        return this.http.get(this.url + "api/")
            .toPromise()
            .then(function (res) { return res.json().personas; });
    };
    PersonaService.prototype.getById = function (id) {
        return this.http.get(this.url + "api/" + id)
            .toPromise()
            .then(function (res) { return res.json().persona; });
    };
    PersonaService.prototype.insert = function (persona) {
        return this.http.post(this.url + "api/", persona, { headers: this.headers })
            .toPromise()
            .then(function (res) { return res.json(); });
    };
    PersonaService.prototype.update = function (persona, id) {
        return this.http.patch(this.url + "api/" + id, persona, { headers: this.headers })
            .toPromise()
            .then(function (res) { return res.json(); });
    };
    PersonaService.prototype.getByFilters = function (tipo_doc, numero_doc, nombres, apellidos) {
        return this.http.get(this.url + "getByFilters/" + tipo_doc + "/" + numero_doc + "/" + nombres + "/" + apellidos)
            .toPromise()
            .then(function (res) { return res.json().personas; });
    };
    PersonaService.prototype.getByDocumento = function (tipo_doc, numero_doc) {
        return this.http.get(this.url + "getByDocumento/" + tipo_doc + "/" + numero_doc)
            .toPromise()
            .then(function (res) { return res.json().persona; });
    };
    PersonaService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], PersonaService);
    return PersonaService;
}());
exports.PersonaService = PersonaService;
//# sourceMappingURL=PersonaService.js.map
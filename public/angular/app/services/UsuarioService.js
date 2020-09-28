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
var UsuarioService = (function () {
    function UsuarioService(http) {
        this.http = http;
        this.url = URL_APP_1.URL_APP + "seguridad/usuarios/";
        this.headers = new http_1.Headers;
        this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
        this.headers.append('X-Requested-With', 'XMLHttpRequest');
    }
    UsuarioService.prototype.get = function () {
        return this.http.get(this.url + "api/")
            .toPromise()
            .then(function (res) { return res.json().usuarios; });
    };
    UsuarioService.prototype.getById = function (id) {
        return this.http.get(this.url + "api/" + id)
            .toPromise()
            .then(function (res) { return res.json().usuario; });
    };
    UsuarioService.prototype.insert = function (usuario) {
        return this.http.post(this.url + "api/", usuario, { headers: this.headers })
            .toPromise()
            .then(function (res) { return res.json(); });
    };
    UsuarioService.prototype.update = function (usuario, id) {
        return this.http.patch(this.url + "api/" + id, usuario, { headers: this.headers })
            .toPromise()
            .then(function (res) { return res.json(); });
    };
    UsuarioService.prototype.delete = function (id) {
        return this.http.delete(this.url + "api/" + id, { headers: this.headers })
            .toPromise()
            .then(function (res) { return res.json(); });
    };
    UsuarioService.prototype.getByPersona = function (persona) {
        return this.http.get(this.url + "getByPersona/" + persona)
            .toPromise()
            .then(function (res) { return res.json().usuario; });
    };
    UsuarioService.prototype.resetPassword = function (id) {
        return this.http.patch(this.url + "resetPassword/" + id, null, { headers: this.headers })
            .toPromise()
            .then(function (res) { return res.json(); });
    };
    UsuarioService.prototype.forcePassword = function (id) {
        return this.http.patch(this.url + "forcePassword/" + id, null, { headers: this.headers })
            .toPromise()
            .then(function (res) { return res.json(); });
    };
    UsuarioService.prototype.changePassword = function (password, id) {
        return this.http.patch(this.url + "changePassword/" + id, password, { headers: this.headers })
            .toPromise()
            .then(function (res) { return res.json(); });
    };
    UsuarioService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], UsuarioService);
    return UsuarioService;
}());
exports.UsuarioService = UsuarioService;
//# sourceMappingURL=UsuarioService.js.map
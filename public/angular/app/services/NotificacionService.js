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
var NotificacionService = (function () {
    function NotificacionService(http) {
        this.http = http;
        this.url = "http://localhost/fiscal/public/fiscalizacion/comparendos/notificaciones/";
        this.headers = new http_1.Headers;
        this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
        this.headers.append('X-Requested-With', 'XMLHttpRequest');
    }
    NotificacionService.prototype.get = function () {
        return this.http.get(this.url + "api")
            .toPromise()
            .then(function (res) { return res.json().notificaciones; });
    };
    NotificacionService.prototype.getById = function (id) {
        return this.http.get(this.url + "api/" + id)
            .toPromise()
            .then(function (res) { return res.json().notificacion; });
    };
    NotificacionService.prototype.insert = function (notificacionFilter) {
        return this.http.post(this.url + "api", notificacionFilter, { headers: this.headers })
            .toPromise()
            .then(function (res) { return res.json(); });
    };
    NotificacionService.prototype.update = function (notificacion, id) {
        return this.http.patch(this.url + "api/" + id, notificacion, { headers: this.headers })
            .toPromise()
            .then(function (res) { return res.json(); });
    };
    NotificacionService.prototype.getByFilters = function (notificacion, notif_tipo, numero, notif_tipo_doc, notif_numero_doc, estado) {
        return this.http.get(this.url + "getByFilters/" + notificacion + "/" + notif_tipo + "/" + numero + "/" + notif_tipo_doc + "/" + notif_numero_doc + "/" + estado)
            .toPromise()
            .then(function (res) { return res.json().notificaciones; });
    };
    NotificacionService.prototype.imprimir = function (imp_orden, imp_modo) {
        return this.http.get(this.url + "imprimir/" + imp_orden + "/" + imp_modo)
            .toPromise()
            .then(function (res) { return res.json(); });
    };
    NotificacionService.prototype.marcarImpreso = function (usuario_imprime) {
        return this.http.patch(this.url + "marcarImpreso", "&usuario_imprime=" + usuario_imprime, { headers: this.headers })
            .toPromise()
            .then(function (res) { return res.json(); });
    };
    NotificacionService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], NotificacionService);
    return NotificacionService;
}());
exports.NotificacionService = NotificacionService;
//# sourceMappingURL=NotificacionService.js.map
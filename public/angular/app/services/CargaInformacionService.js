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
var CargaInformacionService = (function () {
    function CargaInformacionService(http) {
        this.http = http;
        this.url = URL_APP_1.URL_APP + "administracion/cargaInformacion/";
        this.headers = new http_1.Headers;
        this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
        this.headers.append('X-Requested-With', 'XMLHttpRequest');
    }
    CargaInformacionService.prototype.insert = function (cargaInformacion) {
        return this.http.post(this.url + "api/", cargaInformacion, { headers: this.headers })
            .toPromise()
            .then(function (res) { return res.json(); });
    };
    CargaInformacionService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], CargaInformacionService);
    return CargaInformacionService;
}());
exports.CargaInformacionService = CargaInformacionService;
//# sourceMappingURL=CargaInformacionService.js.map
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
var core_1 = require("@angular/core");
var GeneralService = (function () {
    function GeneralService() {
    }
    GeneralService.prototype.getFechaActualYMD = function () {
        var fechaActual = new Date();
        var pad = '00';
        var mes = fechaActual.getMonth() + 1;
        var dia = fechaActual.getDate();
        var yyyy = fechaActual.getFullYear();
        var mm = pad.substring(0, pad.length - mes.toString().length) + mes.toString();
        var dd = pad.substring(0, pad.length - dia.toString().length) + dia.toString();
        return yyyy + '-' + mm + '-' + dd;
    };
    GeneralService.prototype.getFechaActualYMDHM = function () {
        var fechaActual = new Date();
        var pad = '00';
        var mes = fechaActual.getMonth() + 1;
        var dia = fechaActual.getDate();
        var horas = fechaActual.getHours();
        var minutos = fechaActual.getMinutes();
        var yyyy = fechaActual.getFullYear();
        var mm = pad.substring(0, pad.length - mes.toString().length) + mes.toString();
        var dd = pad.substring(0, pad.length - dia.toString().length) + dia.toString();
        var hh = pad.substring(0, pad.length - horas.toString().length) + horas.toString();
        var mi = pad.substring(0, pad.length - minutos.toString().length) + minutos.toString();
        return yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + mi;
    };
    GeneralService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], GeneralService);
    return GeneralService;
}());
exports.GeneralService = GeneralService;
//# sourceMappingURL=GeneralService.js.map
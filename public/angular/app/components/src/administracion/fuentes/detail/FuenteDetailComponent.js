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
var core_1 = require('@angular/core');
var FuenteService_1 = require("../../../../../services/FuenteService");
var ParametroService_1 = require("../../../../../services/ParametroService");
var core_2 = require('angular2-google-maps/core');
var FuenteDetailComponent = (function () {
    function FuenteDetailComponent(fuenteService, parametroService) {
        this.fuenteService = fuenteService;
        this.parametroService = parametroService;
        this.gpTipoFuente = 12;
        this.tiposFuentes = [];
    }
    FuenteDetailComponent.prototype.ngOnInit = function () {
        this.agregarEventos();
        this.cargarCombos();
        this.fuenteForm.latitud = 0.0;
        this.fuenteForm.longitud = 0.0;
    };
    FuenteDetailComponent.prototype.agregarEventos = function () {
        jQuery('#detail-fuente').on('shown.bs.modal', function () {
            jQuery('#btn-reset-detail').click();
            jQuery('#btn-load-mapa-detail').click();
        });
    };
    FuenteDetailComponent.prototype.cargarCombos = function () {
        var _this = this;
        this.parametroService.getByGrupo(this.gpTipoFuente).then(function (tiposFuentes) { _this.tiposFuentes = tiposFuentes; });
    };
    FuenteDetailComponent.prototype.resetFormulario = function () {
        var _this = this;
        this.fuenteService.getById(this.fuenteForm.fuente).then(function (fuente) {
            _this.fuenteForm = fuente;
            if (_this.fuenteForm.latitud != null && _this.fuenteForm.longitud != null) {
                _this.fuenteForm.latitud = parseFloat(_this.fuenteForm.latitud);
                _this.fuenteForm.longitud = parseFloat(_this.fuenteForm.longitud);
            }
        });
    };
    __decorate([
        core_1.Input('fuente'), 
        __metadata('design:type', Object)
    ], FuenteDetailComponent.prototype, "fuenteForm", void 0);
    FuenteDetailComponent = __decorate([
        core_1.Component({
            selector: 'fuente-detail',
            templateUrl: './app/components/src/administracion/fuentes/detail/fuente-detail.html',
            bindings: [FuenteService_1.FuenteService, ParametroService_1.ParametroService],
            directives: [
                core_2.GOOGLE_MAPS_DIRECTIVES
            ]
        }), 
        __metadata('design:paramtypes', [FuenteService_1.FuenteService, ParametroService_1.ParametroService])
    ], FuenteDetailComponent);
    return FuenteDetailComponent;
}());
exports.FuenteDetailComponent = FuenteDetailComponent;
//# sourceMappingURL=FuenteDetailComponent.js.map
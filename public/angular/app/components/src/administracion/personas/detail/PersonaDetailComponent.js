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
var DivipoService_1 = require("../../../../../services/DivipoService");
var ParametroService_1 = require("../../../../../services/ParametroService");
var PersonaDetailComponent = (function () {
    function PersonaDetailComponent(divipoService, parametroService) {
        this.divipoService = divipoService;
        this.parametroService = parametroService;
        this.isLoading = false;
        this.gpTipoDocumento = 1;
        this.gpGenero = 2;
        this.gpGrupoSanguineo = 3;
        this.departamentos = [];
        this.municipios = [];
        this.documentos = [];
        this.generos = [];
        this.gruposSanguineos = [];
    }
    PersonaDetailComponent.prototype.ngOnInit = function () {
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
        this.agregarEventos();
        this.cargarCombos();
    };
    PersonaDetailComponent.prototype.agregarEventos = function () {
        jQuery('#detail-persona').on('show.bs.modal', function () {
            jQuery('#btn-load-municipios').click();
        });
    };
    PersonaDetailComponent.prototype.cargarCombos = function () {
        var _this = this;
        this.divipoService.getDepartamentos().then(function (departamentos) { _this.departamentos = departamentos; });
        this.parametroService.getByGrupo(this.gpTipoDocumento).then(function (documentos) { _this.documentos = documentos; });
        this.parametroService.getByGrupo(this.gpGenero).then(function (generos) { _this.generos = generos; });
        this.parametroService.getByGrupo(this.gpGrupoSanguineo).then(function (gruposSanguineos) { _this.gruposSanguineos = gruposSanguineos; });
    };
    PersonaDetailComponent.prototype.cargarMunicipios = function (cod_departamento) {
        var _this = this;
        this.isLoading = true;
        if (cod_departamento != null) {
            this.divipoService.getMunicipios(cod_departamento).then(function (municipios) {
                _this.municipios = municipios;
                _this.isLoading = false;
            });
        }
        else {
            this.municipios = null;
            this.isLoading = false;
        }
    };
    PersonaDetailComponent.prototype.loading = function () {
        return this.isLoading;
    };
    __decorate([
        core_1.Input('persona'), 
        __metadata('design:type', Object)
    ], PersonaDetailComponent.prototype, "personaForm", void 0);
    PersonaDetailComponent = __decorate([
        core_1.Component({
            selector: 'persona-detail',
            templateUrl: './app/components/src/administracion/personas/detail/persona-detail.html',
            bindings: [DivipoService_1.DivipoService, ParametroService_1.ParametroService]
        }), 
        __metadata('design:paramtypes', [DivipoService_1.DivipoService, ParametroService_1.ParametroService])
    ], PersonaDetailComponent);
    return PersonaDetailComponent;
}());
exports.PersonaDetailComponent = PersonaDetailComponent;
//# sourceMappingURL=PersonaDetailComponent.js.map
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
var ParametroService_1 = require("../../../../../services/ParametroService");
var UsuarioDetailComponent = (function () {
    function UsuarioDetailComponent(parametroService) {
        this.parametroService = parametroService;
        this.gpTipoDocumento = 1;
        this.gpCargo = 4;
        this.documentos = [];
        this.cargos = [];
    }
    UsuarioDetailComponent.prototype.ngOnInit = function () {
        this.cargarCombos();
    };
    UsuarioDetailComponent.prototype.cargarCombos = function () {
        var _this = this;
        this.parametroService.getByGrupo(this.gpTipoDocumento).then(function (documentos) { _this.documentos = documentos; });
        this.parametroService.getByGrupo(this.gpCargo).then(function (cargos) { _this.cargos = cargos; });
    };
    __decorate([
        core_1.Input('usuario'), 
        __metadata('design:type', Object)
    ], UsuarioDetailComponent.prototype, "usuarioForm", void 0);
    UsuarioDetailComponent = __decorate([
        core_1.Component({
            selector: 'usuario-detail',
            templateUrl: './app/components/src/seguridad/usuarios/detail/usuario-detail.html',
            bindings: [ParametroService_1.ParametroService]
        }), 
        __metadata('design:paramtypes', [ParametroService_1.ParametroService])
    ], UsuarioDetailComponent);
    return UsuarioDetailComponent;
}());
exports.UsuarioDetailComponent = UsuarioDetailComponent;
//# sourceMappingURL=UsuarioDetailComponent.js.map
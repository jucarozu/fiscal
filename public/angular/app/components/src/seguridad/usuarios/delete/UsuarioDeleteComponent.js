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
var router_deprecated_1 = require('@angular/router-deprecated');
var UsuarioService_1 = require("../../../../../services/UsuarioService");
var UsuarioDeleteComponent = (function () {
    function UsuarioDeleteComponent(usuarioService) {
        this.usuarioService = usuarioService;
    }
    UsuarioDeleteComponent.prototype.inactivarUsuario = function (id) {
        this.usuarioService.delete(id);
        jQuery("#delete-usuario").modal("hide");
    };
    __decorate([
        core_1.Input('usuario'), 
        __metadata('design:type', Object)
    ], UsuarioDeleteComponent.prototype, "usuarioForm", void 0);
    UsuarioDeleteComponent = __decorate([
        core_1.Component({
            selector: 'usuario-delete',
            templateUrl: './app/components/src/seguridad/usuarios/delete/usuario-delete.html',
            bindings: [UsuarioService_1.UsuarioService],
            directives: [router_deprecated_1.ROUTER_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [UsuarioService_1.UsuarioService])
    ], UsuarioDeleteComponent);
    return UsuarioDeleteComponent;
}());
exports.UsuarioDeleteComponent = UsuarioDeleteComponent;
//# sourceMappingURL=UsuarioDeleteComponent.js.map
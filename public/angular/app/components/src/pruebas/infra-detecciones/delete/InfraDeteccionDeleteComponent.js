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
var InfraDeteccionService_1 = require("../../../../../services/InfraDeteccionService");
var InfraDeteccionDeleteComponent = (function () {
    function InfraDeteccionDeleteComponent(infraDeteccionService) {
        this.infraDeteccionService = infraDeteccionService;
    }
    InfraDeteccionDeleteComponent.prototype.ngOnInit = function () {
        this.agregarEventos();
    };
    InfraDeteccionDeleteComponent.prototype.eliminarInfraDeteccion = function (id) {
        this.infraDeteccionService.delete(id);
        jQuery("#delete-infra-deteccion").modal("hide");
    };
    InfraDeteccionDeleteComponent.prototype.agregarEventos = function () {
        jQuery('#delete-infra-deteccion').on('hide.bs.modal', function () {
            jQuery('#btn-load-infra-detecciones').click();
        });
    };
    __decorate([
        core_1.Input('infra-deteccion'), 
        __metadata('design:type', Object)
    ], InfraDeteccionDeleteComponent.prototype, "infraDeteccionForm", void 0);
    InfraDeteccionDeleteComponent = __decorate([
        core_1.Component({
            selector: 'infra-deteccion-delete',
            templateUrl: './app/components/src/pruebas/infra-detecciones/delete/infra-deteccion-delete.html',
            bindings: [InfraDeteccionService_1.InfraDeteccionService],
            directives: [router_deprecated_1.ROUTER_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [InfraDeteccionService_1.InfraDeteccionService])
    ], InfraDeteccionDeleteComponent);
    return InfraDeteccionDeleteComponent;
}());
exports.InfraDeteccionDeleteComponent = InfraDeteccionDeleteComponent;
//# sourceMappingURL=InfraDeteccionDeleteComponent.js.map
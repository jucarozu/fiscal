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
var AgenteService_1 = require("../../../../../services/AgenteService");
var UsuarioService_1 = require("../../../../../services/UsuarioService");
var components_1 = require('angular2-notifications/components');
var components_2 = require('angular2-notifications/components');
var AgenteDeleteComponent = (function () {
    function AgenteDeleteComponent(agenteService, usuarioService, notificationService) {
        this.agenteService = agenteService;
        this.usuarioService = usuarioService;
        this.notificationService = notificationService;
    }
    AgenteDeleteComponent.prototype.inactivarAgente = function (id) {
        var _this = this;
        this.agenteService.delete(id).then(function (res) {
            _this.usuarioService.delete(_this.agenteForm.usuario);
            jQuery("#delete-agente").modal("hide");
            jQuery("#edit-agente").modal("hide");
        });
    };
    __decorate([
        core_1.Input('agente'), 
        __metadata('design:type', Object)
    ], AgenteDeleteComponent.prototype, "agenteForm", void 0);
    AgenteDeleteComponent = __decorate([
        core_1.Component({
            selector: 'agente-delete',
            templateUrl: './app/components/src/administracion/agentes/delete/agente-delete.html',
            bindings: [AgenteService_1.AgenteService, UsuarioService_1.UsuarioService, components_1.NotificationsService],
            directives: [components_2.SimpleNotificationsComponent]
        }), 
        __metadata('design:paramtypes', [AgenteService_1.AgenteService, UsuarioService_1.UsuarioService, components_1.NotificationsService])
    ], AgenteDeleteComponent);
    return AgenteDeleteComponent;
}());
exports.AgenteDeleteComponent = AgenteDeleteComponent;
//# sourceMappingURL=AgenteDeleteComponent.js.map
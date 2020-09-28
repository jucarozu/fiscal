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
var NotificacionesImpresoComponent = (function () {
    function NotificacionesImpresoComponent() {
    }
    NotificacionesImpresoComponent.prototype.confirmar = function () {
        jQuery('#is-impreso-notificaciones').val('1');
        this.cerrarVentana();
    };
    NotificacionesImpresoComponent.prototype.cancelar = function () {
        jQuery('#is-impreso-notificaciones').val('0');
        this.cerrarVentana();
    };
    NotificacionesImpresoComponent.prototype.cerrarVentana = function () {
        jQuery('#impreso-notificaciones').modal('hide');
    };
    NotificacionesImpresoComponent = __decorate([
        core_1.Component({
            selector: 'notificaciones-impreso',
            templateUrl: './app/components/src/comparendos/notificaciones/impreso/notificaciones-impreso.html'
        }), 
        __metadata('design:paramtypes', [])
    ], NotificacionesImpresoComponent);
    return NotificacionesImpresoComponent;
}());
exports.NotificacionesImpresoComponent = NotificacionesImpresoComponent;
//# sourceMappingURL=NotificacionesImpresoComponent.js.map
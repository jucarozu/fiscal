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
var NotificacionService_1 = require("../../../../../services/NotificacionService");
var components_1 = require('angular2-notifications/components');
var components_2 = require('angular2-notifications/components');
var NotificacionesConfirmComponent = (function () {
    function NotificacionesConfirmComponent(router, notificacionService, notificationService) {
        this.router = router;
        this.notificacionService = notificacionService;
        this.notificationService = notificationService;
        this.isLoading = false;
        this.accionAudit = 2; // Insertar
        this.errores = [];
        this.notificationsOptions = {
            timeOut: 5000,
            lastOnBottom: false,
            clickToClose: true,
            maxLength: 0,
            maxStack: 7,
            showProgressBar: false,
            pauseOnHover: true,
            preventDuplicates: true,
            preventLastDuplicates: false
        };
    }
    NotificacionesConfirmComponent.prototype.ngOnInit = function () {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
    };
    NotificacionesConfirmComponent.prototype.confirmar = function () {
        jQuery('#is-confirm-notificaciones').val('1');
        this.cerrarVentana();
    };
    NotificacionesConfirmComponent.prototype.cancelar = function () {
        jQuery('#is-confirm-notificaciones').val('0');
        this.cerrarVentana();
    };
    NotificacionesConfirmComponent.prototype.cerrarVentana = function () {
        jQuery('#confirm-notificaciones').modal('hide');
    };
    NotificacionesConfirmComponent.prototype.loading = function () {
        return this.isLoading;
    };
    __decorate([
        core_1.Input('notificacionFilter'), 
        __metadata('design:type', Object)
    ], NotificacionesConfirmComponent.prototype, "notificacionFilter", void 0);
    __decorate([
        core_1.Input('agentesSinFirma'), 
        __metadata('design:type', Array)
    ], NotificacionesConfirmComponent.prototype, "agentesSinFirma", void 0);
    NotificacionesConfirmComponent = __decorate([
        core_1.Component({
            selector: 'notificaciones-confirm',
            templateUrl: './app/components/src/comparendos/notificaciones/confirm/notificaciones-confirm.html',
            bindings: [NotificacionService_1.NotificacionService, components_1.NotificationsService],
            directives: [
                components_2.SimpleNotificationsComponent
            ]
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.Router, NotificacionService_1.NotificacionService, components_1.NotificationsService])
    ], NotificacionesConfirmComponent);
    return NotificacionesConfirmComponent;
}());
exports.NotificacionesConfirmComponent = NotificacionesConfirmComponent;
//# sourceMappingURL=NotificacionesConfirmComponent.js.map
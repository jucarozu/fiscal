"use strict";
var AppInjector_1 = require('../constants/AppInjector');
var common_1 = require('@angular/common');
var Observable_1 = require('rxjs/Observable');
var angular2_jwt_1 = require('angular2-jwt');
var AuthService = (function () {
    function AuthService() {
        this.injector = AppInjector_1.AppInjector(); // Get the stored reference to the injector
        this.location = this.injector.get(common_1.Location);
    }
    // Verifica si el usuario tiene una sesión activa.
    AuthService.prototype.check = function () {
        return Observable_1.Observable.of(angular2_jwt_1.tokenNotExpired());
    };
    // Verifica si el usuario tiene permisos sobre una opción del menú.
    AuthService.prototype.authorize = function () {
        if (!angular2_jwt_1.tokenNotExpired()) {
            return false;
        }
        var menu = null;
        var opciones = null;
        var autorizadas = null;
        if (localStorage.getItem('menu') != null) {
            menu = JSON.parse(localStorage.getItem('menu'));
            for (var i in menu) {
                opciones = menu[i].opciones;
                for (var j in opciones) {
                    if (this.location.path() == opciones[j].ruta) {
                        return true;
                    }
                }
            }
        }
        return false;
    };
    return AuthService;
}());
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map
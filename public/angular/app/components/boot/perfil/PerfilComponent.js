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
var IsLoggedIn_1 = require('../../../constants/IsLoggedIn');
var PerfilComponent = (function () {
    function PerfilComponent() {
    }
    PerfilComponent.prototype.ngOnInit = function () {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));
    };
    PerfilComponent = __decorate([
        core_1.Component({
            selector: 'perfil',
            templateUrl: './app/components/boot/perfil/perfil.html'
        }),
        router_deprecated_1.CanActivate(function (next, previous) {
            return IsLoggedIn_1.IsLoggedIn(next, previous);
        }), 
        __metadata('design:paramtypes', [])
    ], PerfilComponent);
    return PerfilComponent;
}());
exports.PerfilComponent = PerfilComponent;
//# sourceMappingURL=PerfilComponent.js.map
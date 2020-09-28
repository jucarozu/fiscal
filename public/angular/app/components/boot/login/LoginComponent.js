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
var GeneralService_1 = require("../../../services/GeneralService");
var router_deprecated_1 = require('@angular/router-deprecated');
var http_1 = require('@angular/http');
var angular2_jwt_1 = require('angular2-jwt');
var components_1 = require('angular2-notifications/components');
var components_2 = require('angular2-notifications/components');
var LoginComponent = (function () {
    function LoginComponent(http, router, generalService, notificationService) {
        this.http = http;
        this.router = router;
        this.generalService = generalService;
        this.notificationService = notificationService;
        this.isLoading = false;
        this.jwtHelper = new angular2_jwt_1.JwtHelper();
        this.url = "http://localhost:8000/fiscalizacion/login/";
        this.headers = new http_1.Headers;
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
    LoginComponent.prototype.ngOnInit = function () {
        if (angular2_jwt_1.tokenNotExpired())
            this.router.navigate(['Perfil']);
        this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
        this.headers.append('X-Requested-With', 'XMLHttpRequest');
        if (this.loginForm == null) {
            this.loginForm = JSON.parse('{' +
                ' "login" : "",' +
                ' "password" : ""' +
                '}');
        }
    };
    LoginComponent.prototype.login = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.isLoading = true;
            localStorage.removeItem('id_token');
            localStorage.removeItem('user_login');
            localStorage.removeItem('menu');
            localStorage.removeItem('config_variables');
            localStorage.removeItem('is_force_password');
            var body = '&login=' + _this.loginForm.login +
                '&password=' + _this.loginForm.password;
            _this.http.post(_this.url, body, { headers: _this.headers })
                .subscribe(function (res) {
                localStorage.setItem('id_token', res.json().token);
                localStorage.setItem('user_login', JSON.stringify(res.json().user_login));
                localStorage.setItem('menu', JSON.stringify(res.json().menu));
                localStorage.setItem('config_variables', JSON.stringify(res.json().config_variables));
                _this.validarPassword(res.json().user_login.fecha_vence_passw);
                _this.isLoading = false;
                _this.router.navigate(['Perfil']);
            }, function (error) {
                _this.isLoading = false;
                switch (error.status) {
                    case 401:
                        _this.notificationService.error("Acceso denegado", "Usuario y/o contraseña inválidos.");
                        break;
                    case 403:
                        _this.notificationService.error("Acceso denegado", "El usuario no tiene un menú de opciones configurado.");
                        break;
                    case 500:
                        _this.notificationService.error("Acceso denegado", "Error al validar los datos del usuario.");
                        break;
                    default:
                        _this.notificationService.error("Acceso denegado", "Error " + error.status);
                        break;
                }
            });
        });
    };
    LoginComponent.prototype.validarPassword = function (fechaVencePassword) {
        if (fechaVencePassword != null) {
            if (new Date(fechaVencePassword) <= new Date(this.generalService.getFechaActualYMD())) {
                localStorage.setItem('is_force_password', true);
            }
        }
    };
    LoginComponent.prototype.loading = function () {
        return this.isLoading;
    };
    LoginComponent = __decorate([
        core_1.Component({
            selector: 'login',
            templateUrl: './app/components/boot/login/login.html',
            bindings: [GeneralService_1.GeneralService, components_1.NotificationsService],
            directives: [components_2.SimpleNotificationsComponent]
        }), 
        __metadata('design:paramtypes', [http_1.Http, router_deprecated_1.Router, GeneralService_1.GeneralService, components_1.NotificationsService])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=LoginComponent.js.map
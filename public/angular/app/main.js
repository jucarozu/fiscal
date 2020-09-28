"use strict";
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var router_deprecated_1 = require('@angular/router-deprecated');
var RouterComponent_1 = require('../app/components/boot/router/RouterComponent');
var http_1 = require('@angular/http');
var angular2_jwt_1 = require('angular2-jwt');
var AuthService_1 = require('../app/services/AuthService');
var AppInjector_1 = require('../app/constants/AppInjector');
require('rxjs/Rx');
var core_2 = require('angular2-google-maps/core');
platform_browser_dynamic_1.bootstrap(RouterComponent_1.RouterComponent, [
    core_2.GOOGLE_MAPS_PROVIDERS,
    core_1.provide(core_2.LazyMapsAPILoaderConfig, { useFactory: function () {
            var config = new core_2.LazyMapsAPILoaderConfig();
            config.apiKey = 'AIzaSyBRT9hHAE9dqyDmDAWAB5kOkCHBukh96fI';
            return config;
        } }),
    http_1.HTTP_PROVIDERS,
    router_deprecated_1.ROUTER_PROVIDERS,
    core_1.bind(common_1.LocationStrategy).toClass(common_1.HashLocationStrategy),
    core_1.provide(angular2_jwt_1.AuthConfig, { useFactory: function () {
            return new angular2_jwt_1.AuthConfig();
        } }),
    angular2_jwt_1.AuthHttp,
    AuthService_1.AuthService
]).then(function (appRef) {
    AppInjector_1.AppInjector(appRef.injector);
});
//# sourceMappingURL=main.js.map
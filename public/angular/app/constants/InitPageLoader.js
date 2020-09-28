"use strict";
var router_deprecated_1 = require('@angular/router-deprecated');
var AppInjector_1 = require('../constants/AppInjector');
var AuthService_1 = require('../services/AuthService');
exports.InitPageLoader = function (next, previous) {
    var injector = AppInjector_1.AppInjector(); // Get the stored reference to the injector
    var auth = injector.get(AuthService_1.AuthService);
    var router = injector.get(router_deprecated_1.Router);
    // Return a boolean or a promise that resolves a boolean
    return new Promise(function (resolve) {
        auth.check().subscribe(function (result) {
            if (result) {
                router.navigate(['Perfil']);
                resolve(true);
            }
            else {
                router.navigate(['Login']);
                resolve(false);
            }
        });
    });
};
//# sourceMappingURL=InitPageLoader.js.map
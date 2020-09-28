"use strict";
var appInjectorRef;
exports.AppInjector = function (injector) {
    if (injector) {
        appInjectorRef = injector;
    }
    return appInjectorRef;
};
//# sourceMappingURL=AppInjector.js.map
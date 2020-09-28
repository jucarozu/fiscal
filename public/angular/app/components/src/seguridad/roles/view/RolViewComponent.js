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
var IsLoggedIn_1 = require('../../../../../constants/IsLoggedIn');
var AuthService_1 = require('../../../../../services/AuthService');
var RolService_1 = require("../../../../../services/RolService");
var AuditoriaService_1 = require("../../../../../services/AuditoriaService");
var RolAddComponent_1 = require("../add/RolAddComponent");
var RolDetailComponent_1 = require("../detail/RolDetailComponent");
var RolEditComponent_1 = require("../edit/RolEditComponent");
var primeng_1 = require('primeng/primeng');
var RolViewComponent = (function () {
    function RolViewComponent(router, authService, rolService, auditoriaService) {
        this.router = router;
        this.authService = authService;
        this.rolService = rolService;
        this.auditoriaService = auditoriaService;
        this.isLoading = false;
        this.accionAudit = 1; // Consultar
        this.selectedRol = {};
    }
    RolViewComponent.prototype.ngOnInit = function () {
        if (!this.authService.authorize())
            this.router.navigate(['Perfil']);
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
        this.getRoles();
        this.agregarEventos();
        this.auditoriaService.insert(this.opcion.opcion, this.accionAudit);
    };
    RolViewComponent.prototype.agregarEventos = function () {
        // Eventos para refrescar la tabla al insertar o actualizar un rol.
        jQuery('#add-rol, #edit-rol').on('hidden.bs.modal', function () {
            jQuery('#btn-buscar').click();
        });
    };
    RolViewComponent.prototype.getRoles = function () {
        var _this = this;
        this.isLoading = true;
        this.rolService.get().then(function (roles) {
            _this.roles = roles;
            _this.isLoading = false;
        });
    };
    RolViewComponent.prototype.selectRol = function (rol) {
        this.selectedRol = rol;
    };
    RolViewComponent.prototype.loading = function () {
        return this.isLoading;
    };
    RolViewComponent = __decorate([
        core_1.Component({
            selector: 'rol-view',
            templateUrl: './app/components/src/seguridad/roles/view/rol-view.html',
            bindings: [AuthService_1.AuthService, RolService_1.RolService, AuditoriaService_1.AuditoriaService],
            directives: [
                router_deprecated_1.ROUTER_DIRECTIVES,
                RolAddComponent_1.RolAddComponent,
                RolDetailComponent_1.RolDetailComponent,
                RolEditComponent_1.RolEditComponent,
                primeng_1.DataTable, primeng_1.Column
            ]
        }),
        router_deprecated_1.CanActivate(function (next, previous) {
            return IsLoggedIn_1.IsLoggedIn(next, previous);
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.Router, AuthService_1.AuthService, RolService_1.RolService, AuditoriaService_1.AuditoriaService])
    ], RolViewComponent);
    return RolViewComponent;
}());
exports.RolViewComponent = RolViewComponent;
//# sourceMappingURL=RolViewComponent.js.map
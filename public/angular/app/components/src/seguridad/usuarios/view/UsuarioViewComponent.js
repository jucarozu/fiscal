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
var UsuarioService_1 = require("../../../../../services/UsuarioService");
var AuditoriaService_1 = require("../../../../../services/AuditoriaService");
var UsuarioAddComponent_1 = require("../add/UsuarioAddComponent");
var UsuarioDetailComponent_1 = require("../detail/UsuarioDetailComponent");
var UsuarioEditComponent_1 = require("../edit/UsuarioEditComponent");
var UsuarioDeleteComponent_1 = require("../delete/UsuarioDeleteComponent");
var PersonaAddComponent_1 = require("../../../administracion/personas/add/PersonaAddComponent");
var primeng_1 = require('primeng/primeng');
var UsuarioViewComponent = (function () {
    function UsuarioViewComponent(router, authService, usuarioService, auditoriaService) {
        this.router = router;
        this.authService = authService;
        this.usuarioService = usuarioService;
        this.auditoriaService = auditoriaService;
        this.isLoading = false;
        this.accionAudit = 1; // Consultar
        this.selectedUsuario = {};
    }
    UsuarioViewComponent.prototype.ngOnInit = function () {
        if (!this.authService.authorize())
            this.router.navigate(['Perfil']);
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
        this.getUsuarios();
        this.agregarEventos();
        this.auditoriaService.insert(this.opcion.opcion, this.accionAudit);
    };
    UsuarioViewComponent.prototype.agregarEventos = function () {
        // Eventos para refrescar la tabla al insertar o actualizar un usuario.
        jQuery('#add-usuario, #edit-usuario, #delete-usuario').on('hide.bs.modal', function () {
            jQuery('#btn-buscar').click();
        });
    };
    UsuarioViewComponent.prototype.getUsuarios = function () {
        var _this = this;
        this.isLoading = true;
        this.usuarioService.get().then(function (usuarios) {
            _this.usuarios = usuarios;
            _this.isLoading = false;
        });
    };
    UsuarioViewComponent.prototype.selectUsuario = function (usuario) {
        this.selectedUsuario = usuario;
    };
    UsuarioViewComponent.prototype.loading = function () {
        return this.isLoading;
    };
    UsuarioViewComponent = __decorate([
        core_1.Component({
            selector: 'usuario-view',
            templateUrl: './app/components/src/seguridad/usuarios/view/usuario-view.html',
            bindings: [AuthService_1.AuthService, UsuarioService_1.UsuarioService, AuditoriaService_1.AuditoriaService],
            directives: [
                router_deprecated_1.ROUTER_DIRECTIVES,
                UsuarioAddComponent_1.UsuarioAddComponent,
                UsuarioDetailComponent_1.UsuarioDetailComponent,
                UsuarioEditComponent_1.UsuarioEditComponent,
                UsuarioDeleteComponent_1.UsuarioDeleteComponent,
                PersonaAddComponent_1.PersonaAddComponent,
                primeng_1.DataTable, primeng_1.Column
            ]
        }),
        router_deprecated_1.CanActivate(function (next, previous) {
            return IsLoggedIn_1.IsLoggedIn(next, previous);
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.Router, AuthService_1.AuthService, UsuarioService_1.UsuarioService, AuditoriaService_1.AuditoriaService])
    ], UsuarioViewComponent);
    return UsuarioViewComponent;
}());
exports.UsuarioViewComponent = UsuarioViewComponent;
//# sourceMappingURL=UsuarioViewComponent.js.map
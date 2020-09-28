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
var common_1 = require('@angular/common');
var router_deprecated_1 = require('@angular/router-deprecated');
var angular2_jwt_1 = require('angular2-jwt');
var InitComponent_1 = require('../init/InitComponent');
var LoginComponent_1 = require('../login/LoginComponent');
var PerfilComponent_1 = require('../perfil/PerfilComponent');
var PasswordComponent_1 = require('../password/PasswordComponent');
var PersonaViewComponent_1 = require('../../src/administracion/personas/view/PersonaViewComponent');
var AgenteViewComponent_1 = require('../../src/administracion/agentes/view/AgenteViewComponent');
var FuenteViewComponent_1 = require('../../src/administracion/fuentes/view/FuenteViewComponent');
var InfraccionViewComponent_1 = require('../../src/administracion/infracciones/view/InfraccionViewComponent');
var InteresViewComponent_1 = require('../../src/administracion/intereses/view/InteresViewComponent');
var DireccionViewComponent_1 = require('../../src/administracion/direcciones/view/DireccionViewComponent');
var PropietarioViewComponent_1 = require('../../src/administracion/propietarios/view/PropietarioViewComponent');
var CargaInformacionComponent_1 = require('../../src/administracion/carga-informacion/CargaInformacionComponent');
var CargaPropietariosComponent_1 = require('../../src/administracion/carga-propietarios/CargaPropietariosComponent');
var NotificacionesViewComponent_1 = require('../../src/comparendos/notificaciones/view/NotificacionesViewComponent');
var EnviosViewComponent_1 = require('../../src/comparendos/envios/view/EnviosViewComponent');
var ComparendosViewComponent_1 = require('../../src/comparendos/comparendos/view/ComparendosViewComponent');
var CargaIndividualComponent_1 = require('../../src/pruebas/carga-individual/CargaIndividualComponent');
var PlacasSinDatosComponent_1 = require('../../src/pruebas/placas-sin-datos/PlacasSinDatosComponent');
var PrevalidacionViewComponent_1 = require('../../src/pruebas/prevalidacion/view/PrevalidacionViewComponent');
var PrevalidacionAddComponent_1 = require('../../src/pruebas/prevalidacion/add/PrevalidacionAddComponent');
var ValidacionViewComponent_1 = require('../../src/pruebas/validacion/view/ValidacionViewComponent');
var ValidacionAddComponent_1 = require('../../src/pruebas/validacion/add/ValidacionAddComponent');
var UsuarioViewComponent_1 = require('../../src/seguridad/usuarios/view/UsuarioViewComponent');
var RolViewComponent_1 = require('../../src/seguridad/roles/view/RolViewComponent');
var RouterComponent = (function () {
    function RouterComponent(location, router) {
        this.router = router;
        this.isForcePassword = null;
        this.jwtHelper = new angular2_jwt_1.JwtHelper();
        this.location = location;
    }
    RouterComponent.prototype.logout = function () {
        localStorage.removeItem('id_token');
        localStorage.removeItem('user_login');
        localStorage.removeItem('menu');
        localStorage.removeItem('config_variables');
        localStorage.removeItem('is_force_password');
        this.loggedIn();
        this.userLogin = null;
        this.menu = null;
    };
    RouterComponent.prototype.loggedIn = function () {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));
        if (this.menu == null)
            this.menu = JSON.parse(localStorage.getItem('menu'));
        return angular2_jwt_1.tokenNotExpired();
    };
    RouterComponent.prototype.isActive = function (path) {
        return this.location.path() === path;
    };
    RouterComponent.prototype.goToOpcion = function (opcion) {
        localStorage.setItem('opcion', JSON.stringify(opcion));
        this.router.navigate([opcion.enlace]);
    };
    RouterComponent.prototype.forcingPassword = function () {
        this.isForcePassword = localStorage.getItem('is_force_password') != null ? localStorage.getItem('is_force_password') : false;
        if (this.isForcePassword) {
            jQuery('#cambio-password').modal({ backdrop: 'static', keyboard: false });
            return true;
        }
        return false;
    };
    RouterComponent = __decorate([
        router_deprecated_1.RouteConfig([
            { path: '/', component: InitComponent_1.InitComponent, name: 'Init' },
            { path: '/login', component: LoginComponent_1.LoginComponent, name: 'Login' },
            { path: '/perfil', component: PerfilComponent_1.PerfilComponent, name: 'Perfil' },
            { path: '/password', component: PasswordComponent_1.PasswordComponent, name: 'Password' },
            { path: '/administracion/personas', component: PersonaViewComponent_1.PersonaViewComponent, name: 'AdminPersonas' },
            { path: '/administracion/agentes', component: AgenteViewComponent_1.AgenteViewComponent, name: 'AdminAgentes' },
            { path: '/administracion/fuentes', component: FuenteViewComponent_1.FuenteViewComponent, name: 'AdminFuentes' },
            { path: '/administracion/infracciones', component: InfraccionViewComponent_1.InfraccionViewComponent, name: 'AdminInfracciones' },
            { path: '/administracion/intereses', component: InteresViewComponent_1.InteresViewComponent, name: 'AdminIntereses' },
            { path: '/administracion/direcciones', component: DireccionViewComponent_1.DireccionViewComponent, name: 'AdminDirecciones' },
            { path: '/administracion/propietarios', component: PropietarioViewComponent_1.PropietarioViewComponent, name: 'AdminPropietarios' },
            { path: '/administracion/carga-informacion', component: CargaInformacionComponent_1.CargaInformacionComponent, name: 'AdminCargaInformacion' },
            { path: '/administracion/carga-propietarios', component: CargaPropietariosComponent_1.CargaPropietariosComponent, name: 'AdminCargaPropietarios' },
            { path: '/comparendos/notificaciones', component: NotificacionesViewComponent_1.NotificacionesViewComponent, name: 'CompaNotificaciones' },
            { path: '/comparendos/envios', component: EnviosViewComponent_1.EnviosViewComponent, name: 'CompaEnvios' },
            { path: '/comparendos/comparendos', component: ComparendosViewComponent_1.ComparendosViewComponent, name: 'CompaComparendos' },
            { path: '/pruebas/carga-individual', component: CargaIndividualComponent_1.CargaIndividualComponent, name: 'PruebasCargaIndividual' },
            { path: '/pruebas/placas-sin-datos', component: PlacasSinDatosComponent_1.PlacasSinDatosComponent, name: 'PruebasPlacasSinDatos' },
            { path: '/pruebas/prevalidacion-list', component: PrevalidacionViewComponent_1.PrevalidacionViewComponent, name: 'PruebasPrevalidacionView' },
            { path: '/pruebas/prevalidacion-add/:deteccion', component: PrevalidacionAddComponent_1.PrevalidacionAddComponent, name: 'PruebasPrevalidacionAdd' },
            { path: '/pruebas/validacion-list', component: ValidacionViewComponent_1.ValidacionViewComponent, name: 'PruebasValidacionView' },
            { path: '/pruebas/validacion-add/:deteccion', component: ValidacionAddComponent_1.ValidacionAddComponent, name: 'PruebasValidacionAdd' },
            { path: '/seguridad/usuarios', component: UsuarioViewComponent_1.UsuarioViewComponent, name: 'SegurUsuarios' },
            { path: '/seguridad/roles', component: RolViewComponent_1.RolViewComponent, name: 'SegurRoles' },
            { path: '/*path', component: InitComponent_1.InitComponent }
        ]),
        core_1.Component({
            selector: 'router',
            templateUrl: './app/components/boot/router/router.html',
            providers: [router_deprecated_1.ROUTER_PROVIDERS],
            directives: [router_deprecated_1.ROUTER_DIRECTIVES, router_deprecated_1.RouterOutlet, router_deprecated_1.RouterLink, PasswordComponent_1.PasswordComponent]
        }), 
        __metadata('design:paramtypes', [common_1.Location, router_deprecated_1.Router])
    ], RouterComponent);
    return RouterComponent;
}());
exports.RouterComponent = RouterComponent;
//# sourceMappingURL=RouterComponent.js.map
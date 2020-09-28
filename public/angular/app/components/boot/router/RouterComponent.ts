import { Component, bind, provide } from '@angular/core';
import { Location } from '@angular/common';
import { HTTP_PROVIDERS, Http } from '@angular/http';
import { ROUTER_DIRECTIVES, ROUTER_PROVIDERS, Router, RouteParams, RouterOutlet, RouteConfig, RouterLink } from '@angular/router-deprecated';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';

import { IUsuario } from "../../../interfaces/IUsuario";

import { InitComponent } from '../init/InitComponent';
import { LoginComponent } from '../login/LoginComponent';
import { PerfilComponent } from '../perfil/PerfilComponent';
import { PasswordComponent } from '../password/PasswordComponent';

import { PersonaViewComponent } from '../../src/administracion/personas/view/PersonaViewComponent';
import { AgenteViewComponent } from '../../src/administracion/agentes/view/AgenteViewComponent';
import { FuenteViewComponent } from '../../src/administracion/fuentes/view/FuenteViewComponent';
import { InfraccionViewComponent } from '../../src/administracion/infracciones/view/InfraccionViewComponent';
import { InteresViewComponent } from '../../src/administracion/intereses/view/InteresViewComponent';
import { DireccionViewComponent } from '../../src/administracion/direcciones/view/DireccionViewComponent';
import { PropietarioViewComponent } from '../../src/administracion/propietarios/view/PropietarioViewComponent';
import { CargaInformacionComponent } from '../../src/administracion/carga-informacion/CargaInformacionComponent';
import { CargaPropietariosComponent } from '../../src/administracion/carga-propietarios/CargaPropietariosComponent';

import { NotificacionesViewComponent } from '../../src/comparendos/notificaciones/view/NotificacionesViewComponent';
import { EnviosViewComponent } from '../../src/comparendos/envios/view/EnviosViewComponent';
import { ComparendosViewComponent } from '../../src/comparendos/comparendos/view/ComparendosViewComponent';

import { CargaIndividualComponent } from '../../src/pruebas/carga-individual/CargaIndividualComponent';
import { PlacasSinDatosComponent } from '../../src/pruebas/placas-sin-datos/PlacasSinDatosComponent';
import { PrevalidacionViewComponent } from '../../src/pruebas/prevalidacion/view/PrevalidacionViewComponent';
import { PrevalidacionAddComponent } from '../../src/pruebas/prevalidacion/add/PrevalidacionAddComponent';
import { ValidacionViewComponent } from '../../src/pruebas/validacion/view/ValidacionViewComponent';
import { ValidacionAddComponent } from '../../src/pruebas/validacion/add/ValidacionAddComponent';

import { UsuarioViewComponent } from '../../src/seguridad/usuarios/view/UsuarioViewComponent';
import { RolViewComponent } from '../../src/seguridad/roles/view/RolViewComponent';

declare var jQuery : any;

@RouteConfig([
    { path: '/', component: InitComponent, name: 'Init' },

    { path: '/login', component: LoginComponent, name: 'Login' },
  	{ path: '/perfil', component: PerfilComponent, name: 'Perfil' },
    { path: '/password', component: PasswordComponent, name: 'Password' },

    { path: '/administracion/personas', component: PersonaViewComponent, name: 'AdminPersonas' },
    { path: '/administracion/agentes', component: AgenteViewComponent, name: 'AdminAgentes' },
    { path: '/administracion/fuentes', component: FuenteViewComponent, name: 'AdminFuentes' },
    { path: '/administracion/infracciones', component: InfraccionViewComponent, name: 'AdminInfracciones' },
    { path: '/administracion/intereses', component: InteresViewComponent, name: 'AdminIntereses' },
    { path: '/administracion/direcciones', component: DireccionViewComponent, name: 'AdminDirecciones' },
    { path: '/administracion/propietarios', component: PropietarioViewComponent, name: 'AdminPropietarios' },
    { path: '/administracion/carga-informacion', component: CargaInformacionComponent, name: 'AdminCargaInformacion' },
    { path: '/administracion/carga-propietarios', component: CargaPropietariosComponent, name: 'AdminCargaPropietarios' },

    { path: '/comparendos/notificaciones', component: NotificacionesViewComponent, name: 'CompaNotificaciones' },
    { path: '/comparendos/envios', component: EnviosViewComponent, name: 'CompaEnvios' },
    { path: '/comparendos/comparendos', component: ComparendosViewComponent, name: 'CompaComparendos' },

    { path: '/pruebas/carga-individual', component: CargaIndividualComponent, name: 'PruebasCargaIndividual' },
    { path: '/pruebas/placas-sin-datos', component: PlacasSinDatosComponent, name: 'PruebasPlacasSinDatos' },
    { path: '/pruebas/prevalidacion-list', component: PrevalidacionViewComponent, name: 'PruebasPrevalidacionView' },
    { path: '/pruebas/prevalidacion-add/:deteccion', component: PrevalidacionAddComponent, name: 'PruebasPrevalidacionAdd' },
    { path: '/pruebas/validacion-list', component: ValidacionViewComponent, name: 'PruebasValidacionView' },
    { path: '/pruebas/validacion-add/:deteccion', component: ValidacionAddComponent, name: 'PruebasValidacionAdd' },

    { path: '/seguridad/usuarios', component: UsuarioViewComponent, name: 'SegurUsuarios' },
    { path: '/seguridad/roles', component: RolViewComponent, name: 'SegurRoles' },

    { path: '/*path', component: InitComponent }
])

@Component({
	selector: 'router',
  	templateUrl: './app/components/boot/router/router.html',
    providers: [ROUTER_PROVIDERS],
    directives: [ROUTER_DIRECTIVES, RouterOutlet, RouterLink, PasswordComponent]
})

export class RouterComponent
{
    isForcePassword : boolean = null;

    jwtHelper: JwtHelper = new JwtHelper();
    location: Location;
    
    userLogin: IUsuario;
    menu: Object;
    
    constructor(location: Location, private router: Router)
    {
        this.location = location;
    }

    private logout()
    {		
        localStorage.removeItem('id_token');
        localStorage.removeItem('user_login');
        localStorage.removeItem('menu');
        localStorage.removeItem('config_variables');
        localStorage.removeItem('is_force_password');

        this.loggedIn();

        this.userLogin = null;
        this.menu = null;
    }

    private loggedIn()
    {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));            

        if (this.menu == null)
            this.menu = JSON.parse(localStorage.getItem('menu'));

        return tokenNotExpired();
    }

    private isActive(path)
    {
        return this.location.path() === path;
    }

    private goToOpcion(opcion)
    {
        localStorage.setItem('opcion', JSON.stringify(opcion));
        this.router.navigate([opcion.enlace]);
    }

    private forcingPassword()
    {
        this.isForcePassword = localStorage.getItem('is_force_password') != null ? localStorage.getItem('is_force_password') : false;

        if (this.isForcePassword)
        {
            jQuery('#cambio-password').modal({backdrop: 'static', keyboard: false});
            return true;
        }

        return false;
    }
}
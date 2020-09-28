import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router-deprecated';

import { IPassword } from "../../../interfaces/IPassword";
import { IUsuario } from "../../../interfaces/IUsuario";
import { IOpcion } from "../../../interfaces/IOpcion";

import { UsuarioService } from "../../../services/UsuarioService";
import { GeneralService } from "../../../services/GeneralService";
import { AuditoriaService } from "../../../services/AuditoriaService";

import { NotificationsService } from 'angular2-notifications/components';
import { SimpleNotificationsComponent } from 'angular2-notifications/components';

declare var jQuery : any;

@Component({
    selector: 'password',
    templateUrl: './app/components/boot/password/password.html',
    bindings: [UsuarioService, GeneralService, AuditoriaService, NotificationsService],
    directives: [SimpleNotificationsComponent]
})

export class PasswordComponent implements OnInit
{
    isLoading: boolean = false;

    accionAudit: number = 3; // Editar

    @Input('isForcePassword') isForcePassword: boolean;

    passwordForm: IPassword;
    errores: Array<Object> = [];

    userLogin: IUsuario;
    opcion: IOpcion;

    notificationsOptions = {
        timeOut: 7000,
        lastOnBottom: false,
        clickToClose: true,
        maxLength: 0,
        maxStack: 7,
        showProgressBar: false,
        pauseOnHover: true,
        preventDuplicates: true,
        preventLastDuplicates: false
    };

    constructor(private router: Router, 
                private usuarioService: UsuarioService, 
                private generalService: GeneralService, 
                private auditoriaService: AuditoriaService, 
                private notificationService: NotificationsService) {}

    ngOnInit()
    {
        this.resetFormulario();
    }

    private cambiarPassword()
    {
        this.isLoading = true;
        this.resetErrores();

        this.userLogin = JSON.parse(localStorage.getItem('user_login'));
        this.passwordForm.usuario = this.userLogin.usuario;

        let passwordString = this.generarPasswordString(this.passwordForm);
 
        this.usuarioService.changePassword(passwordString, this.passwordForm.usuario).then(
            (res) => {
                this.isLoading = false;

                localStorage.removeItem('id_token');
                localStorage.removeItem('user_login');
                localStorage.removeItem('menu');
                localStorage.removeItem('is_force_password');

                this.notificationService.info("Información", "Ingrese de nuevo a la aplicación con sus datos de usuario.");
                this.notificationService.success("Operación exitosa", "La contraseña ha sido cambiada correctamente.");

                this.resetFormulario();
                this.cerrarVentana();

                this.router.navigate(['Login']);
            },
            (error) => {
                this.isLoading = false;

                // Código de respuesta de Laravel cuando falla la validación
                if (error.status === 422)
                {
                    let errores = error.json();

                    for (var key in errores)
                    {
                        this.errores.push(errores[key]);
                    }
                }
                else
                {
                    this.errores.push("Ha ocurrido un error al cambiar la contraseña.");
                }
            }
        );
    }

    private generarPasswordString(password) : string
    {
        return '&usuario=' + password.usuario +
               '&password_actual=' + (password.password_actual != undefined ? password.password_actual : '') +
               '&password_nueva=' + (password.password_nueva != undefined ? password.password_nueva : '') +
               '&password_nueva_confirmation=' + (password.password_nueva_confirmation != undefined ? password.password_nueva_confirmation : '');
    }

    private resetErrores() : void
    {
        this.errores = [];
    }

    private resetFormulario() : void
    {
        this.passwordForm = JSON.parse('{' + 
            ' "usuario" : null,' +
            ' "password_actual" : "",' + 
            ' "password_nueva" : "",' + 
            ' "password_nueva_confirmation" : ""' +
        '}');
    }

    private cerrarVentana() : void
    {
        jQuery('#cambio-password').modal('hide');
    }

    private close() : void
    {
        this.resetErrores();
        this.resetFormulario();
        this.cerrarVentana();
    }

    private loading() : boolean
    {
        return this.isLoading;
    }
}
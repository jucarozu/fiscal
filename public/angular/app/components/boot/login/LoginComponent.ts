import { Component, OnInit } from '@angular/core';

import { ILogin } from "../../../interfaces/ILogin";

import { GeneralService } from "../../../services/GeneralService";

import { Router } from '@angular/router-deprecated';
import { Http, Headers } from '@angular/http';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';

import { NotificationsService } from 'angular2-notifications/components';
import { SimpleNotificationsComponent } from 'angular2-notifications/components';

declare var jQuery : any;

@Component({
    selector: 'login',
    templateUrl: './app/components/boot/login/login.html',
    bindings: [GeneralService, NotificationsService],
    directives: [SimpleNotificationsComponent]
})

export class LoginComponent implements OnInit
{
    isLoading: boolean = false;
	jwtHelper: JwtHelper = new JwtHelper();
    
    url: string = "http://localhost:8000/fiscalizacion/login/";
    headers: Headers = new Headers;

    loginForm: ILogin;

    notificationsOptions = {
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

    constructor(private http: Http, 
                private router: Router, 
                private generalService: GeneralService, 
                private notificationService: NotificationsService) {}

    ngOnInit()
    {
        if (tokenNotExpired())
            this.router.navigate(['Perfil']);

        this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
        this.headers.append('X-Requested-With', 'XMLHttpRequest');

        if (this.loginForm == null)
        {
            this.loginForm = JSON.parse('{' + 
                ' "login" : "",' +
                ' "password" : ""' + 
            '}');
        }
    }

    private login()
    {
        return new Promise((resolve, reject) => {
            
            this.isLoading = true;

            localStorage.removeItem('id_token');
            localStorage.removeItem('user_login');
            localStorage.removeItem('menu');
            localStorage.removeItem('config_variables');
            localStorage.removeItem('is_force_password');

            let body = '&login=' + this.loginForm.login + 
                       '&password=' + this.loginForm.password;

            this.http.post(this.url, body, { headers: this.headers })
                .subscribe(
                    res => {
                        localStorage.setItem('id_token', res.json().token);
                        localStorage.setItem('user_login', JSON.stringify(res.json().user_login));
                        localStorage.setItem('menu', JSON.stringify(res.json().menu));
                        localStorage.setItem('config_variables', JSON.stringify(res.json().config_variables));

                        this.validarPassword(res.json().user_login.fecha_vence_passw);
                        
                        this.isLoading = false;
                        this.router.navigate(['Perfil']);
                    },
                    error => {
                        this.isLoading = false;

                        switch (error.status) {
                            case 401: // Unauthorized
                                this.notificationService.error("Acceso denegado", "Usuario y/o contraseña inválidos.");
                                break;

                            case 403: // Forbidden
                                this.notificationService.error("Acceso denegado", "El usuario no tiene un menú de opciones configurado.");
                                break;

                            case 500: // Internal server error
                                this.notificationService.error("Acceso denegado", "Error al validar los datos del usuario.");
                                break;
                            
                            default:
                                this.notificationService.error("Acceso denegado", "Error " + error.status);
                                break;
                        }
                    }
                );
        });
    }

    private validarPassword(fechaVencePassword)
    {
        if (fechaVencePassword != null)
        {
            if (new Date(fechaVencePassword) <= new Date(this.generalService.getFechaActualYMD()))
            {
                localStorage.setItem('is_force_password', true);
            }
        }
    }

    private loading() : boolean
    {
        return this.isLoading;
    }
}
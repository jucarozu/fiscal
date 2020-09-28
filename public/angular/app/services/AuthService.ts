import { Injector } from '@angular/core';
import { AppInjector } from '../constants/AppInjector';

import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { tokenNotExpired } from 'angular2-jwt';

export class AuthService 
{
    injector: Injector = AppInjector(); // Get the stored reference to the injector
    location: Location = this.injector.get(Location);

    constructor() {}

    // Verifica si el usuario tiene una sesión activa.
    check()
    {
        return Observable.of(tokenNotExpired());
    }

    // Verifica si el usuario tiene permisos sobre una opción del menú.
    authorize()
    {
        if (!tokenNotExpired())
        {
            return false;
        }

        let menu = null;
        let opciones = null;
        let autorizadas = null;

        if (localStorage.getItem('menu') != null)
        {
            menu = JSON.parse(localStorage.getItem('menu'));

            for (let i in menu)
            {
                opciones = menu[i].opciones;

                for (let j in opciones)
                {
                    if (this.location.path() == opciones[j].ruta)
                    {
                        return true;
                    }
                }
            }            
        }

        return false;
    }
}
import { Component, Input, OnInit } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { INotificacionFilter } from "../../../../../interfaces/INotificacionFilter";
import { IAgente } from "../../../../../interfaces/IAgente";

import { IUsuario } from "../../../../../interfaces/IUsuario";
import { IOpcion } from "../../../../../interfaces/IOpcion";

import { NotificacionService } from "../../../../../services/NotificacionService";

import { NotificationsService } from 'angular2-notifications/components';
import { SimpleNotificationsComponent } from 'angular2-notifications/components';
 
declare var jQuery : any;
 
@Component({
    selector: 'notificaciones-confirm',
    templateUrl: './app/components/src/comparendos/notificaciones/confirm/notificaciones-confirm.html',
    bindings: [NotificacionService, NotificationsService],
    directives: [
        SimpleNotificationsComponent
    ]
})
 
export class NotificacionesConfirmComponent implements OnInit
{
    isLoading: boolean = false;

    accionAudit: number = 2; // Insertar

    userLogin: IUsuario;
    opcion: IOpcion;

    @Input('notificacionFilter') notificacionFilter: INotificacionFilter;
    @Input('agentesSinFirma') agentesSinFirma: Array<IAgente>;

    errores: Array<Object> = [];

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

    constructor(private router: Router,
                private notificacionService: NotificacionService,
                private notificationService: NotificationsService) {}

    ngOnInit()
    {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));

        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));
    }

    private confirmar() : void
    {
        jQuery('#is-confirm-notificaciones').val('1');
        this.cerrarVentana();
    }

    private cancelar() : void
    {
        jQuery('#is-confirm-notificaciones').val('0');
        this.cerrarVentana();
    }

    private cerrarVentana() : void
    {
        jQuery('#confirm-notificaciones').modal('hide');
    }

    private loading() : boolean
    {
        return this.isLoading;
    }
}
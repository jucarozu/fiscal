import { Component, Input, OnInit } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { INotificacion } from "../../../../../interfaces/INotificacion";
import { INotifSeguimiento } from "../../../../../interfaces/INotifSeguimiento";
import { INotifEntregada } from "../../../../../interfaces/INotifEntregada";
import { INotifDevuelta } from "../../../../../interfaces/INotifDevuelta";
import { INotifDescarte } from "../../../../../interfaces/INotifDescarte";
import { INotifCola } from "../../../../../interfaces/INotifCola";

import { IUsuario } from "../../../../../interfaces/IUsuario";
import { IOpcion } from "../../../../../interfaces/IOpcion";

import { NotifSeguimientoService } from "../../../../../services/NotifSeguimientoService";
import { NotifEntregadaService } from "../../../../../services/NotifEntregadaService";
import { NotifDevueltaService } from "../../../../../services/NotifDevueltaService";
import { NotifDescarteService } from "../../../../../services/NotifDescarteService";
import { NotifColaService } from "../../../../../services/NotifColaService";
import { AuditoriaService } from "../../../../../services/AuditoriaService";

import { NotificationsService } from 'angular2-notifications/components';
import { SimpleNotificationsComponent } from 'angular2-notifications/components';

import { DataTable, Column } from 'primeng/primeng';

declare var jQuery : any;
 
@Component({
    selector: 'envios-detalle',
    templateUrl: './app/components/src/comparendos/envios/detalle/envios-detalle.html',
    bindings: [NotifSeguimientoService, NotifEntregadaService, NotifDevueltaService, NotifDescarteService, NotifColaService, AuditoriaService, NotificationsService],
    directives: [
        DataTable, Column,
        SimpleNotificationsComponent
    ]
})

export class EnviosDetalleComponent implements OnInit
{
	isLoading: boolean = false;

    accionAudit: number = 1; // Consultar

    userLogin: IUsuario;
    opcion: IOpcion;

    @Input('notificacion') notificacionForm: INotificacion;
    notifSeguimientos: Array<INotifSeguimiento>;
    notifEntregadas: Array<INotifEntregada>;
    notifDevueltas: Array<INotifDevuelta>;
    notifDescartadas: Array<INotifDescarte>;
    notifColas: Array<INotifCola>;

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
                private notifSeguimientoService: NotifSeguimientoService,
                private notifEntregadaService: NotifEntregadaService,
                private notifDevueltaService: NotifDevueltaService,
                private notifDescarteService: NotifDescarteService,
                private notifColaService: NotifColaService,
                private auditoriaService: AuditoriaService,
                private notificationService: NotificationsService) {}

    ngOnInit()
    {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));

        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));

        this.agregarEventos();

        this.auditoriaService.insert(this.opcion.opcion, this.accionAudit);
    }

    private agregarEventos()
    {
        jQuery('#detalle-envios').on('show.bs.modal', function() {
            jQuery('#btn-get-detalles').click();
        });
    }

    private getNotifDetalles()
    {
        if (this.notificacionForm.notif_estado == 3)
            this.getNotifEntregadas();

        if (this.notificacionForm.notif_estado == 4)
            this.getNotifDevueltas();

        if (this.notificacionForm.notif_estado == 5)
            this.getNotifDescartadas();

        /*if (this.notificacionForm.notif_estado == 8)
            this.getNotifColas();*/
        
        this.getNotifSeguimientos();
    }

    private getNotifEntregadas()
    {
        this.isLoading = true;

        this.notifEntregadaService.getByFilters(this.notificacionForm.notificacion).then(notifEntregadas => 
            {
                this.notifEntregadas = notifEntregadas;
                this.isLoading = false;
            }
        );
    }

    private getNotifDevueltas()
    {
        this.isLoading = true;

        this.notifDevueltaService.getByFilters(this.notificacionForm.notificacion).then(notifDevueltas => 
            {
                this.notifDevueltas = notifDevueltas;
                this.isLoading = false;
            }
        );
    }

    private getNotifDescartadas()
    {
        this.isLoading = true;

        this.notifDescarteService.getByFilters(this.notificacionForm.notificacion).then(notifDescartadas => 
            {
                this.notifDescartadas = notifDescartadas;
                this.isLoading = false;
            }
        );
    }

    /*private getNotifColas()
    {
        this.isLoading = true;

        this.notifColaService.getByFilters(this.notificacionForm.notificacion).then(notifColas => 
            {
                this.notifColas = notifColas;
                this.isLoading = false;
            }
        );
    }*/

    private getNotifSeguimientos()
    {
        this.isLoading = true;

        this.notifSeguimientoService.getByFilters(this.notificacionForm.notificacion).then(notifSeguimientos => 
            {
                this.notifSeguimientos = notifSeguimientos;
                this.isLoading = false;
            }
        );
    }

    private resetFormulario()
    {
        this.notifEntregadas = null;
        this.notifDevueltas = null;
        this.notifDescartadas = null;
        this.notifSeguimientos = null;
    }

    private cerrarVentana() : void
    {
        jQuery('#detalle-envios').modal('hide');
    }

    private close() : void
    {
        this.resetFormulario();
        this.cerrarVentana();
    }

    private loading() : boolean
    {
        return this.isLoading;
    }
}
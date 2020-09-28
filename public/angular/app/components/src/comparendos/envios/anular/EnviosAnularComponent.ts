import { Component, Input, OnInit } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { INotificacion } from "../../../../../interfaces/INotificacion";
import { INotifSeguimiento } from "../../../../../interfaces/INotifSeguimiento";

import { IUsuario } from "../../../../../interfaces/IUsuario";
import { IOpcion } from "../../../../../interfaces/IOpcion";

import { NotificacionService } from "../../../../../services/NotificacionService";
import { NotifSeguimientoService } from "../../../../../services/NotifSeguimientoService";
import { AuditoriaService } from "../../../../../services/AuditoriaService";

import { NotificationsService } from 'angular2-notifications/components';
import { SimpleNotificationsComponent } from 'angular2-notifications/components';

declare var jQuery : any;
 
@Component({
    selector: 'envios-anular',
    templateUrl: './app/components/src/comparendos/envios/anular/envios-anular.html',
    bindings: [NotificacionService, NotifSeguimientoService, AuditoriaService, NotificationsService],
    directives: [
        SimpleNotificationsComponent
    ]
})

export class EnviosAnularComponent implements OnInit
{
	isLoading: boolean = false;

    accionAudit: number = 4; // Eliminar
    
    poner_cola: boolean = false; // Poner en cola

    userLogin: IUsuario;
    opcion: IOpcion;

    @Input('notificacion') notificacionForm: INotificacion;
    notifSeguimientoForm: INotifSeguimiento;
    
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
                private notifSeguimientoService: NotifSeguimientoService,
                private auditoriaService: AuditoriaService,
                private notificationService: NotificationsService) {}

    ngOnInit()
    {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));

        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));

        this.resetFormulario();
    }

    private anular() : void
    {
        this.isLoading = true;

        // Datos de notificación.
        this.notificacionForm.estado = 10; // Estado: Anulada

        let notificacionString = this.generarNotificacionString(this.notificacionForm);

        this.notificacionService.update(notificacionString, this.notificacionForm.notificacion).then(
            (res) => {
                // Datos de seguimiento de notificación.
                this.notifSeguimientoForm.notificacion = this.notificacionForm.notificacion;
                this.notifSeguimientoForm.estado = 10; // Estado: Anulada
                this.notifSeguimientoForm.usuario = this.userLogin.usuario;

                let notifSeguimientoString = this.generarNotifSeguimientoString(this.notifSeguimientoForm);

                this.notifSeguimientoService.insert(notifSeguimientoString).then(
                    (res) => {
                        this.auditar(this.notifSeguimientoForm);
                        this.isLoading = false;

                        this.notificationService.success("Operación exitosa", "La notificación ha sido marcada como Anulada.");

                        if (this.poner_cola)
                        {
                            jQuery('#cola-envios').modal({backdrop: 'static', keyboard: false});
                        }

                        this.close();
                    },
                    (error) => {
                        this.notificationService.error("Error", JSON.parse(error._body).mensaje);
                        this.isLoading = false;
                    }
                );
            },
            (error) => {
                this.notificationService.error("Error", JSON.parse(error._body).mensaje);
                this.isLoading = false;
            }
        );
    }

    private generarNotificacionString(notificacion) : string
    {
        return '&notificacion=' + (notificacion.notificacion != null ? notificacion.notificacion : '') +
               '&estado=' + (notificacion.estado != null ? notificacion.estado : '') +
               '&fecha_hasta=' + (notificacion.notif_fecha_hasta != null ? notificacion.notif_fecha_hasta : '') +
               '&usuario=' + this.userLogin.usuario;
    }

    private generarNotifSeguimientoString(notifSeguimiento) : string
    {
        return '&notificacion=' + (notifSeguimiento.notificacion != null ? notifSeguimiento.notificacion : '') +
               '&estado=' + (notifSeguimiento.estado != null ? notifSeguimiento.estado : '') +
               '&usuario=' + this.userLogin.usuario +
               '&observaciones=' + (notifSeguimiento.observaciones != null ? notifSeguimiento.observaciones : '');
    }

    private auditar(notifSeguimiento) : boolean
    {
        try
        {
            let notifSeguimientoAudit = this.generarNotifSeguimientoAudit(notifSeguimiento);
            this.auditoriaService.insert(this.opcion.opcion, this.accionAudit, notifSeguimientoAudit);

            return true;
        }
        catch(error)
        {
            return false;
        }
    }

    private generarNotifSeguimientoAudit(notifSeguimiento) : string
    {
        let notifSeguimientoAudit = {
            notificacion : notifSeguimiento.notificacion,
            estado : notifSeguimiento.estado,
            observaciones : notifSeguimiento.observaciones
        };

        return JSON.stringify(notifSeguimientoAudit);
    }

    private resetFormulario() : void
    {
        this.notifSeguimientoForm = {
            seguimiento: null,
            notificacion: null,
            fecha: "",
            estado: null,
            estado_desc: "",
            usuario: null,
            usuario_desc: "",
            observaciones: "",
        };

        this.resetErrores();
    }

    private resetErrores() : void
    {
        this.errores = [];
    }

    private cerrarVentana() : void
    {
        jQuery('#anular-envios').modal('hide');
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
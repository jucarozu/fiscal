import { Component, Input, OnInit } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { INotificacion } from "../../../../../interfaces/INotificacion";
import { INotifAviso } from "../../../../../interfaces/INotifAviso";
import { INotifSeguimiento } from "../../../../../interfaces/INotifSeguimiento";
import { IResponsable } from "../../../../../interfaces/IResponsable";

import { IUsuario } from "../../../../../interfaces/IUsuario";
import { IOpcion } from "../../../../../interfaces/IOpcion";

import { NotifAvisoService } from "../../../../../services/NotifAvisoService";
import { NotificacionService } from "../../../../../services/NotificacionService";
import { NotifSeguimientoService } from "../../../../../services/NotifSeguimientoService";
import { ResponsableService } from "../../../../../services/ResponsableService";
import { AuditoriaService } from "../../../../../services/AuditoriaService";

import { NotificationsService } from 'angular2-notifications/components';
import { SimpleNotificationsComponent } from 'angular2-notifications/components';

declare var jQuery : any;
 
@Component({
    selector: 'envios-fijar',
    templateUrl: './app/components/src/comparendos/envios/fijar/envios-fijar.html',
    bindings: [NotifAvisoService, NotificacionService, NotifSeguimientoService, ResponsableService, AuditoriaService, NotificationsService],
    directives: [
        SimpleNotificationsComponent
    ]
})

export class EnviosFijarComponent implements OnInit
{
	isLoading: boolean = false;

    accionAudit: number = 5; // Ejecutar

    userLogin: IUsuario;
    opcion: IOpcion;

    @Input('notificacion') notificacionForm: INotificacion;
    notifAvisoForm: INotifAviso;
    notifSeguimientoForm: INotifSeguimiento;

    funcionarios: Array<IResponsable> = [];
    
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
                private notifAvisoService: NotifAvisoService,
                private notificacionService: NotificacionService,
                private notifSeguimientoService: NotifSeguimientoService,
                private responsableService: ResponsableService,
                private auditoriaService: AuditoriaService,
                private notificationService: NotificationsService) {}

    ngOnInit()
    {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));

        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));

        this.resetFormulario();
        this.cargarCombos();
    }

    private cargarCombos()
    {
        this.responsableService.get().then(funcionarios => { this.funcionarios = funcionarios });
    }

    private insertar() : void
    {
        this.isLoading = true;

        // Datos de notificación fijada.
        this.notifAvisoForm.notificacion = this.notificacionForm.notificacion;
        this.notifAvisoForm.usuario = this.userLogin.usuario;

        let notifAvisoString = this.generarNotifAvisoString(this.notifAvisoForm);

        this.notifAvisoService.insert(notifAvisoString).then(
            (res) => {
                // Datos de notificación.
                this.notificacionForm.estado = 6; // Estado: Fijada

                let notificacionString = this.generarNotificacionString(this.notificacionForm);

                this.notificacionService.update(notificacionString, this.notificacionForm.notificacion).then(
                    (res) => {
                        // Datos de seguimiento de notificación.
                        this.notifSeguimientoForm.notificacion = this.notificacionForm.notificacion;
                        this.notifSeguimientoForm.estado = 6; // Estado: Fijada
                        this.notifSeguimientoForm.usuario = this.userLogin.usuario;
                        this.notifSeguimientoForm.observaciones = this.notifAvisoForm.observaciones_fija;

                        let notifSeguimientoString = this.generarNotifSeguimientoString(this.notifSeguimientoForm);

                        this.notifSeguimientoService.insert(notifSeguimientoString).then(
                            (res) => {
                                this.auditar(this.notifAvisoForm);
                                this.isLoading = false;

                                this.notificationService.success("Operación exitosa", "La notificación ha sido marcada como Fijada.");
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
            },
            (error) => {
                this.notificationService.error("Error", JSON.parse(error._body).mensaje);
                this.isLoading = false;
            }
        );
    }

    private generarNotifAvisoString(notifAviso) : string
    {
        return '&notificacion=' + (notifAviso.notificacion != null ? notifAviso.notificacion : '') +
               '&fecha_fija=' + (notifAviso.fecha_fija != null ? notifAviso.fecha_fija : '') +
               '&funcionario_fija=' + (notifAviso.funcionario_fija != null ? notifAviso.funcionario_fija : '') +
               '&observaciones_fija=' + (notifAviso.observaciones_fija != null ? notifAviso.observaciones_fija : '') +
               '&usuario_fija=' + this.userLogin.usuario;
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

    private auditar(notifAviso) : boolean
    {
        try
        {
            let notifAvisoAudit = this.generarNotifAvisoAudit(notifAviso);
            this.auditoriaService.insert(this.opcion.opcion, this.accionAudit, notifAvisoAudit);

            return true;
        }
        catch(error)
        {
            return false;
        }
    }

    private generarNotifAvisoAudit(notifAviso) : string
    {
        let notifAvisoAudit = {
            notificacion : notifAviso.notificacion,
            fecha_fija : notifAviso.fecha_fija,
            funcionario_fija : notifAviso.funcionario_fija,
            observaciones_fija : notifAviso.observaciones_fija,
            usuario_fija : this.userLogin.usuario
        };

        return JSON.stringify(notifAvisoAudit);
    }

    private resetFormulario() : void
    {
        this.notifAvisoForm = {
            aviso: null,
            notificacion: null,
            fecha_fija: "",
            funcionario_fija: null,
            observaciones_fija: "",
            fecha_desfija: "",
            funcionario_desfija: null,
            observaciones_desfija: "",
            fecha_registra: "",
            usuario: null,
            usuario_desc: ""
        };

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
        jQuery('#fijar-envios').modal('hide');
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
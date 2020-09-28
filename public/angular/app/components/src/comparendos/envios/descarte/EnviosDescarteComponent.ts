import { Component, Input, OnInit } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { INotificacion } from "../../../../../interfaces/INotificacion";
import { INotifDescarte } from "../../../../../interfaces/INotifDescarte";
import { INotifSeguimiento } from "../../../../../interfaces/INotifSeguimiento";
import { IEmpresaMensajeria } from "../../../../../interfaces/IEmpresaMensajeria";

import { IUsuario } from "../../../../../interfaces/IUsuario";
import { IOpcion } from "../../../../../interfaces/IOpcion";

import { NotifDescarteService } from "../../../../../services/NotifDescarteService";
import { NotificacionService } from "../../../../../services/NotificacionService";
import { NotifSeguimientoService } from "../../../../../services/NotifSeguimientoService";
import { EmpresaMensajeriaService } from "../../../../../services/EmpresaMensajeriaService";
import { ParametroService } from "../../../../../services/ParametroService";
import { AuditoriaService } from "../../../../../services/AuditoriaService";

import { NotificationsService } from 'angular2-notifications/components';
import { SimpleNotificationsComponent } from 'angular2-notifications/components';

declare var jQuery : any;
 
@Component({
    selector: 'envios-descarte',
    templateUrl: './app/components/src/comparendos/envios/descarte/envios-descarte.html',
    bindings: [NotifDescarteService, NotificacionService, NotifSeguimientoService, EmpresaMensajeriaService, ParametroService, AuditoriaService, NotificationsService],
    directives: [
        SimpleNotificationsComponent
    ]
})

export class EnviosDescarteComponent implements OnInit
{
	isLoading: boolean = false;

    accionAudit: number = 5; // Ejecutar

    gpCausalDescarte: number = 43;

    userLogin: IUsuario;
    opcion: IOpcion;

    @Input('notificacion') notificacionForm: INotificacion;
    notifDescarteForm: INotifDescarte;
    notifSeguimientoForm: INotifSeguimiento;

    causales: Array<Object> = [];
    empresasMensajeria: Array<IEmpresaMensajeria> = [];
    
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
                private notifDescarteService: NotifDescarteService,
                private notificacionService: NotificacionService,
                private notifSeguimientoService: NotifSeguimientoService,
                private empresaMensajeriaService: EmpresaMensajeriaService,
                private parametroService: ParametroService,
                private auditoriaService: AuditoriaService,
                private notificationService: NotificationsService) {}

    ngOnInit()
    {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));

        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));

        this.cargarCombos();
        this.resetFormulario();
    }

    private cargarCombos()
    {
        this.parametroService.getByGrupo(this.gpCausalDescarte).then(causales => { this.causales = causales });
        this.empresaMensajeriaService.get().then(empresasMensajeria => { this.empresasMensajeria = empresasMensajeria });
    }

    private insertar() : void
    {
        this.isLoading = true;

        // Datos de notificación descartada.
        this.notifDescarteForm.notificacion = this.notificacionForm.notificacion;
        this.notifDescarteForm.usuario = this.userLogin.usuario;

        let notifDescarteString = this.generarNotifDescarteString(this.notifDescarteForm);

        this.notifDescarteService.insert(notifDescarteString).then(
            (res) => {
                // Datos de notificación.
                this.notificacionForm.estado = 5; // Estado: Descartada
                this.notificacionForm.notif_fecha_hasta = this.notifDescarteForm.fecha_descarte;
                this.notificacionForm.notif_motivo_rechazo = this.notifDescarteForm.causal_descarte;

                let notificacionString = this.generarNotificacionString(this.notificacionForm);

                this.notificacionService.update(notificacionString, this.notificacionForm.notificacion).then(
                    (res) => {
                        // Datos de seguimiento de notificación.
                        this.notifSeguimientoForm.notificacion = this.notificacionForm.notificacion;
                        this.notifSeguimientoForm.estado = 5; // Estado: Descartada
                        this.notifSeguimientoForm.usuario = this.userLogin.usuario;
                        this.notifSeguimientoForm.observaciones = this.notifDescarteForm.observaciones;

                        let notifSeguimientoString = this.generarNotifSeguimientoString(this.notifSeguimientoForm);

                        this.notifSeguimientoService.insert(notifSeguimientoString).then(
                            (res) => {
                                this.auditar(this.notifDescarteForm);
                                this.isLoading = false;

                                this.notificationService.success("Operación exitosa", "La notificación ha sido marcada como Descartada.");
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

    private generarNotifDescarteString(notifDescarte) : string
    {
        return '&notificacion=' + (notifDescarte.notificacion != null ? notifDescarte.notificacion : '') +
               '&empresa_mensajeria=' + (notifDescarte.empresa_mensajeria != null ? notifDescarte.empresa_mensajeria : '') +
               '&fecha_descarte=' + (notifDescarte.fecha_descarte != null ? notifDescarte.fecha_descarte : '') +
               '&causal_descarte=' + (notifDescarte.causal_descarte != null ? notifDescarte.causal_descarte : '') +
               '&observaciones=' + (notifDescarte.observaciones != null ? notifDescarte.observaciones : '') +
               '&usuario=' + this.userLogin.usuario;
    }

    private generarNotificacionString(notificacion) : string
    {
        return '&notificacion=' + (notificacion.notificacion != null ? notificacion.notificacion : '') +
               '&estado=' + (notificacion.estado != null ? notificacion.estado : '') +
               '&fecha_hasta=' + (notificacion.notif_fecha_hasta != null ? notificacion.notif_fecha_hasta : '') +
               '&motivo_rechazo=' + (notificacion.notif_motivo_rechazo != null ? notificacion.notif_motivo_rechazo : '') +
               '&usuario=' + this.userLogin.usuario;
    }

    private generarNotifSeguimientoString(notifSeguimiento) : string
    {
        return '&notificacion=' + (notifSeguimiento.notificacion != null ? notifSeguimiento.notificacion : '') +
               '&estado=' + (notifSeguimiento.estado != null ? notifSeguimiento.estado : '') +
               '&usuario=' + this.userLogin.usuario +
               '&observaciones=' + (notifSeguimiento.observaciones != null ? notifSeguimiento.observaciones : '');
    }

    private auditar(notifDescarte) : boolean
    {
        try
        {
            let notifDescarteAudit = this.generarNotifDescarteAudit(notifDescarte);
            this.auditoriaService.insert(this.opcion.opcion, this.accionAudit, notifDescarteAudit);

            return true;
        }
        catch(error)
        {
            return false;
        }
    }

    private generarNotifDescarteAudit(notifDescarte) : string
    {
        let notifDescarteAudit = {
            notificacion : notifDescarte.notificacion,
            empresa_mensajeria : notifDescarte.empresa_mensajeria,
            fecha_descarte : notifDescarte.fecha_descarte,
            causal_descarte : notifDescarte.causal_descarte,
            observaciones : notifDescarte.observaciones,
            usuario : this.userLogin.usuario
        };

        return JSON.stringify(notifDescarteAudit);
    }

    private resetFormulario() : void
    {
        this.notifDescarteForm = {
            descarte: null,
            notificacion: null,
            empresa_mensajeria: null,
            fecha_descarte: "",
            causal_descarte: null,
            observaciones: "",
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
        jQuery('#descarte-envios').modal('hide');
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
import { Component, Input, OnInit } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { INotificacion } from "../../../../../interfaces/INotificacion";
import { INotifDevuelta } from "../../../../../interfaces/INotifDevuelta";
import { INotifSeguimiento } from "../../../../../interfaces/INotifSeguimiento";
import { IEmpresaMensajeria } from "../../../../../interfaces/IEmpresaMensajeria";

import { IUsuario } from "../../../../../interfaces/IUsuario";
import { IOpcion } from "../../../../../interfaces/IOpcion";

import { NotifDevueltaService } from "../../../../../services/NotifDevueltaService";
import { NotificacionService } from "../../../../../services/NotificacionService";
import { NotifSeguimientoService } from "../../../../../services/NotifSeguimientoService";
import { EmpresaMensajeriaService } from "../../../../../services/EmpresaMensajeriaService";
import { ParametroService } from "../../../../../services/ParametroService";
import { AuditoriaService } from "../../../../../services/AuditoriaService";

import { NotificationsService } from 'angular2-notifications/components';
import { SimpleNotificationsComponent } from 'angular2-notifications/components';

declare var jQuery : any;
 
@Component({
    selector: 'envios-devuelto',
    templateUrl: './app/components/src/comparendos/envios/devuelto/envios-devuelto.html',
    bindings: [NotifDevueltaService, NotificacionService, NotifSeguimientoService, EmpresaMensajeriaService, ParametroService, AuditoriaService, NotificationsService],
    directives: [
        SimpleNotificationsComponent
    ]
})

export class EnviosDevueltoComponent implements OnInit
{
	isLoading: boolean = false;

    accionAudit: number = 5; // Ejecutar

    gpCausalDevolucion: number = 43;

    userLogin: IUsuario;
    opcion: IOpcion;

    @Input('notificacion') notificacionForm: INotificacion;
    notifDevueltaForm: INotifDevuelta;
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
                private notifDevueltaService: NotifDevueltaService,
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
        this.parametroService.getByGrupo(this.gpCausalDevolucion).then(causales => { this.causales = causales });
        this.empresaMensajeriaService.get().then(empresasMensajeria => { this.empresasMensajeria = empresasMensajeria });
    }

    private insertar() : void
    {
        this.isLoading = true;

        // Datos de notificación entregada.
        this.notifDevueltaForm.notificacion = this.notificacionForm.notificacion;
        this.notifDevueltaForm.usuario = this.userLogin.usuario;

        let notifDevueltaString = this.generarNotifDevueltaString(this.notifDevueltaForm);

        this.notifDevueltaService.insert(notifDevueltaString).then(
            (res) => {
                // Datos de notificación.
                this.notificacionForm.estado = 4; // Estado: Devuelta
                this.notificacionForm.notif_fecha_hasta = this.notifDevueltaForm.fecha_novedad;
                this.notificacionForm.notif_motivo_rechazo = this.notifDevueltaForm.causal_devolucion;

                let notificacionString = this.generarNotificacionString(this.notificacionForm);

                this.notificacionService.update(notificacionString, this.notificacionForm.notificacion).then(
                    (res) => {
                        // Datos de seguimiento de notificación.
                        this.notifSeguimientoForm.notificacion = this.notificacionForm.notificacion;
                        this.notifSeguimientoForm.estado = 4; // Estado: Devuelta
                        this.notifSeguimientoForm.usuario = this.userLogin.usuario;
                        this.notifSeguimientoForm.observaciones = this.notifDevueltaForm.observaciones;

                        let notifSeguimientoString = this.generarNotifSeguimientoString(this.notifSeguimientoForm);

                        this.notifSeguimientoService.insert(notifSeguimientoString).then(
                            (res) => {
                                this.auditar(this.notifDevueltaForm);
                                this.isLoading = false;

                                this.notificationService.success("Operación exitosa", "La notificación ha sido marcada como Devuelta.");
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

    private generarNotifDevueltaString(notifDevuelta) : string
    {
        return '&notificacion=' + (notifDevuelta.notificacion != null ? notifDevuelta.notificacion : '') +
               '&empresa_mensajeria=' + (notifDevuelta.empresa_mensajeria != null ? notifDevuelta.empresa_mensajeria : '') +
               '&numero_guia=' + (notifDevuelta.numero_guia != null ? notifDevuelta.numero_guia : '') +
               '&fecha_novedad=' + (notifDevuelta.fecha_novedad != null ? notifDevuelta.fecha_novedad : '') +
               '&causal_devolucion=' + (notifDevuelta.causal_devolucion != null ? notifDevuelta.causal_devolucion : '') +
               '&observaciones=' + (notifDevuelta.observaciones != null ? notifDevuelta.observaciones : '') +
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

    private auditar(notifDevuelta) : boolean
    {
        try
        {
            let notifDevueltaAudit = this.generarNotifDevueltaAudit(notifDevuelta);
            this.auditoriaService.insert(this.opcion.opcion, this.accionAudit, notifDevueltaAudit);

            return true;
        }
        catch(error)
        {
            return false;
        }
    }

    private generarNotifDevueltaAudit(notifDevuelta) : string
    {
        let notifDevueltaAudit = {
            notificacion : notifDevuelta.notificacion,
            empresa_mensajeria : notifDevuelta.empresa_mensajeria,
            numero_guia : notifDevuelta.numero_guia,
            fecha_novedad : notifDevuelta.fecha_novedad,
            causal_devolucion : notifDevuelta.causal_devolucion,
            observaciones : notifDevuelta.observaciones,
            usuario : this.userLogin.usuario
        };

        return JSON.stringify(notifDevueltaAudit);
    }

    private resetFormulario() : void
    {
        this.notifDevueltaForm = {
            devuelta: null,
            notificacion: null,
            empresa_mensajeria: null,
            numero_guia: "",
            fecha_novedad: "",
            causal_devolucion: null,
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
        jQuery('#devuelto-envios').modal('hide');
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
import { Component, Input, OnInit } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { INotificacion } from "../../../../../interfaces/INotificacion";
import { INotifEntregada } from "../../../../../interfaces/INotifEntregada";
import { INotifSeguimiento } from "../../../../../interfaces/INotifSeguimiento";
import { IEmpresaMensajeria } from "../../../../../interfaces/IEmpresaMensajeria";

import { IUsuario } from "../../../../../interfaces/IUsuario";
import { IOpcion } from "../../../../../interfaces/IOpcion";

import { NotifEntregadaService } from "../../../../../services/NotifEntregadaService";
import { NotificacionService } from "../../../../../services/NotificacionService";
import { NotifSeguimientoService } from "../../../../../services/NotifSeguimientoService";
import { EmpresaMensajeriaService } from "../../../../../services/EmpresaMensajeriaService";
import { ParametroService } from "../../../../../services/ParametroService";
import { AuditoriaService } from "../../../../../services/AuditoriaService";

import { NotificationsService } from 'angular2-notifications/components';
import { SimpleNotificationsComponent } from 'angular2-notifications/components';

declare var jQuery : any;
 
@Component({
    selector: 'envios-entregado',
    templateUrl: './app/components/src/comparendos/envios/entregado/envios-entregado.html',
    bindings: [NotifEntregadaService, NotificacionService, NotifSeguimientoService, EmpresaMensajeriaService, ParametroService, AuditoriaService, NotificationsService],
    directives: [
        SimpleNotificationsComponent
    ]
})

export class EnviosEntregadoComponent implements OnInit
{
	isLoading: boolean = false;

    accionAudit: number = 5; // Ejecutar

    userLogin: IUsuario;
    opcion: IOpcion;

    @Input('notificacion') notificacionForm: INotificacion;
    notifEntregadaForm: INotifEntregada;
    notifSeguimientoForm: INotifSeguimiento;

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
                private notifEntregadaService: NotifEntregadaService,
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
        this.empresaMensajeriaService.get().then(empresasMensajeria => { this.empresasMensajeria = empresasMensajeria });
    }

    private insertar() : void
    {
        this.isLoading = true;

        // Datos de notificación entregada.
        this.notifEntregadaForm.notificacion = this.notificacionForm.notificacion;
        this.notifEntregadaForm.usuario = this.userLogin.usuario;

        let notifEntregadaString = this.generarNotifEntregadaString(this.notifEntregadaForm);

        this.notifEntregadaService.insert(notifEntregadaString).then(
            (res) => {
                // Datos de notificación.
                this.notificacionForm.estado = 3; // Estado: Entregada
                this.notificacionForm.notif_fecha_hasta = this.notifEntregadaForm.fecha_entrega;

                let notificacionString = this.generarNotificacionString(this.notificacionForm);

                this.notificacionService.update(notificacionString, this.notificacionForm.notificacion).then(
                    (res) => {
                        // Datos de seguimiento de notificación.
                        this.notifSeguimientoForm.notificacion = this.notificacionForm.notificacion;
                        this.notifSeguimientoForm.estado = 3; // Estado: Entregada
                        this.notifSeguimientoForm.usuario = this.userLogin.usuario;
                        this.notifSeguimientoForm.observaciones = this.notifEntregadaForm.observaciones;

                        let notifSeguimientoString = this.generarNotifSeguimientoString(this.notifSeguimientoForm);

                        this.notifSeguimientoService.insert(notifSeguimientoString).then(
                            (res) => {
                                this.auditar(this.notifEntregadaForm);
                                this.isLoading = false;

                                this.notificationService.success("Operación exitosa", "La notificación ha sido marcada como Entregada.");
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

    private generarNotifEntregadaString(notifEntregada) : string
    {
        return '&notificacion=' + (notifEntregada.notificacion != null ? notifEntregada.notificacion : '') +
               '&empresa_mensajeria=' + (notifEntregada.empresa_mensajeria != null ? notifEntregada.empresa_mensajeria : '') +
               '&numero_guia=' + (notifEntregada.numero_guia != null ? notifEntregada.numero_guia : '') +
               '&fecha_entrega=' + (notifEntregada.fecha_entrega != null ? notifEntregada.fecha_entrega : '') +
               '&nombre_recibe=' + (notifEntregada.nombre_recibe != null ? notifEntregada.nombre_recibe : '') +
               '&observaciones=' + (notifEntregada.observaciones != null ? notifEntregada.observaciones : '') +
               '&usuario=' + this.userLogin.usuario;
    }

    private generarNotificacionString(notificacion) : string
    {
        return '&notificacion=' + (notificacion.notificacion != null ? notificacion.notificacion : '') +
               '&fecha_hasta=' + (notificacion.notif_fecha_hasta != null ? notificacion.notif_fecha_hasta : '') +
               '&estado=' + (notificacion.estado != null ? notificacion.estado : '') +
               '&usuario=' + this.userLogin.usuario;
    }

    private generarNotifSeguimientoString(notifSeguimiento) : string
    {
        return '&notificacion=' + (notifSeguimiento.notificacion != null ? notifSeguimiento.notificacion : '') +
               '&estado=' + (notifSeguimiento.estado != null ? notifSeguimiento.estado : '') +
               '&usuario=' + this.userLogin.usuario +
               '&observaciones=' + (notifSeguimiento.observaciones != null ? notifSeguimiento.observaciones : '');
    }

    private auditar(notifEntregada) : boolean
    {
        try
        {
            let notifEntregadaAudit = this.generarNotifEntregadaAudit(notifEntregada);
            this.auditoriaService.insert(this.opcion.opcion, this.accionAudit, notifEntregadaAudit);

            return true;
        }
        catch(error)
        {
            return false;
        }
    }

    private generarNotifEntregadaAudit(notifEntregada) : string
    {
        let notifEntregadaAudit = {
            notificacion : notifEntregada.notificacion,
            empresa_mensajeria : notifEntregada.empresa_mensajeria,
            numero_guia : notifEntregada.numero_guia,
            fecha_entrega : notifEntregada.fecha_entrega,
            nombre_recibe : notifEntregada.nombre_recibe,
            observaciones : notifEntregada.observaciones,
            usuario : this.userLogin.usuario
        };

        return JSON.stringify(notifEntregadaAudit);
    }

    private resetFormulario() : void
    {
        this.notifEntregadaForm = {
            entregada: null,
            notificacion: null,
            empresa_mensajeria: null,
            numero_guia: "",
            fecha_entrega: "",
            nombre_recibe: "",
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
            observaciones: ""
        };

        this.resetErrores();
    }

    private resetErrores() : void
    {
        this.errores = [];
    }

    private cerrarVentana() : void
    {
        jQuery('#entregado-envios').modal('hide');
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
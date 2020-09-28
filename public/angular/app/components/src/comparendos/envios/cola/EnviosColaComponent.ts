import { Component, Input, OnInit } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { INotificacion } from "../../../../../interfaces/INotificacion";
import { INotifCola } from "../../../../../interfaces/INotifCola";
import { INotifColaComparendo } from "../../../../../interfaces/INotifColaComparendo";
import { INotifColaDireccion } from "../../../../../interfaces/INotifColaDireccion";
import { INotifSeguimiento } from "../../../../../interfaces/INotifSeguimiento";
import { IDireccion } from "../../../../../interfaces/IDireccion";

import { IUsuario } from "../../../../../interfaces/IUsuario";
import { IOpcion } from "../../../../../interfaces/IOpcion";

import { NotifColaService } from "../../../../../services/NotifColaService";
import { NotificacionService } from "../../../../../services/NotificacionService";
import { NotifSeguimientoService } from "../../../../../services/NotifSeguimientoService";
import { DireccionService } from "../../../../../services/DireccionService";
import { AuditoriaService } from "../../../../../services/AuditoriaService";

import { NotificationsService } from 'angular2-notifications/components';
import { SimpleNotificationsComponent } from 'angular2-notifications/components';

declare var jQuery : any;
 
@Component({
    selector: 'envios-cola',
    templateUrl: './app/components/src/comparendos/envios/cola/envios-cola.html',
    bindings: [NotifColaService, NotificacionService, NotifSeguimientoService, DireccionService, AuditoriaService, NotificationsService],
    directives: [
        SimpleNotificationsComponent
    ]
})

export class EnviosColaComponent implements OnInit
{
	isLoading: boolean = false;

    accionAudit: number = 5; // Ejecutar

    userLogin: IUsuario;
    opcion: IOpcion;

    @Input('notificacion') notificacionForm: INotificacion;
    notifColaForm: INotifCola;
    notifColaComparendoForm: INotifColaComparendo;
    notifColaDireccionForm: INotifColaDireccion;
    notifSeguimientoForm: INotifSeguimiento;

    direcciones: Array<IDireccion> = [];
    
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
                private notifColaService: NotifColaService,
                private notificacionService: NotificacionService,
                private notifSeguimientoService: NotifSeguimientoService,
                private direccionService: DireccionService,
                private auditoriaService: AuditoriaService,
                private notificationService: NotificationsService) {}

    ngOnInit()
    {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));

        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));

        this.agregarEventos();
        this.resetFormulario();
    }

    private agregarEventos()
    {
        jQuery('#cola-envios').on('show.bs.modal', function() {
            jQuery('#btn-get-direcciones').click();
        });

        jQuery('#add-direccion').on('hide.bs.modal', function() {
            jQuery('#btn-get-direcciones').click();
        });
    }

    private getNotifDirecciones()
    {
        this.isLoading = true;

        this.direccionService.getAllByPersona(this.notificacionForm.notif_persona).then(direcciones => 
            {
                let direccion_selected = null;

                if (jQuery('#nueva-direccion').val() != "")
                {
                    direccion_selected = jQuery('#nueva-direccion').val();
                    jQuery('#nueva-direccion').val("");
                }

                this.direcciones = [];

                for (let i in direcciones)
                {
                    this.direcciones.push({
                        direccion : direcciones[i]['direccion'], 
                        persona : direcciones[i]['persona'], 
                        tipo_doc: direcciones[i]['tipo_doc'], 
                        tipo_doc_desc: direcciones[i]['tipo_doc_desc'], 
                        numero_doc: direcciones[i]['numero_doc'], 
                        nombres: direcciones[i]['nombres'], 
                        apellidos: direcciones[i]['apellidos'], 
                        nombres_apellidos: direcciones[i]['nombres_apellidos'], 
                        fuente: direcciones[i]['fuente'], 
                        fuente_desc: direcciones[i]['fuente_desc'], 
                        observaciones: direcciones[i]['observaciones'], 
                        divipo: direcciones[i]['divipo'], 
                        cod_departamento: direcciones[i]['cod_departamento'], 
                        departamento: direcciones[i]['departamento'], 
                        cod_municipio: direcciones[i]['cod_municipio'], 
                        municipio: direcciones[i]['municipio'], 
                        cod_poblado: direcciones[i]['cod_poblado'], 
                        poblado: direcciones[i]['poblado'], 
                        descripcion: direcciones[i]['descripcion'], 
                        fecha_registra: direcciones[i]['fecha_registra'], 
                        usuario: direcciones[i]['usuario'], 
                        usuario_desc: direcciones[i]['usuario_desc'], 
                        is_selected: direccion_selected == direcciones[i]['direccion'] ? true : false,
                    });
                }

                this.isLoading = false;
            }
        );
    }

    private setDireccion(direccion)
    {
        this.notificacionForm.notif_direccion = direccion.direccion;
        this.notificacionForm.notif_dir_divipo = direccion.divipo;
        this.notificacionForm.notif_dir_descripcion = direccion.descripcion;

        for (let i in this.direcciones)
        {
            this.direcciones[i].is_selected = this.direcciones[i].direccion == this.notificacionForm.notif_direccion;
        }
    }

    private insertar() : void
    {
        this.resetErrores();

        let is_selected = false;

        for (let i in this.direcciones)
        {
            if (this.direcciones[i].is_selected)
            {
                is_selected = true;
            }
        }

        if (!is_selected)
        {
            this.errores.push("Debe seleccionar una dirección para el envío.");
            return;
        }

        this.isLoading = true;

        // Datos de notificación en cola.
        this.notifColaForm.medio = this.notificacionForm.notif_medio;
        this.notifColaForm.tipo = this.notificacionForm.notif_tipo;
        this.notifColaForm.persona = this.notificacionForm.notif_persona;
        this.notifColaForm.referencia = this.notificacionForm.notif_referencia;
        this.notifColaForm.estado = 8; // Estado: En cola
        this.notifColaForm.usuario = this.userLogin.usuario;
        this.notifColaForm.observaciones = "Notificación ID " + this.notificacionForm.notificacion + ": Puesta en cola.";

        this.notifColaComparendoForm.comparendo = this.notificacionForm.comparendo;

        this.notifColaDireccionForm.direccion = this.notificacionForm.notif_direccion != null ? this.notificacionForm.notif_direccion : null;
        this.notifColaDireccionForm.divipo = this.notificacionForm.notif_dir_divipo != null ? this.notificacionForm.notif_dir_divipo : null;
        this.notifColaDireccionForm.descripcion = this.notificacionForm.notif_dir_descripcion != null ? this.notificacionForm.notif_dir_descripcion : null;

        let notifColaString = this.generarNotifColaString(this.notifColaForm, this.notifColaComparendoForm, this.notifColaDireccionForm);

        this.notifColaService.insert(notifColaString).then(
            (res) => {
                // Datos de notificación.
                this.notificacionForm.estado = 8; // Estado: En cola

                let notificacionString = this.generarNotificacionString(this.notificacionForm);

                this.notificacionService.update(notificacionString, this.notificacionForm.notificacion).then(
                    (res) => {
                        // Datos de seguimiento de notificación.
                        this.notifSeguimientoForm.notificacion = this.notificacionForm.notificacion;
                        this.notifSeguimientoForm.estado = 8; // Estado: En cola
                        this.notifSeguimientoForm.usuario = this.userLogin.usuario;
                        this.notifSeguimientoForm.observaciones = this.notifColaForm.observaciones;

                        let notifSeguimientoString = this.generarNotifSeguimientoString(this.notifSeguimientoForm);

                        this.notifSeguimientoService.insert(notifSeguimientoString).then(
                            (res) => {
                                this.auditar(this.notifColaForm, this.notifColaComparendoForm, this.notifColaDireccionForm);
                                this.isLoading = false;

                                this.notificationService.success("Operación exitosa", "La notificación ha sido puesta En cola.");
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

    private generarNotifColaString(notifCola, notifColaComparendo, notifColaDireccion) : string
    {
        let json_notif_cola: Object = {};

        json_notif_cola = {
            medio : (notifCola.medio != null ? notifCola.medio : ''),
            tipo : (notifCola.tipo != null ? notifCola.tipo : ''),
            persona : (notifCola.persona != null ? notifCola.persona : ''),
            referencia : (notifCola.referencia != null ? notifCola.referencia : ''),
            estado : (notifCola.estado != null ? notifCola.estado : ''),
            usuario : this.userLogin.usuario,
            observaciones : (notifCola.observaciones != null ? notifCola.observaciones : ''),
            cola : 1,
            comparendo : (notifColaComparendo.comparendo != null ? notifColaComparendo.comparendo : ''),
            direccion : (notifColaDireccion.direccion != null ? notifColaDireccion.direccion : ''),
            divipo : (notifColaDireccion.divipo != null ? notifColaDireccion.divipo : ''),
            descripcion : (notifColaDireccion.descripcion != null ? notifColaDireccion.descripcion : '')
        }

        return '&notif_cola=' + JSON.stringify(json_notif_cola).replace(/"/g, '\\"');
    }

    private generarNotificacionString(notificacion) : string
    {
        return '&notificacion=' + (notificacion.notificacion != null ? notificacion.notificacion : '') +
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

    private auditar(notifCola, notifColaComparendo, notifColaDireccion) : boolean
    {
        try
        {
            let notifColaAudit = this.generarNotifColaAudit(notifCola, notifColaComparendo, notifColaDireccion);
            this.auditoriaService.insert(this.opcion.opcion, this.accionAudit, notifColaAudit);

            return true;
        }
        catch(error)
        {
            return false;
        }
    }

    private generarNotifColaAudit(notifCola, notifColaComparendo, notifColaDireccion) : string
    {
        let notifSeguimientoAudit = {
            medio : notifCola.medio,
            tipo : notifCola.tipo,
            persona : notifCola.persona,
            referencia : notifCola.referencia,
            estado : notifCola.estado,
            usuario : this.userLogin.usuario,
            observaciones : notifCola.observaciones,
            cola : 1,
            comparendo : notifColaComparendo.comparendo,
            direccion : notifColaDireccion.direccion,
            divipo : notifColaDireccion.divipo,
            descripcion : notifColaDireccion.descripcion
        };

        return JSON.stringify(notifSeguimientoAudit);
    }

    private resetFormulario() : void
    {
        this.notifColaForm = {
            notificacion_cola: null,
            medio: null,
            tipo: null,
            fecha: "",
            persona: null,
            referencia: "",
            estado: null,
            fecha_desde: "",
            fecha_hasta: "",
            motivo_rechazo: null,
            usuario: null,
            observaciones: "",
            cola: null,
            notimasiva: null
        };

        this.notifColaComparendoForm = {
            notif_cola_comparendo: null,
            notif_cola: null,
            comparendo: null
        };

        this.notifColaDireccionForm = {
            notif_cola_direccion: null,
            notif_cola: null,
            direccion: null,
            divipo: null,
            descripcion: ""
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
        jQuery('#cola-envios').modal('hide');
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
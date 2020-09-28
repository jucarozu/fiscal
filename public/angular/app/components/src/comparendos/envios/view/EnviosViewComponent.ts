import { Component, Input, OnInit } from '@angular/core';

import { CanActivate, ComponentInstruction, ROUTER_DIRECTIVES, Router } from '@angular/router-deprecated';
import { IsLoggedIn } from '../../../../../constants/IsLoggedIn';

import { IEnvio } from "../../../../../interfaces/IEnvio";
import { INotificacion } from "../../../../../interfaces/INotificacion";
import { IPersona } from "../../../../../interfaces/IPersona";
import { IUsuario } from "../../../../../interfaces/IUsuario";
import { IOpcion } from "../../../../../interfaces/IOpcion";

import { AuthService } from '../../../../../services/AuthService';
import { NotificacionService } from "../../../../../services/NotificacionService";
import { ParametroService } from "../../../../../services/ParametroService";
import { ComparendoService } from "../../../../../services/ComparendoService";
import { AuditoriaService } from "../../../../../services/AuditoriaService";

import { EnviosDetalleComponent } from "../detalle/EnviosDetalleComponent";
import { EnviosEntregadoComponent } from "../entregado/EnviosEntregadoComponent";
import { EnviosDevueltoComponent } from "../devuelto/EnviosDevueltoComponent";
import { EnviosDescarteComponent } from "../descarte/EnviosDescarteComponent";
import { EnviosAnularComponent } from "../anular/EnviosAnularComponent";
import { EnviosColaComponent } from "../cola/EnviosColaComponent";
import { EnviosFijarComponent } from "../fijar/EnviosFijarComponent";
import { EnviosDesfijarComponent } from "../desfijar/EnviosDesfijarComponent";
import { DireccionAddComponent } from "../../../administracion/direcciones/add/DireccionAddComponent";

import { DataTable, Column } from 'primeng/primeng';

import { NotificationsService } from 'angular2-notifications/components';
import { SimpleNotificationsComponent } from 'angular2-notifications/components';

declare var jQuery : any;
 
@Component({
    selector: 'envios-view',
    templateUrl: './app/components/src/comparendos/envios/view/envios-view.html',
    bindings: [AuthService, NotificacionService, ComparendoService, ParametroService, AuditoriaService, NotificationsService],
    directives: [
        EnviosDetalleComponent,
        EnviosEntregadoComponent,
        EnviosDevueltoComponent,
        EnviosDescarteComponent,
        EnviosAnularComponent,
        EnviosColaComponent,
        EnviosFijarComponent,
        EnviosDesfijarComponent,
        DireccionAddComponent,
        DataTable, Column,
        SimpleNotificationsComponent
    ]
})

@CanActivate((next: ComponentInstruction, previous: ComponentInstruction) => {
    return IsLoggedIn(next, previous);
})

export class EnviosViewComponent implements OnInit
{
	isLoading: boolean = false;

    accionAudit: number = 1; // Consultar

    gpTipoNotif: number = 40;
    gpTipoDocumento: number = 1;
    gpEstado: number = 41;

    userLogin: IUsuario;
    opcion: IOpcion;

    envioFilter: IEnvio;
    personaForm: IPersona;

    notificaciones: Array<INotificacion>;
    selectedNotificacion: Object = {};

    tiposNotif: Array<Object> = [];
    documentos: Array<Object> = [];
    estados: Array<Object> = [];
    
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
                private authService: AuthService,
                private notificacionService: NotificacionService,
                private comparendoService: ComparendoService,
                private parametroService: ParametroService,
                private auditoriaService: AuditoriaService,
                private notificationService: NotificationsService) {}

    ngOnInit()
    {
        if (!this.authService.authorize())
            this.router.navigate(['Perfil']);

        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));

        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));

        this.resetFilter();

        this.agregarEventos();
        this.cargarCombos();

        this.getNotificaciones();

        this.auditoriaService.insert(this.opcion.opcion, this.accionAudit);
    }

    private agregarEventos()
    {
        jQuery('#entregado-envios').on('hide.bs.modal', function() {
            jQuery('#btn-buscar').click();
        });

        jQuery('#devuelto-envios').on('hide.bs.modal', function() {
            jQuery('#btn-buscar').click();
        });

        jQuery('#descarte-envios').on('hide.bs.modal', function() {
            jQuery('#btn-buscar').click();
        });

        jQuery('#anular-envios').on('hide.bs.modal', function() {
            jQuery('#btn-buscar').click();
        });

        jQuery('#cola-envios').on('hide.bs.modal', function() {
            jQuery('#btn-buscar').click();
        });

        jQuery('#fijar-envios').on('hide.bs.modal', function() {
            jQuery('#btn-buscar').click();
        });

        jQuery('#desfijar-envios').on('hide.bs.modal', function() {
            jQuery('#btn-buscar').click();
        });
    }

    private cargarCombos()
    {
        this.parametroService.getByGrupo(this.gpTipoNotif).then(tiposNotif => { this.tiposNotif = tiposNotif });
        this.parametroService.getByGrupo(this.gpTipoDocumento).then(documentos => { this.documentos = documentos });
        this.parametroService.getByGrupo(this.gpEstado).then(estados => { this.estados = estados });
    }

    public getNotificaciones()
    {
        this.isLoading = true;

        this.notificacionService.getByFilters(
            this.envioFilter.notificacion != "" ? this.envioFilter.notificacion : "0",
            this.envioFilter.notif_tipo != null ? this.envioFilter.notif_tipo : 0,
            this.envioFilter.numero != "" ? this.envioFilter.numero : "0",
            this.envioFilter.notif_tipo_doc != null ? this.envioFilter.notif_tipo_doc : 0,
            this.envioFilter.notif_numero_doc != "" ? this.envioFilter.notif_numero_doc : "0",
            this.envioFilter.notif_estado != null ? this.envioFilter.notif_estado : 0
        ).then(
            notificaciones => {
                this.notificaciones = notificaciones;
                this.isLoading = false;
            }
        ).catch(
            error => {
                this.notificationService.error("Error", "Ha ocurrido un error en la búsqueda de notificaciones.");
                this.isLoading = false;
            }
        );
    }

    private resetFilter() : void
    {
        this.envioFilter = { 
            notificacion : "",
            notif_tipo : null,
            numero : "",
            notif_tipo_doc : null,
            notif_numero_doc : "",
            notif_estado : 2 // Estado: Enviada
        };
    }

    private selectNotificacion(notificacion)
    {
        this.selectedNotificacion = notificacion;
        
        this.personaForm = {
            persona : notificacion.notif_persona,
            tipo_doc : notificacion.notif_tipo_doc,
            tipo_doc_desc: notificacion.notif_tipo_doc_desc,
            numero_doc: notificacion.notif_numero_doc,
            fecha_exped_doc: null,
            divipo_doc: null,
            cod_departamento_doc: null,
            cod_municipio_doc: null,
            nombres: notificacion.notif_nombres,
            apellidos: notificacion.notif_apellidos,
            nombres_apellidos: notificacion.notif_nombres_apellidos,
            email: null,
            genero: null,
            genero_desc: null,
            grupo_sanguineo: null,
            grupo_sanguineo_desc: null,
            numero_celular: null,
            fecha_registro: null,
            usuario_registra: null,
            usuario_registra_desc: null
        };
    }

    private loading() : boolean
    {
        return this.isLoading;
    }
}
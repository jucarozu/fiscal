import { Component, Input, OnInit } from '@angular/core';

import { IFuente } from "../../../../../interfaces/IFuente";

import { IPersona } from "../../../../../interfaces/IPersona";
import { IUsuario } from "../../../../../interfaces/IUsuario";
import { IOpcion } from "../../../../../interfaces/IOpcion";

import { FuenteService } from "../../../../../services/FuenteService";
import { PersonaService } from "../../../../../services/PersonaService";
import { ParametroService } from "../../../../../services/ParametroService";
import { AuditoriaService } from "../../../../../services/AuditoriaService";

import { NotificationsService } from 'angular2-notifications/components';
import { SimpleNotificationsComponent } from 'angular2-notifications/components';

import { GOOGLE_MAPS_DIRECTIVES, MouseEvent } from 'angular2-google-maps/core';

declare var jQuery : any;

@Component({
    selector: 'fuente-edit',
    templateUrl: './app/components/src/administracion/fuentes/edit/fuente-edit.html',
    bindings: [FuenteService, PersonaService, ParametroService, AuditoriaService, NotificationsService],
    directives: [
        SimpleNotificationsComponent,
        GOOGLE_MAPS_DIRECTIVES
    ]
})
 
export class FuenteEditComponent implements OnInit
{
    isLoading: boolean = false;

    accionAudit: number = 3; // Editar

    gpTipoDocumento: number = 1;
    gpTipoFuente: number = 12;

    userLogin: IUsuario;
    opcion: IOpcion;

    @Input('fuente') fuenteForm: IFuente;

    errores: Array<Object> = [];

    documentos: Array<Object> = [];
    tiposFuentes: Array<Object> = [];

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

    zoom: number = 15;
    lat: number = 10.335733927654234;
    lng: number = -75.41285991668701;

    constructor(private fuenteService: FuenteService,
                private personaService: PersonaService,
                private parametroService: ParametroService,
                private auditoriaService: AuditoriaService,
                private notificationService: NotificationsService) {}

    ngOnInit()
    {
        if (this.userLogin == null)
            this.userLogin = JSON.parse(localStorage.getItem('user_login'));

        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));

        this.agregarEventos();
        this.cargarCombos();

        this.fuenteForm.latitud = 0.0;
        this.fuenteForm.longitud = 0.0;
    }

    private agregarEventos()
    {
        jQuery('#edit-fuente').on('shown.bs.modal', function() {
            jQuery('#btn-reset-edit').click();
            jQuery('#btn-load-mapa-edit').click();
        });
    }

    private cargarCombos()
    {
        this.parametroService.getByGrupo(this.gpTipoDocumento).then(documentos => { this.documentos = documentos });
        this.parametroService.getByGrupo(this.gpTipoFuente).then(tiposFuentes => { this.tiposFuentes = tiposFuentes });
    }
 
    private actualizar()
    {
        this.isLoading = true;
        this.resetErrores();

    	let fuenteString = this.generarFuenteString(this.fuenteForm);
 
        this.fuenteService.update(fuenteString, this.fuenteForm.fuente).then(
            (res) => {
                this.auditar(res.fuente);
                this.isLoading = false;
                
                this.notificationService.success("Operación exitosa", "La fuente de evidencias fue modificada correctamente.");
                this.cerrarVentana();
            },
            (error) => {
                this.isLoading = false;
                
                // Código de respuesta de Laravel cuando falla la validación
                if (error.status === 422)
                {
                    let errores = error.json();

                    for (var key in errores)
                    {
                        this.errores.push(errores[key]);
                    }
                }
                else
                {
                    this.errores.push("Ha ocurrido un error al modificar la fuente de evidencias.");
                }
            }
        );
    }

    private generarFuenteString(fuente) : string
    {
        return '&fuente=' + (fuente.fuente != null ? fuente.fuente : '') +
               '&desde=' + (fuente.desde != null ? fuente.desde : '') +
               '&hasta=' + (fuente.hasta != null ? fuente.hasta : '') +
               '&latitud=' + (fuente.latitud != null ? fuente.latitud : '') +
               '&longitud=' + (fuente.longitud != null ? fuente.longitud : '') +
               '&referencia_ubicacion=' + (fuente.referencia_ubicacion != null ? fuente.referencia_ubicacion : '') +
               '&observaciones=' + (fuente.observaciones != null ? fuente.observaciones : '') +
               '&ws=' + (fuente.ws ? 1 : 0) +
               '&ftp=' + (fuente.ftp ? 1 : 0);
    }

    private auditar(fuente) : boolean
    {
        try
        {
            let fuenteAudit = this.generarFuenteAudit(fuente);
            this.auditoriaService.insert(this.opcion.opcion, this.accionAudit, fuenteAudit);

            return true;
        }
        catch(error)
        {
            return false;
        }
    }

    private generarFuenteAudit(fuente) : string
    {
        let fuenteAudit = {
            fuente: fuente['fuente'],
            desde: fuente['desde'],
            hasta: fuente['hasta'],
            latitud: fuente['latitud'],
            longitud: fuente['longitud'],
            referencia_ubicacion: fuente['referencia_ubicacion'],
            observaciones: fuente['observaciones'],
            ws: fuente['ws'],
            ftp: fuente['ftp']
        };

        return JSON.stringify(fuenteAudit);
    }

    private resetFormulario() : void
    {
        this.fuenteService.getById(this.fuenteForm.fuente).then(
            fuente => {
                this.fuenteForm = fuente;

                if (this.fuenteForm.latitud != null && this.fuenteForm.longitud != null)
                {
                    this.fuenteForm.latitud = parseFloat(this.fuenteForm.latitud);
                    this.fuenteForm.longitud = parseFloat(this.fuenteForm.longitud);
                }
            }
        );
    }

    private resetErrores() : void
    {
        this.errores = [];
    }

    private cerrarVentana() : void
    {
        jQuery('#edit-fuente').modal('hide');
    }

    private close() : void
    {
        this.resetErrores();
        this.cerrarVentana();
    }

    private loading() : boolean
    {
        return this.isLoading;
    }

    mapClicked($event: MouseEvent)
    {
        this.fuenteForm.latitud = $event.coords.lat;
        this.fuenteForm.longitud = $event.coords.lng;
    }

    markerDragEnd($event: MouseEvent)
    {
        this.fuenteForm.latitud = $event.coords.lat;
        this.fuenteForm.longitud = $event.coords.lng;
    }
}
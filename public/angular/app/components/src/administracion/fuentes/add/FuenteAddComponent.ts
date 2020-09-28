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
    selector: 'fuente-add',
    templateUrl: './app/components/src/administracion/fuentes/add/fuente-add.html',
    bindings: [FuenteService, PersonaService, ParametroService, AuditoriaService, NotificationsService],
    directives: [
        SimpleNotificationsComponent,
        GOOGLE_MAPS_DIRECTIVES
    ]
})

export class FuenteAddComponent implements OnInit
{
	isLoading: boolean = false;

    accionAudit: number = 2; // Adicionar

    gpTipoDocumento: number = 1;
    gpTipoFuente: number = 12;

    userLogin: IUsuario;
    opcion: IOpcion;

    fuenteForm: IFuente;
    personaForm: IPersona;
    
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

        this.resetFormulario();
        
        this.agregarEventos();
        this.cargarCombos();
    }

    private agregarEventos()
    {
        jQuery('#add-fuente').on('shown.bs.modal', function() {
            jQuery('#btn-reset-add').click();
            jQuery('#btn-load-mapa-add').click();
        });

        jQuery('#add-persona').on('hide.bs.modal', function() {
            jQuery('#btn-load-persona').click();
        });
    }

    private cargarCombos()
    {
        this.parametroService.getByGrupo(this.gpTipoDocumento).then(documentos => { this.documentos = documentos });
        this.parametroService.getByGrupo(this.gpTipoFuente).then(tiposFuentes => { this.tiposFuentes = tiposFuentes });
    }

    public cargarPersona()
    {
        this.personaService.getByDocumento(this.fuenteForm.prov_tipo_doc, this.fuenteForm.prov_numero_doc)
            .then(persona =>
                {
                    if (persona != null)
                    {
                        this.fuenteForm.proveedor = persona.persona;
                        this.fuenteForm.prov_nombre = persona.nombres_apellidos;
                    }
                }
            );
    }

    private getPersonaByDocumento() : void
    {
        this.errores = [];

        if (this.fuenteForm.prov_tipo_doc == null)
            return;

        if (this.fuenteForm.prov_numero_doc == "")
            return;

        if (isNaN(Number(this.fuenteForm.prov_numero_doc)))
        {
            this.errores.push("El número de documento debe ser numérico.");
            return;
        }

        this.personaService.getByDocumento(this.fuenteForm.prov_tipo_doc, this.fuenteForm.prov_numero_doc)
            .then(persona =>
                {
                    this.personaForm.tipo_doc = this.fuenteForm.prov_tipo_doc;
                    this.personaForm.numero_doc = this.fuenteForm.prov_numero_doc;

                    if (persona != null)
                    {
                        this.fuenteForm.proveedor = persona.persona;
                        this.fuenteForm.prov_nombre = persona.nombres_apellidos;
                    }
                    else
                    {
                        this.fuenteForm.proveedor = null;
                        this.fuenteForm.prov_nombre = "";

                        localStorage.setItem('input-persona', JSON.stringify(this.personaForm));
                        jQuery('#add-persona').modal({ backdrop: 'static' });
                    }
                }
            );
    }

    private insertar() : void
    {
        this.isLoading = true;
        this.resetErrores();

    	let fuenteString = this.generarFuenteString(this.fuenteForm);
 
        this.fuenteService.insert(fuenteString).then(
            (res) => {
                this.auditar(res.fuente);
                this.isLoading = false;
            
                this.notificationService.success("Operación exitosa", "La fuente de evidencias fue creada correctamente.");
                this.resetFormulario();
                this.cerrarVentana();
            },
            (error) => {
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
                    this.errores.push("Ha ocurrido un error al crear la fuente de evidencias.");
                }

                this.isLoading = false;
            }
        );
    }

    private generarFuenteString(fuente) : string
    {
        return '&tipo=' + (fuente.tipo != null ? fuente.tipo : '') +
               '&nombre=' + (fuente.nombre != null ? fuente.nombre : '') +
               '&proveedor=' + (fuente.proveedor != null ? fuente.proveedor : '') +
               '&desde=' + (fuente.desde != null ? fuente.desde : '') +
               '&hasta=' + (fuente.hasta != null ? fuente.hasta : '') +
               '&latitud=' + (fuente.latitud != null ? fuente.latitud : '') +
               '&longitud=' + (fuente.longitud != null ? fuente.longitud : '') +
               '&referencia_ubicacion=' + (fuente.referencia_ubicacion != null ? fuente.referencia_ubicacion : '') +
               '&observaciones=' + (fuente.observaciones != null ? fuente.observaciones : '') +
               '&ws=' + (fuente.ws ? 1 : 0) +
               '&ftp=' + (fuente.ftp ? 1 : 0) +
               '&usuario=' + this.userLogin.usuario;
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
            tipo: fuente['tipo'],
            nombre: fuente['nombre'],
            proveedor: fuente['proveedor'],
            desde: fuente['desde'],
            hasta: fuente['hasta'],
            latitud: fuente['latitud'],
            longitud: fuente['longitud'],
            referencia_ubicacion: fuente['referencia_ubicacion'],
            observaciones: fuente['observaciones'],
            ws: fuente['ws'],
            ftp: fuente['ftp'],
            usuario: fuente['usuario'],
            fecha_registra: fuente['fecha_registra']
        };

        return JSON.stringify(fuenteAudit);
    }

    private resetErrores() : void
    {
        this.errores = [];
    }

    private resetFormulario() : void
    {
        this.fuenteForm = JSON.parse('{' + 
            ' "tipo" : null,' +
            ' "nombre" : "",' +
            ' "proveedor" : null,' + 
            ' "prov_tipo_doc" : null,' + 
            ' "prov_numero_doc" : "",' + 
            ' "prov_nombre" : "",' +
            ' "desde" : "",' +
            ' "hasta" : "",' +
            ' "latitud" : null,' +
            ' "longitud" : null,' +
            ' "referencia_ubicacion" : "",' + 
            ' "observaciones" : "",' +
            ' "ws" : null,' +
            ' "ftp" : null' +
        '}');

        jQuery('#desde, #hasta').val("");

        this.personaForm = JSON.parse('{' +
            ' "tipo_doc" : null,' +
            ' "numero_doc" : ""' +
        '}');

        this.resetErrores();
    }

    private cerrarVentana() : void
    {
        jQuery('#add-fuente').modal('hide');
    }

    private close() : void
    {
        this.resetErrores();
        this.resetFormulario();
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
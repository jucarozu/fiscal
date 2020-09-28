import { Component, OnInit } from '@angular/core';

import { CanActivate, ComponentInstruction, ROUTER_DIRECTIVES, Router } from '@angular/router-deprecated';
import { IsLoggedIn } from '../../../../../constants/IsLoggedIn';

import { IPersona } from "../../../../../interfaces/IPersona";
import { IOpcion } from "../../../../../interfaces/IOpcion";

import { AuthService } from '../../../../../services/AuthService';
import { PersonaService } from "../../../../../services/PersonaService";
import { ParametroService } from "../../../../../services/ParametroService";
import { AuditoriaService } from "../../../../../services/AuditoriaService";

import { PersonaAddComponent } from "../add/PersonaAddComponent";
import { PersonaDetailComponent } from "../detail/PersonaDetailComponent";
import { PersonaEditComponent } from "../edit/PersonaEditComponent";

import { DataTable, Column } from 'primeng/primeng';

import { NotificationsService } from 'angular2-notifications/components';
import { SimpleNotificationsComponent } from 'angular2-notifications/components';

declare var jQuery : any;

@Component({
    selector: 'persona-view',
    templateUrl: './app/components/src/administracion/personas/view/persona-view.html',
    bindings: [AuthService, PersonaService, ParametroService, AuditoriaService, NotificationsService],
    directives: [
        ROUTER_DIRECTIVES, 
        PersonaAddComponent, 
        PersonaDetailComponent, 
        PersonaEditComponent, 
        DataTable, Column,
        SimpleNotificationsComponent
    ]
})

@CanActivate((next: ComponentInstruction, previous: ComponentInstruction) => {
    return IsLoggedIn(next, previous);
})
 
export class PersonaViewComponent implements OnInit
{
    isLoading: boolean = false;

    accionAudit: number = 1; // Consultar
    gpTipoDocumento: number = 1;

    opcion: IOpcion;
    
    personas: Array<IPersona>;
    selectedPersona: Object = {};

    personaFilter: IPersona;

    documentos: Array<Object> = [];

    notificationsOptions = {
        timeOut: 7000,
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
                private personaService: PersonaService, 
                private parametroService: ParametroService, 
                private auditoriaService: AuditoriaService, 
                private notificationService: NotificationsService) {}

    ngOnInit()
    {
        if (!this.authService.authorize())
            this.router.navigate(['Perfil']);
            
        if (this.opcion == null)
            this.opcion = JSON.parse(localStorage.getItem('opcion'));

        this.resetFilter();
        
        this.agregarEventos();
        this.cargarCombos();

        this.auditoriaService.insert(this.opcion.opcion, this.accionAudit);
    }

    private agregarEventos()
    {
        jQuery('#edit-persona').on('hide.bs.modal', function() {
            jQuery('#btn-buscar').click();
        });
    }

    private cargarCombos()
    {
        this.parametroService.getByGrupo(this.gpTipoDocumento).then(documentos => { this.documentos = documentos });
    }

    private getPersonas()
    {
        if (this.personaFilter.numero_doc != "" || (this.personaFilter.nombres != "" && this.personaFilter.apellidos != ""))
        {
            this.isLoading = true;

            this.personaService.getByFilters(
                this.personaFilter.tipo_doc != null ? this.personaFilter.tipo_doc : 0, 
                this.personaFilter.numero_doc != "" ? this.personaFilter.numero_doc : "0", 
                this.personaFilter.nombres != "" ? this.personaFilter.nombres : "0", 
                this.personaFilter.apellidos != "" ? this.personaFilter.apellidos : "0"
            ).then(
                personas => {
                    this.personas = personas;
                    this.isLoading = false;
                }
            ).catch(
                error => {
                    this.notificationService.error("Error", "Ha ocurrido un error en la búsqueda de personas.");
                    this.isLoading = false;
                }
            );
        }
        else
        {
            this.personas = null;
            this.notificationService.error("Atención", "Para realizar la búsqueda debe filtrar como mínimo por número de documento o por nombres y apellidos.");
        }
    }

    private resetFilter()
    {
        this.personaFilter = JSON.parse('{' + 
            ' "tipo_doc" : null,' + 
            ' "numero_doc" : "",' + 
            ' "nombres" : "",' + 
            ' "apellidos" : ""' + 
        '}');
    }

    private selectPersona(persona)
    {
        this.selectedPersona = persona;
    }

    private loading() : boolean
    {
        return this.isLoading;
    }
}
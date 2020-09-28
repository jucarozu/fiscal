import { Component, OnInit } from '@angular/core';

import { CanActivate, ComponentInstruction, ROUTER_DIRECTIVES, Router } from '@angular/router-deprecated';
import { IsLoggedIn } from '../../../../../constants/IsLoggedIn';

import { IAgente } from "../../../../../interfaces/IAgente";
import { IOpcion } from "../../../../../interfaces/IOpcion";

import { AuthService } from '../../../../../services/AuthService';
import { AgenteService } from "../../../../../services/AgenteService";
import { ParametroService } from "../../../../../services/ParametroService";
import { AuditoriaService } from "../../../../../services/AuditoriaService";

import { AgenteAddComponent } from "../add/AgenteAddComponent";
import { AgenteEditComponent } from "../edit/AgenteEditComponent";
import { AgenteDeleteComponent } from "../delete/AgenteDeleteComponent";

import { PersonaAddComponent } from "../../../administracion/personas/add/PersonaAddComponent";

import { DataTable, Column } from 'primeng/primeng';

import { NotificationsService } from 'angular2-notifications/components';
import { SimpleNotificationsComponent } from 'angular2-notifications/components';

declare var jQuery : any;

@Component({
    selector: 'agente-view',
    templateUrl: './app/components/src/administracion/agentes/view/agente-view.html',
    bindings: [AuthService, AgenteService, ParametroService, AuditoriaService, NotificationsService],
    directives: [
        ROUTER_DIRECTIVES, 
        AgenteAddComponent, 
        AgenteEditComponent,
        AgenteDeleteComponent,
        PersonaAddComponent, 
        DataTable, Column,
        SimpleNotificationsComponent
    ]
})

@CanActivate((next: ComponentInstruction, previous: ComponentInstruction) => {
    return IsLoggedIn(next, previous);
})
 
export class AgenteViewComponent implements OnInit
{
    isLoading: boolean = false;

    accionAudit: number = 1; // Consultar
    
    gpTipoDocumento: number = 1;
    gpEntidad: number = 10;
    gpEstado: number = 11;

    opcion: IOpcion;
    
    agentes: Array<IAgente>;
    selectedAgente: Object = {};

    agenteFilter: IAgente;

    documentos: Array<Object> = [];
    entidades: Array<Object> = [];
    estados: Array<Object> = [];

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
                private agenteService: AgenteService,
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
        this.getAgentes();
        
        this.agregarEventos();
        this.cargarCombos();

        this.auditoriaService.insert(this.opcion.opcion, this.accionAudit);
    }

    private agregarEventos()
    {
        jQuery('#add-agente, #edit-agente').on('hide.bs.modal', function() {
            jQuery('#btn-buscar').click();
        });
    }

    private cargarCombos()
    {
        this.parametroService.getByGrupo(this.gpTipoDocumento).then(documentos => { this.documentos = documentos });
        this.parametroService.getByGrupo(this.gpEntidad).then(entidades => { this.entidades = entidades });
        this.parametroService.getByGrupo(this.gpEstado).then(estados => { this.estados = estados });
    }

    private getAgentes()
    {
        this.isLoading = true;

        this.agenteService.getByFilters(
            this.agenteFilter.entidad != null ? this.agenteFilter.entidad : 0, 
            this.agenteFilter.placa != "" ? this.agenteFilter.placa : "0", 
            this.agenteFilter.tipo_doc != null ? this.agenteFilter.tipo_doc : 0, 
            this.agenteFilter.numero_doc != "" ? this.agenteFilter.numero_doc : "0", 
            this.agenteFilter.nombres_apellidos != "" ? this.agenteFilter.nombres_apellidos : "0", 
            this.agenteFilter.estado != null ? this.agenteFilter.estado : 0
        ).then(
            agentes => {
                this.agentes = agentes;
                this.isLoading = false;
            }
        ).catch(
            error => {
                this.notificationService.error("Error", "Ha ocurrido un error en la búsqueda de agentes de tránsito.");
                this.isLoading = false;
            }
        );
    }

    private resetFilter()
    {
        this.agenteFilter = JSON.parse('{' + 
            ' "entidad" : null,' +
            ' "placa" : "",' +
            ' "tipo_doc" : null,' + 
            ' "numero_doc" : "",' + 
            ' "nombres_apellidos" : "",' + 
            ' "estado" : null' + 
        '}');
    }

    private selectAgente(agente)
    {
        this.selectedAgente = agente;
    }

    private loading() : boolean
    {
        return this.isLoading;
    }
}
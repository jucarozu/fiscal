import { Component, OnInit } from '@angular/core';

import { CanActivate, ComponentInstruction, ROUTER_DIRECTIVES, Router } from '@angular/router-deprecated';
import { IsLoggedIn } from '../../../../../constants/IsLoggedIn';

import { IDireccion } from "../../../../../interfaces/IDireccion";
import { IOpcion } from "../../../../../interfaces/IOpcion";

import { AuthService } from '../../../../../services/AuthService';
import { DireccionService } from "../../../../../services/DireccionService";
import { ParametroService } from "../../../../../services/ParametroService";
import { AuditoriaService } from "../../../../../services/AuditoriaService";

import { DireccionAddComponent } from "../add/DireccionAddComponent";
import { DireccionEditComponent } from "../edit/DireccionEditComponent";

import { PersonaAddComponent } from "../../../administracion/personas/add/PersonaAddComponent";

import { DataTable, Column } from 'primeng/primeng';

import { NotificationsService } from 'angular2-notifications/components';
import { SimpleNotificationsComponent } from 'angular2-notifications/components';

declare var jQuery : any;

@Component({
    selector: 'direccion-view',
    templateUrl: './app/components/src/administracion/direcciones/view/direccion-view.html',
    bindings: [AuthService, DireccionService, ParametroService, AuditoriaService, NotificationsService],
    directives: [
        ROUTER_DIRECTIVES, 
        DireccionAddComponent, 
        DireccionEditComponent,
        PersonaAddComponent, 
        DataTable, Column,
        SimpleNotificationsComponent
    ]
})

@CanActivate((next: ComponentInstruction, previous: ComponentInstruction) => {
    return IsLoggedIn(next, previous);
})
 
export class DireccionViewComponent implements OnInit
{
    isLoading: boolean = false;

    accionAudit: number = 1; // Consultar
    
    gpTipoDocumento: number = 1;

    opcion: IOpcion;
    
    direcciones: Array<IDireccion>;
    selectedDireccion: Object = {};

    direccionFilter: IDireccion;

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
                private direccionService: DireccionService,
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
        jQuery('#edit-direccion').on('hide.bs.modal', function() {
            jQuery('#btn-buscar').click();
        });
    }

    private cargarCombos()
    {
        this.parametroService.getByGrupo(this.gpTipoDocumento).then(documentos => { this.documentos = documentos });
    }

    private getDirecciones()
    {
        if (this.direccionFilter.numero_doc != "")
        {
            this.isLoading = true;

            this.direccionService.getByFilters(
                this.direccionFilter.tipo_doc != null ? this.direccionFilter.tipo_doc : 0, 
                this.direccionFilter.numero_doc != "" ? this.direccionFilter.numero_doc : "0"
            ).then(
                direcciones => {
                    this.direcciones = direcciones;
                    this.isLoading = false;
                }
            ).catch(
                error => {
                    this.notificationService.error("Error", "Ha ocurrido un error en la búsqueda de direcciones.");
                    this.isLoading = false;
                }
            );
        }
        else
        {
            this.direcciones = null;
            this.notificationService.error("Atención", "Para realizar la búsqueda debe filtrar como mínimo por número de documento.");
        }
    }

    private resetFilter()
    {
        this.direccionFilter = JSON.parse('{' + 
            ' "tipo_doc" : null,' + 
            ' "numero_doc" : ""' +
        '}');
    }

    private selectDireccion(direccion)
    {
        this.selectedDireccion = direccion;
    }

    private loading() : boolean
    {
        return this.isLoading;
    }
}